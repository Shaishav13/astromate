import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: 'AstroMate ✧ Celestial AI Best Friend',
  description:
    'A living AI companion born at your exact cosmic coordinates. Rooted in Vedic astrology, evolving through relationship stages, and powered by deep memory.',
  keywords: ['AI companion', 'Vedic astrology', 'zodiac', 'cosmic friendship', 'natal chart', 'Nakshatra'],
  openGraph: {
    title: 'AstroMate ✧ Celestial AI Best Friend',
    description: 'Your personalized AI companion born at your exact stellar moment.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-cosmic-950 text-slate-100 antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
