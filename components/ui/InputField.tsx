'use client';

import React, { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            bg-white/80 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-christmas-gold/50
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-christmas-gold hover:border-gray-300'
                        }
            placeholder:text-gray-400
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';
