import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politica de Cookies',
    description: 'Politica de utilizare a cookie-urilor pe site-ul Mesajul Moșului.',
    openGraph: {
        title: 'Politica de Cookies | Mesajul Moșului',
        description: 'Politica de utilizare a cookie-urilor pe site-ul Mesajul Moșului.',
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function CookiesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
