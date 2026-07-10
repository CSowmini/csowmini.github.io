import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono } from 'next/font/google';
import ParticleBackground from './components/ParticleBackground';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});


export const metadata: Metadata = {
  title: "Chandrika Sowmini - Data Engineer",
  description: "Portfolio of Chandrika Sowmini, Data Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light-mode">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
      </head>
      <body className={geistMono.variable}>
        <ParticleBackground />
        {children}
      </body>
    </html>
  );
}
