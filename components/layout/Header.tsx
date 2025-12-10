'use client';

import { CTAButton } from '@/components/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeaderProps {
    /** Use 'light' variant on pages with light backgrounds to ensure text visibility */
    variant?: 'default' | 'light';
}

export function Header({ variant = 'default' }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // On light variant pages, always use dark text (like scrolled state)
    const useDarkText = variant === 'light' || isScrolled;

    const navLinks = [
        { href: '/#cum-functioneaza', label: 'Instrucțiuni' },
        { href: '/#recenzii', label: 'Recenzii' },
        { href: '/#preturi', label: 'Prețuri' },
    ];

    return (
        <header
            className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled || variant === 'light'
                    ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
                    : 'bg-transparent py-5'
                }
      `}
        >
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Image
                                src="/santaicon2.png"
                                alt="Santa AI Logo"
                                width={40}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </motion.div>
                        <span className={`
              font-bold text-xl transition-colors duration-300 font-christmas
              ${useDarkText ? 'text-christmas-red' : 'text-white'}
              group-hover:text-christmas-gold
            `}>
                            Mesajul <span className="text-christmas-gold">Mosului</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                  font-medium transition-colors duration-300
                  ${useDarkText
                                        ? 'text-gray-700 hover:text-christmas-red'
                                        : 'text-white/90 hover:text-white'
                                    }
                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link href="/comanda/pas-1">
                            <CTAButton
                                variant="primary"
                                size="sm"
                                icon={<Sparkles className="w-4 h-4" />}
                            >
                                Creează Video
                            </CTAButton>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`
              md:hidden p-2 rounded-lg transition-colors
              ${useDarkText
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-white hover:bg-white/10'
                            }
            `}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-3 bg-white/95 backdrop-blur-md rounded-lg px-4 mt-2 shadow-lg">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-2 font-medium text-gray-700 hover:text-christmas-red transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link href="/comanda/pas-1" onClick={() => setIsMobileMenuOpen(false)}>
                                    <CTAButton variant="primary" size="sm" className="w-full mt-4">
                                        Creează Video
                                    </CTAButton>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
