'use client';

import { motion } from 'framer-motion';

interface LoaderAnimationProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export function LoaderAnimation({ size = 'md', text }: LoaderAnimationProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-christmas-red/20"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                {/* Middle ring with gradient */}
                <motion.div
                    className="absolute inset-2 rounded-full border-4 border-transparent border-t-christmas-gold border-r-christmas-gold"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner Santa hat */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="text-4xl"
                    >
                        🎅
                    </motion.div>
                </div>

                {/* Snowflakes */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-lg"
                        style={{
                            top: '50%',
                            left: '50%',
                        }}
                        initial={{
                            x: 0,
                            y: 0,
                            opacity: 0,
                            scale: 0,
                        }}
                        animate={{
                            x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                            y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: 'easeOut',
                        }}
                    >
                        ❄️
                    </motion.div>
                ))}
            </div>

            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-gray-600 font-medium ${textSizes[size]}`}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}
