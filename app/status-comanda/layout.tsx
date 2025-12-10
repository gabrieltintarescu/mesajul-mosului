import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Status Comandă',
    description: 'Verifică statusul comenzii tale pentru videoclipul personalizat de la Moș Crăciun.',
    openGraph: {
        title: 'Status Comandă | Mesajul Moșului',
        description: 'Verifică statusul comenzii tale pentru videoclipul personalizat.',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function OrderStatusLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
