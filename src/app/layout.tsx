import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "MM Ennustus '26 | World Cup Predictions",
  description:
    'Ennusta 2026 FIFA jalgpalli maailmameistrivõistluste tulemusi ja võistle sõpradega! Predict FIFA World Cup 2026 match results and compete with friends!',
  keywords: ['World Cup', '2026', 'predictions', 'football', 'ennustus', 'jalgpall', 'MM'],
  openGraph: {
    title: "MM Ennustus '26",
    description: 'FIFA World Cup 2026 Prediction Game',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  );
}
