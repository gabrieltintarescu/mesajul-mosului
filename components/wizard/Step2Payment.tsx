'use client';

import { CTAButton } from '@/components/ui';
import { applyCouponToOrder, createCheckoutSession, getOrderStatus, removeCouponFromOrder } from '@/lib/api';
import { useWizardStore } from '@/store';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Lock, Shield, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderPricing {
    finalPriceCents: number;
    discountAmountCents: number;
    couponCode: string | null;
}

export function Step2Payment() {
    const router = useRouter();
    const { orderId, childDetails, email, orderFinalPriceCents } = useWizardStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [orderPricing, setOrderPricing] = useState<OrderPricing | null>(null);

    // Coupon state
    const [discountCode, setDiscountCode] = useState('');
    const [discountError, setDiscountError] = useState('');
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

    // Fetch order details to get actual price (no status check here)
    useEffect(() => {
        async function fetchOrderDetails() {
            if (!orderId || !email) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await getOrderStatus(orderId, email);
                if (response.success && response.data?.order) {
                    const order = response.data.order;
                    setOrderPricing({
                        finalPriceCents: order.final_price,
                        discountAmountCents: order.discount_amount || 0,
                        couponCode: order.coupon_code ?? null,
                    });
                }
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOrderDetails();
    }, [orderId, email]);

    // Calculate display price - use order's actual price or stored price
    const finalPriceCents = orderPricing?.finalPriceCents ?? orderFinalPriceCents ?? 8900;
    const totalPriceLei = finalPriceCents / 100;
    const couponDiscountLei = (orderPricing?.discountAmountCents ?? 0) / 100;
    const couponCode = orderPricing?.couponCode;

    // Marketing: Show original price as 129 Lei with 40 Lei holiday discount
    const marketingOriginalPrice = 129;
    const holidayDiscount = 40;
    // The base price after holiday discount (what we actually charge before coupons)
    const basePriceAfterHoliday = marketingOriginalPrice - holidayDiscount; // 89 Lei

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            setDiscountError('Te rugăm să introduci un cod de reducere');
            return;
        }

        if (!orderId) {
            setDiscountError('Comandă invalidă');
            return;
        }

        setIsApplyingDiscount(true);
        setDiscountError('');

        try {
            const response = await applyCouponToOrder(orderId, discountCode);

            if (response.success && response.data) {
                // Update local pricing state
                setOrderPricing({
                    finalPriceCents: response.data.finalPrice,
                    discountAmountCents: response.data.discountAmount,
                    couponCode: response.data.code,
                });
                setDiscountError('');
            } else {
                setDiscountError(response.error || 'Codul de reducere nu este valid');
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            setDiscountError('Eroare la validarea codului');
        }

        setIsApplyingDiscount(false);
    };

    const handleRemoveDiscount = async () => {
        if (!orderId) return;

        setIsApplyingDiscount(true);
        try {
            const response = await removeCouponFromOrder(orderId);
            if (response.success && response.data) {
                setOrderPricing({
                    finalPriceCents: response.data.finalPrice,
                    discountAmountCents: 0,
                    couponCode: null,
                });
            }
        } catch (error) {
            console.error('Error removing coupon:', error);
        }
        setDiscountCode('');
        setIsApplyingDiscount(false);
    };

    const handlePayment = async () => {
        if (!orderId) {
            router.push('/wizard/step2');
            return;
        }

        setIsProcessing(true);
        setPaymentError('');

        try {
            // Create Stripe checkout session
            const checkoutResponse = await createCheckoutSession(orderId);

            if (checkoutResponse.success && checkoutResponse.data?.url) {
                // Redirect to Stripe Checkout
                window.location.href = checkoutResponse.data.url;
            } else {
                // Check if it's an already paid error - redirect to order page
                if (checkoutResponse.error === 'Order has already been paid') {
                    router.push(`/order/${orderId}?email=${encodeURIComponent(email)}`);
                } else {
                    setPaymentError(checkoutResponse.error || 'Eroare la crearea sesiunii de plată');
                    setIsProcessing(false);
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentError('Eroare la procesarea plății. Te rugăm să încerci din nou.');
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

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Se încarcă detaliile comenzii...</p>
                </div>
            </div>
        );
    }

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
                                    <span className="text-gray-600">Pachet Video HD</span>
                                    <span className="font-semibold">{marketingOriginalPrice} Lei</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-christmas-green mt-1">
                                    <span>🎄 Reducere de Sărbători</span>
                                    <span>-{holidayDiscount} Lei</span>
                                </div>
                                {couponDiscountLei > 0 && (
                                    <div className="flex justify-between items-center text-sm text-christmas-green mt-1">
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            Cod: {couponCode}
                                        </span>
                                        <span>-{couponDiscountLei} Lei</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-christmas-red">{totalPriceLei} Lei</span>
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

                        {/* Stripe Checkout Info */}
                        <div className="mb-8">
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Plată Securizată cu Stripe</h3>
                                        <p className="text-sm text-gray-500">Vei fi redirecționat către pagina de plată Stripe</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Card de credit sau debit
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Apple Pay & Google Pay
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Criptat end-to-end
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Payment Error */}
                        {paymentError && (
                            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                                <p className="text-sm text-red-600">{paymentError}</p>
                            </div>
                        )}

                        {/* Discount Code */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cod de Reducere
                            </label>
                            {couponCode ? (
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <Tag className="w-5 h-5" />
                                        <span className="font-medium">{couponCode}</span>
                                        <span className="text-sm">(-{couponDiscountLei} Lei)</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveDiscount}
                                        disabled={isApplyingDiscount}
                                        className="text-sm text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {isApplyingDiscount ? '...' : 'Elimină'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Introdu codul de reducere"
                                            value={discountCode}
                                            onChange={(e) => {
                                                setDiscountCode(e.target.value.toUpperCase());
                                                setDiscountError('');
                                            }}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyDiscount}
                                        disabled={isApplyingDiscount}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isApplyingDiscount ? '...' : 'Aplică'}
                                    </button>
                                </div>
                            )}
                            {discountError && (
                                <p className="mt-2 text-sm text-red-500">{discountError}</p>
                            )}
                        </div>

                        {/* Pay Button */}
                        <CTAButton
                            size="lg"
                            className="w-full mb-4"
                            onClick={handlePayment}
                            isLoading={isProcessing}
                            icon={<Lock className="w-5 h-5" />}
                        >
                            Plătește {totalPriceLei} Lei Securizat
                        </CTAButton>

                        {/* Back Link */}
                        <Link href="/wizard/step2">
                            <button className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-christmas-red transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Înapoi la Facturare
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
