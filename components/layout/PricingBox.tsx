'use client';

import { CTAButton } from '@/components/ui';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PricingBoxProps {
    title: string;
    price: number;
    originalPrice?: number;
    features: string[];
    isPopular?: boolean;
    ctaText?: string;
}

export function PricingBox({
    title,
    price,
    originalPrice,
    features,
    isPopular = false,
    ctaText = 'Creează Video Acum',
}: PricingBoxProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8 }}
            className={`
        relative rounded-3xl p-8 transition-all duration-300
        ${isPopular
                    ? 'bg-gradient-to-br from-christmas-red via-red-600 to-red-700 text-white shadow-2xl shadow-red-500/30 scale-105'
                    : 'bg-white border-2 border-gray-100 shadow-xl hover:border-christmas-gold/30'
                }
      `}
        >
            {/* Popular badge */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-4 py-1.5 bg-christmas-gold text-gray-900 font-bold text-sm 
              rounded-full shadow-lg flex items-center gap-1"
                    >
                        <Sparkles className="w-4 h-4" />
                        Cel Mai Popular
                    </motion.div>
                </div>
            )}

            {/* Decorative snowflakes */}
            {isPopular && (
                <>
                    <div className="absolute top-4 right-4 text-white/20 text-2xl">❄</div>
                    <div className="absolute bottom-4 left-4 text-white/20 text-xl">❄</div>
                </>
            )}

            {/* Title */}
            <h3 className={`text-xl font-bold mb-2 font-christmas ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                {title}
            </h3>

            {/* Price */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                        {price} lei
                    </span>
                    {originalPrice && (
                        <span className={`text-lg line-through ${isPopular ? 'text-white/60' : 'text-gray-400'}`}>
                            {originalPrice} lei
                        </span>
                    )}
                </div>
                <p className={`text-sm mt-1 ${isPopular ? 'text-white/80' : 'text-gray-500'}`}>
                    Plată unică
                </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className={`
              w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
              ${isPopular ? 'bg-white/20' : 'bg-christmas-green/10'}
            `}>
                            <Check className={`w-3 h-3 ${isPopular ? 'text-white' : 'text-christmas-green'}`} />
                        </div>
                        <span className={isPopular ? 'text-white/90' : 'text-gray-600'}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <Link href="/comanda/pas-1" className="block">
                <CTAButton
                    variant={isPopular ? 'outline' : 'primary'}
                    className={`w-full ${isPopular ? 'border-white text-white hover:bg-white hover:text-christmas-red' : ''}`}
                >
                    {ctaText}
                </CTAButton>
            </Link>
        </motion.div>
    );
}
