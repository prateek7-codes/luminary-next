import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luminary',
  description: 'A quiet journal for everyday reflection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
