import OpenAI from 'openai';

export const runtime = 'nodejs';

const allowedTerms = new Set([
  'Application Scrutiny',
  'Document Verification',
  'Driving Licence Number',
  'Form 1A',
  'Medical Certificate',
]);

const allowedContexts = new Set([
  'application form',
  'document checklist',
  'next steps after applying',
]);

const prototypeFallbackExplanations = {
  'Form 1A': {
    meaning: 'Form 1A is a medical certificate used for some driving licence applications. It is generally completed and signed by a registered medical practitioner.',
    why: 'You may be asked for it because medical fitness evidence can be required for certain licence classes, ages, or application circumstances.',
    nextStep: 'Check the requirement shown for your application, use the current official form, and ask the relevant licensing authority if you are unsure whether it applies to you.',
  },
  'Medical Certificate': {
    meaning: 'A medical certificate is a document in which an authorised medical practitioner records information about your fitness to drive.',
    why: 'It may appear when the licensing process needs medical fitness evidence based on the type of licence or the applicant’s circumstances.',
    nextStep: 'Confirm which certificate or form is required, have it completed by an eligible medical practitioner, and verify current instructions on Parivahan or with the licensing authority.',
  },
  'Document Verification': {
    meaning: 'Document Verification is the step where the submitted documents and their details are checked for completeness and consistency.',
    why: 'It may appear after submission because the licensing authority needs to check the documents supporting the application before moving ahead.',
    nextStep: 'Keep the originals or requested copies ready, watch for any request for clarification, and follow the instructions shown in your application or issued by the licensing authority.',
  },
  'Application Scrutiny': {
    meaning: 'Application Scrutiny is a review of the application and supporting information by the licensing authority.',
    why: 'It may appear while officials are checking whether the application is complete and can proceed to the next stage.',
    nextStep: 'Monitor the application status and respond to any official request for corrections or additional documents. The licensing authority makes the final decision.',
  },
  'Driving Licence Number': {
    meaning: 'A Driving Licence Number is the unique reference printed on a driving licence and used to identify its official record.',
    why: 'You may be seeing it because the service needs to find the existing licence record for an application such as renewal.',
    nextStep: 'Enter the number exactly as it appears on the driving licence. If it is unclear or is not accepted, check the guidance on Parivahan or contact the relevant licensing authority.',
  },
};

const disclaimer = 'Guidance only. Verify official requirements on Parivahan.';

const responseFormat = {
  type: 'json_schema',
  name: 'citizen_explanation',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      meaning: { type: 'string' },
      why: { type: 'string' },
      nextStep: { type: 'string' },
    },
    required: ['meaning', 'why', 'nextStep'],
    additionalProperties: false,
  },
};

const sensitiveKeyPattern = /api[-_]?key|authorization|cookie|secret|token/i;

function redactSensitiveText(value) {
  let redacted = value
    .replace(/Bearer\s+[^\s,;]+/gi, 'Bearer [REDACTED]')
    .replace(/\bsk-[A-Za-z0-9_-]+\b/g, '[REDACTED_API_KEY]');

  if (process.env.OPENAI_API_KEY) {
    redacted = redacted.replaceAll(process.env.OPENAI_API_KEY, '[REDACTED_API_KEY]');
  }

  return redacted;
}

function sanitizeForLog(value, seen = new WeakSet()) {
  if (typeof value === 'string') return redactSensitiveText(value);
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return '[Circular]';
  seen.add(value);

  const source = value instanceof Error
    ? Object.fromEntries(
        [...new Set(['name', 'message', 'stack', ...Object.getOwnPropertyNames(value)])]
          .map((key) => [key, value[key]]),
      )
    : value;

  if (Array.isArray(source)) {
    return source.map((item) => sanitizeForLog(item, seen));
  }

  return Object.fromEntries(
    Object.entries(source).map(([key, item]) => [
      key,
      sensitiveKeyPattern.test(key) ? '[REDACTED]' : sanitizeForLog(item, seen),
    ]),
  );
}

function getUpstreamStatus(error) {
  const status = Number(error?.status);
  return Number.isInteger(status) && status >= 400 && status <= 599 ? status : null;
}

function isQuotaOrBillingError(error) {
  const status = getUpstreamStatus(error);
  const code = String(error?.code || error?.error?.code || '').toLowerCase();
  const type = String(error?.type || error?.error?.type || '').toLowerCase();
  const message = String(error?.message || error?.error?.message || '').toLowerCase();

  return code === 'insufficient_quota'
    || type === 'insufficient_quota'
    || (status === 429 && /quota|billing|credits?/.test(`${code} ${type} ${message}`));
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const term = typeof body?.term === 'string' ? body.term.trim() : '';
  const context = typeof body?.context === 'string' ? body.context.trim() : '';

  if (!allowedTerms.has(term) || !allowedContexts.has(context)) {
    return Response.json({ ok: false, error: 'This term cannot be explained.' }, { status: 400 });
  }

  const fallbackExplanation = prototypeFallbackExplanations[term];
  if (!process.env.OPENAI_API_KEY && fallbackExplanation) {
    return Response.json({
      ok: true,
      explanation: fallbackExplanation,
      source: 'fallback',
      disclaimer,
      apiFailure: {
        code: 'MISSING_API_KEY',
        message: 'The OpenAI explanation service is not configured, so local prototype guidance is shown instead.',
      },
    });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 12_000, maxRetries: 1 });
    const response = await openai.responses.create({
      model: 'gpt-5.4-mini',
      store: false,
      max_output_tokens: 300,
      instructions: [
        'Explain Indian driving licence renewal terminology to a citizen in calm, simple English.',
        'Return three short sections: what the term means, why it may appear at this point, and what the citizen should do next.',
        'Be concise, practical, and non-authoritative. Use cautious wording such as may or generally where requirements can vary.',
        'Never decide or imply that you decide eligibility, approval, document validity, or any government outcome.',
        'Do not ask for or refer to personal information. Do not invent state-specific rules.',
        'Direct the citizen to Parivahan or the relevant licensing authority for official requirements.',
      ].join(' '),
      input: `Government term: ${term}\nNon-personal page context: ${context}`,
      text: { format: responseFormat },
    });

    const explanation = JSON.parse(response.output_text);
    return Response.json({ ok: true, source: 'openai', explanation, disclaimer });
  } catch (error) {
    const upstreamStatus = getUpstreamStatus(error);

    if (process.env.NODE_ENV === 'development') {
      console.error(
        'OpenAI explanation request failed (sanitized)',
        sanitizeForLog(error),
      );
    }

    // An upstream failure must not prevent known local guidance from being useful.
    // This includes quota/rate limits, timeouts, network failures, and 5xx errors.
    if (fallbackExplanation) {
      const quotaFailure = isQuotaOrBillingError(error);
      return Response.json({
        ok: true,
        explanation: fallbackExplanation,
        source: 'fallback',
        disclaimer,
        apiFailure: {
          code: quotaFailure ? 'OPENAI_QUOTA_ERROR' : 'OPENAI_UNAVAILABLE',
          message: quotaFailure
            ? 'The OpenAI explanation service was unavailable because of a billing or quota error, so local prototype guidance is shown instead.'
            : 'The OpenAI explanation service was temporarily unavailable, so local prototype guidance is shown instead.',
          ...(upstreamStatus ? { upstreamStatus } : {}),
        },
      });
    }

    return Response.json(
      {
        ok: false,
        code: 'OPENAI_API_ERROR',
        error: 'We could not load this explanation right now.',
        ...(upstreamStatus ? { upstreamStatus } : {}),
      },
      { status: upstreamStatus || 502 },
    );
  }
}
