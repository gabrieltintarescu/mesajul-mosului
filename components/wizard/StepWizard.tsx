'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { StepNavigation } from './StepNavigation';

interface StepWizardProps {
    currentStep: number;
    children: React.ReactNode;
}

const steps = [
    { title: 'Detalii Copil', description: 'Spune-ne despre copilul tău' },
    { title: 'Facturare', description: 'Detalii pentru factură' },
    { title: 'Plată', description: 'Checkout securizat' },
];

export function StepWizard({ currentStep, children }: StepWizardProps) {
    return (
        <>
            {/* Simplified Header for Wizard */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <Image
                                    src="/santaicon2.png"
                                    alt="Santa Logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            </motion.div>
                            <span className="font-bold text-xl text-christmas-red group-hover:text-christmas-gold transition-colors duration-300 font-christmas">
                                Mesajul <span className="text-christmas-gold">Mosului</span>
                            </span>
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 pt-24 pb-16">
                {/* Background decorations */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 text-6xl opacity-10">🎄</div>
                    <div className="absolute top-40 right-20 text-4xl opacity-10">❄️</div>
                    <div className="absolute bottom-40 left-20 text-5xl opacity-10">🎁</div>
                    <div className="absolute bottom-20 right-10 text-6xl opacity-10">⭐</div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <StepNavigation currentStep={currentStep} totalSteps={3} steps={steps} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
