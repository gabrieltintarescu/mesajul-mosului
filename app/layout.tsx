import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mesajul-mosului.ro'),
  title: {
    default: "Mesajul Moșului - Mesaje Video Personalizate de la Moș Crăciun",
    template: "%s | Mesajul Moșului",
  },
  description: "Creează mesaje video magice, personalizate de la Moș Crăciun pentru copilul tău. Fă acest Crăciun de neuitat cu un video în care Moșul îl strigă pe copil pe nume!",
  keywords: ["video Moș Crăciun", "mesaj personalizat Santa", "cadou de Crăciun", "Moș Crăciun", "video personalizat"],
  authors: [{ name: "Mesajul Moșului" }],
  icons: {
    icon: "/santaicon2.png",
    apple: "/santaicon2.png",
  },
  openGraph: {
    title: "Mesajul Moșului - Mesaje Video Personalizate de la Moș Crăciun",
    description: "Creează mesaje video magice personalizate de la Moș Crăciun pentru copilul tău. Fă acest Crăciun de neuitat!",
    type: "website",
    locale: "ro_RO",
    siteName: "Mesajul Moșului",
    url: "https://mesajul-mosului.ro",
    images: [
      {
        url: "/santa_banner.png",
        width: 1200,
        height: 630,
        alt: "Mesajul Moșului - Video personalizat de la Moș Crăciun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mesajul Moșului - Video Personalizat de la Moș Crăciun",
    description: "Creează mesaje video magice personalizate de la Moș Crăciun pentru copilul tău",
    images: ["/santa_banner.png"],
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

        {/* TikTok Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D4U1QJJC77UEBHOP9DAG');
  ttq.page();
}(window, document, 'ttq');
            `,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
