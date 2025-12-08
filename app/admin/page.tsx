'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Lock, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { CTAButton, InputField } from '@/components/ui';
import { adminLogin } from '@/lib/api';
import { useAdminStore } from '@/store';

export default function AdminLoginPage() {
    const router = useRouter();
    const { isAuthenticated, login } = useAdminStore();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/admin/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await adminLogin(password);

            if (response.success && response.data) {
                login(response.data.token);
                router.push('/admin/dashboard');
            } else {
                setError(response.error || 'Parolă incorectă');
            }
        } catch (err) {
            setError('A apărut o eroare. Încearcă din nou.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-20 left-20 text-9xl">🎅</div>
                <div className="absolute bottom-20 right-20 text-9xl">🎄</div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-christmas-red rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Acces Administrare</h1>
                        <p className="text-gray-500 mt-2">Introdu parola pentru a continua</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            label="Parolă"
                            type="password"
                            placeholder="Introdu parola de admin"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <CTAButton
                            type="submit"
                            size="lg"
                            className="w-full"
                            isLoading={isLoading}
                            icon={<LogIn className="w-5 h-5" />}
                        >
                            Autentifică-te
                        </CTAButton>
                    </form>

                    {/* Hint for demo */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 text-center">
                            💡 Parolă demo: <code className="font-mono bg-gray-200 px-2 py-0.5 rounded">santa2024</code>
                        </p>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <a href="/" className="text-white/60 hover:text-white transition-colors text-sm">
                        ← Înapoi Acasă
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
