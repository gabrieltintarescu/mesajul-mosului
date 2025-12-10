'use client';

import { siteConfig } from '@/lib/config';
import { motion } from 'framer-motion';
import {
    Facebook,
    Heart,
    Instagram,
    Mail,
    Phone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// TikTok icon (lucide-react nu are TikTok)
const TikTok = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Cum Funcționează', href: '/#how-it-works' },
            { label: 'Prețuri', href: '/#pricing' },
            { label: 'Video Demo', href: '/#demo' },
            { label: 'Recenzii', href: '/#testimonials' },
        ],
        support: [
            { label: 'Întrebări Frecvente', href: '/intrebari-frecvente' },
            { label: 'Contact', href: '/contact' },
            { label: 'Ajutor', href: '/help' },
        ],
        legal: [
            { label: 'Politica de Confidențialitate', href: '/privacy' },
            { label: 'Termeni și Condiții', href: '/terms' },
            { label: 'Politica Cookie-uri', href: '/cookies' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook' },
        { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram' },
        { icon: TikTok, href: siteConfig.social.tiktok, label: 'TikTok' },
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Image
                                src="/santaicon2.png"
                                alt="Santa AI Logo"
                                width={40}
                                height={40}
                                className="h-10 w-auto"
                            />
                            <span className="font-bold text-2xl font-christmas">
                                Mesajul <span className="text-christmas-gold">Mosului</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Creează mesaje video personalizate magice de la Moș Crăciun pentru cei mici.
                            Făcut cu dragoste.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center
                    text-gray-400 hover:text-white hover:bg-christmas-red transition-colors"
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Produs</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Suport</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={`mailto:${siteConfig.contact.email}`}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    {siteConfig.contact.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${siteConfig.contact.phoneInternational}`}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    {siteConfig.contact.phone}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} Mesajul Mosului. Toate drepturile rezervate.
                        </p>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                            Făcut cu <Heart className="w-4 h-4 text-christmas-red fill-current" /> pentru familii de pretutindeni
                        </p>
                        <div className="flex items-center gap-6">
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-500 text-sm hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
