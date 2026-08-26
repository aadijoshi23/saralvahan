import './globals.css';

export const metadata = {
  title: 'SaralVahan | Driving licence renewal made simple',
  description:
    'A guided prototype that makes the driving licence renewal journey easier to understand.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
