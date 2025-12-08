'use client';

import React, { forwardRef } from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    helperText?: string;
    options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, error, helperText, options, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                    ref={ref}
                    className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            bg-white/80 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-christmas-gold/50
            appearance-none cursor-pointer
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-christmas-gold hover:border-gray-300'
                        }
            ${className}
          `}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '20px',
                        paddingRight: '40px',
                    }}
                    {...props}
                >
                    <option value="">Selectează o opțiune</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
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

SelectField.displayName = 'SelectField';
