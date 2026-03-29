import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import CosmicBadge from '@/components/CosmicBadge';

export const metadata: Metadata = {
  title: 'Cosmic CRM',
  description: 'A modern CRM powered by Cosmic CMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💼</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  );
}