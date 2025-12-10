import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Contactează echipa Mesajul Moșului. Suntem aici să te ajutăm cu orice întrebare despre videoclipurile personalizate de la Moș Crăciun.',
    openGraph: {
        title: 'Contact | Mesajul Moșului',
        description: 'Contactează echipa Mesajul Moșului. Suntem aici să te ajutăm cu orice întrebare.',
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
