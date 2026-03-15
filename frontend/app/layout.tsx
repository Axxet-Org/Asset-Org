import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AssetsOrg — Asset Management',
  description: 'Enterprise asset tracking powered by Stellar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
