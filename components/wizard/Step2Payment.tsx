'use client';

import { CTAButton } from '@/components/ui';
import { completePaymentSession, createCheckoutSession } from '@/lib/api';
import { useWizardStore } from '@/store';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Step2Payment() {
    const router = useRouter();
    const { orderId, childDetails, reset } = useWizardStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (!orderId) {
            router.push('/wizard/step1');
            return;
        }

        setIsProcessing(true);

        try {
            // Create checkout session (mocked)
            const checkoutResponse = await createCheckoutSession(orderId);

            if (checkoutResponse.success && checkoutResponse.data) {
                // Simulate payment completion
                await completePaymentSession(orderId, `pi_${Date.now()}`);

                // Clear wizard state
                reset();

                // Redirect to order status page
                router.push(`/order/${orderId}`);
            }
        } catch (error) {
            console.error('Payment error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const features = [
        'Video personalizat de 5-7 minute',
        'Descărcare în calitate HD',
        'Livrat în 15 minute',
        'Vizionări nelimitate',
        'Poți distribui familiei',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="grid md:grid-cols-5 gap-8">
                {/* Order Summary */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 font-christmas">
                            🎁 Sumar Comandă
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Video personalizat pentru</span>
                                <span className="font-semibold text-gray-900">{childDetails.name || 'Copilul Tău'}</span>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Pachet Video</span>
                                    <span className="font-semibold">129 Lei</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-christmas-green mt-1">
                                    <span>Reducere de Sărbători</span>
                                    <span>-40 Lei</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-christmas-red">89 Lei</span>
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-2">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="w-4 h-4 text-christmas-green" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="md:col-span-3">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-christmas">Detalii Plată</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Lock className="w-4 h-4" />
                                Checkout Securizat
                            </div>
                        </div>

                        {/* Mock Card Form */}
                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Număr Card
                                </label>
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="4242 4242 4242 4242"
                                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
                                        disabled
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl">💳</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Data Expirării
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="LL/AA"
                                        className="w-full bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
                                        disabled
                                    />
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVC
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
                                        disabled
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 text-center">
                                💡 Acesta este un demo - apasă mai jos pentru a simula plata
                            </p>
                        </div>

                        {/* Pay Button */}
                        <CTAButton
                            size="lg"
                            className="w-full mb-4"
                            onClick={handlePayment}
                            isLoading={isProcessing}
                            icon={<Lock className="w-5 h-5" />}
                        >
                            Plătește 89 Lei Securizat
                        </CTAButton>

                        {/* Back Link */}
                        <Link href="/wizard/step1">
                            <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-christmas-red transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Înapoi la Detalii
                            </button>
                        </Link>

                        {/* Trust badges */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" />
                                    Criptat SSL
                                </span>
                                <span className="flex items-center gap-1">
                                    <CreditCard className="w-4 h-4" />
                                    Powered by Stripe
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
