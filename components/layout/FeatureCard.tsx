'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index?: number;
}

export function FeatureCard({ icon: Icon, title, description, index = 0 }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-white rounded-2xl p-8 shadow-lg shadow-gray-100/50 
        border border-gray-100 hover:shadow-xl hover:border-christmas-gold/30 
        transition-all duration-300"
        >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-christmas-gold/10 to-transparent transform translate-x-8 -translate-y-8 rotate-45" />
            </div>

            {/* Icon */}
            <div className="relative mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-christmas-red to-red-600 
          flex items-center justify-center shadow-lg shadow-red-500/20 
          group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                >
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-christmas-red transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
