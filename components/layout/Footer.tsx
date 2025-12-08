'use client';

import { motion } from 'framer-motion';
import {
    Facebook,
    Heart,
    Instagram,
    Mail,
    Phone,
    Twitter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
            { label: 'Întrebări Frecvente', href: '/faq' },
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
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
            {/* Snow decoration */}
            <div className="h-8 bg-gradient-to-b from-transparent to-gray-900 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-white"
                    style={{
                        clipPath: 'polygon(0 100%, 5% 60%, 10% 100%, 15% 70%, 20% 100%, 25% 60%, 30% 100%, 35% 80%, 40% 100%, 45% 60%, 50% 100%, 55% 70%, 60% 100%, 65% 60%, 70% 100%, 75% 80%, 80% 100%, 85% 60%, 90% 100%, 95% 70%, 100% 100%)'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Image
                                src="/santaicon.png"
                                alt="Santa AI Logo"
                                width={40}
                                height={40}
                                className="h-10 w-auto"
                            />
                            <span className="font-bold text-2xl font-christmas">
                                Santa<span className="text-christmas-gold">AI</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Creează mesaje video personalizate magice de la Moș Crăciun pentru cei mici.
                            Powered by AI, făcut cu dragoste.
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
                                    href="mailto:hello@santaai.com"
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    hello@santaai.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+1234567890"
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    +1 (234) 567-890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} SantaAI. Toate drepturile rezervate.
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
