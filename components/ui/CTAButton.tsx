'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export function CTAButton({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    children,
    className = '',
    disabled,
    ...props
}: CTAButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-full
    transition-all duration-300 ease-out
    cursor-pointer
    focus:outline-none focus:ring-4
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-christmas-red to-red-600
      text-white shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/40 hover:scale-105
      focus:ring-red-500/30
      active:scale-95
    `,
        secondary: `
      bg-gradient-to-r from-christmas-green to-green-700
      text-white shadow-lg shadow-green-500/30
      hover:shadow-xl hover:shadow-green-500/40 hover:scale-105
      focus:ring-green-500/30
      active:scale-95
    `,
        outline: `
      bg-transparent border-2 border-christmas-red
      text-christmas-red
      hover:bg-christmas-red hover:text-white hover:scale-105
      focus:ring-red-500/30
      active:scale-95
    `,
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...(props as React.ComponentProps<typeof motion.button>)}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Se încarcă...</span>
                </>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </motion.button>
    );
}
