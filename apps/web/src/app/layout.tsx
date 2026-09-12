import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstroMate - Your AI Best Friend',
  description:
    'A personalized AI companion that grows with you, rooted in astrology and powered by memory.',
  keywords: ['AI companion', 'astrology', 'chat', 'friendship', 'AI buddy'],
  openGraph: {
    title: 'AstroMate',
    description: 'Your AI best friend, powered by the stars.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-chat-bg antialiased">{children}</body>
    </html>
  );
}
