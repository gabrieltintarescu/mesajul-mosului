import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politica de Confidențialitate',
    description: 'Politica de confidențialitate și protecția datelor personale pentru serviciul Mesajul Moșului.',
    openGraph: {
        title: 'Politica de Confidențialitate | Mesajul Moșului',
        description: 'Politica de confidențialitate și protecția datelor personale.',
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
