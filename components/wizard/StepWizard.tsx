'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { StepNavigation } from './StepNavigation';

interface StepWizardProps {
    currentStep: number;
    children: React.ReactNode;
}

const steps = [
    { title: 'Detalii Copil', description: 'Spune-ne despre copilul tău' },
    { title: 'Plată', description: 'Checkout securizat' },
];

export function StepWizard({ currentStep, children }: StepWizardProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 pt-24 pb-16">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 text-6xl opacity-10">🎄</div>
                <div className="absolute top-40 right-20 text-4xl opacity-10">❄️</div>
                <div className="absolute bottom-40 left-20 text-5xl opacity-10">🎁</div>
                <div className="absolute bottom-20 right-10 text-6xl opacity-10">⭐</div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <StepNavigation currentStep={currentStep} totalSteps={2} steps={steps} />

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
    );
}
