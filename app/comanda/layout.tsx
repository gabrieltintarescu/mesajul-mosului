import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Comandă Video Personalizat',
    description: 'Comandă un videoclip personalizat de la Moș Crăciun pentru copilul tău. Proces simplu în 3 pași - completezi datele, plătești și primești videoclipul magic!',
    openGraph: {
        title: 'Comandă Video Personalizat | Mesajul Moșului',
        description: 'Comandă un videoclip personalizat de la Moș Crăciun. Proces simplu în 3 pași!',
    },
};

export default function OrderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
