import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Site în Mentenanță | Mesajul Moșului",
    description: "Site-ul este momentan în mentenanță. Vom reveni în curând!",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MaintenanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
