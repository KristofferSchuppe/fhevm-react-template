import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FHEVM Next.js Template',
  description: 'Next.js application with FHEVM SDK integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
