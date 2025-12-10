import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ajutor',
    description: 'Ai nevoie de ajutor? Găsește informații utile despre serviciul Mesajul Moșului și cum să comanzi un video personalizat.',
    openGraph: {
        title: 'Ajutor | Mesajul Moșului',
        description: 'Ai nevoie de ajutor? Găsește informații utile despre serviciul nostru.',
    },
};

export default function HelpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
