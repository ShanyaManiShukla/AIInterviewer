import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import { Providers } from '@/app/providers';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Interview Practice - Master Your Technical Interviews',
  description:
    '400 curated interview questions across 20 skills. Practice with mock interviews and instant feedback.',
  openGraph: {
    title: 'AI Interview Practice',
    description: 'Master technical interviews with structured practice',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
