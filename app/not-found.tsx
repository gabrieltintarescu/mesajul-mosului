'use client';

import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';

import { Footer, Header } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { CTAButton } from '@/components/ui';

export default function NotFound() {
    return (
        <>
            <Header variant="light" />

            <section className="relative min-h-screen pt-32 pb-16 hero-gradient overflow-hidden flex items-center">
                <SnowfallBackground />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        {/* 404 Number */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                            className="mb-8"
                        >
                            <span className="text-[150px] md:text-[200px] font-bold text-white/20 font-christmas leading-none select-none">
                                404
                            </span>
                        </motion.div>

                        {/* Santa emoji */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-6xl mb-6"
                        >
                            🎅
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-christmas">
                            Oops! Pagina nu a fost găsită
                        </h1>

                        <p className="text-xl text-white/80 mb-8">
                            Se pare că te-ai rătăcit prin zăpadă! Această pagină nu există sau a fost mutată.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/">
                                <CTAButton size="lg" icon={<Home className="w-5 h-5" />}>
                                    Înapoi Acasă
                                </CTAButton>
                            </Link>
                            <Link href="/comanda/pas-1">
                                <CTAButton size="lg" variant="outline" icon={<Search className="w-5 h-5" />}>
                                    Creează un Video
                                </CTAButton>
                            </Link>
                        </div>

                        {/* Fun message */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 text-white/60 text-sm"
                        >
                            Moș Crăciun verifică lista... dar această pagină nu e pe ea! 🎄
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </>
    );
}
