'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    steps: { title: string; description: string }[];
}

export function StepNavigation({ currentStep, totalSteps, steps }: StepNavigationProps) {
    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative flex justify-between">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <motion.div
                        className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                </div>

                {/* Steps */}
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={index} className="relative flex flex-col items-center z-10">
                            {/* Step circle */}
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: isCurrent ? 1.1 : 1 }}
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all duration-300
                  ${isCompleted
                                        ? 'bg-christmas-green text-white'
                                        : isCurrent
                                            ? 'bg-gradient-to-r from-christmas-red to-red-600 text-white shadow-lg shadow-red-500/30'
                                            : 'bg-gray-200 text-gray-500'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    stepNumber
                                )}
                            </motion.div>

                            {/* Step info */}
                            <div className="mt-3 text-center">
                                <p className={`
                  font-semibold text-sm
                  ${isCurrent ? 'text-christmas-red' : isCompleted ? 'text-christmas-green' : 'text-gray-500'}
                `}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
