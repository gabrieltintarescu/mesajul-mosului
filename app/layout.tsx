import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mesajul Mosului - Mesaje Video Personalizate de la Moș Crăciun",
  description: "Creează mesaje video magice, personalizate cu ajutorul AI de la Moș Crăciun pentru copilul tău. Fă acest Crăciun de neuitat cu un video în care Moșul îl strigă pe copil pe nume!",
  keywords: ["video Moș Crăciun", "mesaj personalizat Santa", "cadou de Crăciun", "AI Moș Crăciun", "video personalizat"],
  authors: [{ name: "SantaAI" }],
  icons: {
    icon: "/santaicon.png",
    apple: "/santaicon.png",
  },
  openGraph: {
    title: "SantaAI - Mesaje Video Personalizate de la Moș Crăciun",
    description: "Creează mesaje video magice personalizate de la Moș Crăciun pentru copilul tău",
    type: "website",
    locale: "ro_RO",
    siteName: "SantaAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SantaAI - Video Personalizat de la Moș Crăciun",
    description: "Creează mesaje video magice personalizate de la Moș Crăciun pentru copilul tău",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#c41e3a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
