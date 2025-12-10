import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Întrebări Frecvente',
    description: 'Găsește răspunsuri la cele mai frecvente întrebări despre serviciul Mesajul Moșului - videoclipuri personalizate de la Moș Crăciun.',
    openGraph: {
        title: 'Întrebări Frecvente | Mesajul Moșului',
        description: 'Găsește răspunsuri la cele mai frecvente întrebări despre videoclipurile personalizate.',
    },
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
