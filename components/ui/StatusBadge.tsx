'use client';

import { OrderStatus } from '@/types';

interface StatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md';
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
    pending_payment: {
        label: 'În Așteptarea Plății',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
    },
    paid: {
        label: 'Plătit',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
    },
    generating_script: {
        label: 'Scriem Scenariul',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
    },
    generating_voice: {
        label: 'Înregistrăm Vocea',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
    },
    generating_video: {
        label: 'Creăm Videoclipul',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100',
    },
    merging: {
        label: 'Ultimele Retușuri',
        color: 'text-pink-700',
        bgColor: 'bg-pink-100',
    },
    completed: {
        label: 'Gata!',
        color: 'text-christmas-green',
        bgColor: 'bg-green-100',
    },
    failed: {
        label: 'Eșuat',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
    },
    expired: {
        label: 'Expirat',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
    },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status];

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${config.bgColor} ${config.color}
        ${sizeClasses[size]}
      `}
        >
            <span className="relative flex h-2 w-2">
                {status !== 'completed' && status !== 'failed' && status !== 'pending_payment' && status !== 'expired' && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.bgColor} opacity-75`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color.replace('text-', 'bg-')}`}></span>
            </span>
            {config.label}
        </span>
    );
}
