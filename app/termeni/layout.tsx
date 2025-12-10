import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termeni și Condiții',
    description: 'Termenii și condițiile de utilizare a serviciului Mesajul Moșului - videoclipuri personalizate de la Moș Crăciun.',
    openGraph: {
        title: 'Termeni și Condiții | Mesajul Moșului',
        description: 'Termenii și condițiile de utilizare a serviciului Mesajul Moșului.',
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
