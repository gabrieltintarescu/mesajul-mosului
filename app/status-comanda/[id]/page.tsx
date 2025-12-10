'use client';

import { motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle,
    Download,
    Home,
    RefreshCw,
    Share2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Footer, Header } from '@/components/layout';
import { VideoPlayer } from '@/components/sections';
import { CTAButton, LoaderAnimation, StatusBadge } from '@/components/ui';
import { useOrderStatus } from '@/hooks';
import { siteConfig } from '@/lib/config';
import { useWizardStore } from '@/store';
import { OrderStatus } from '@/types';

const statusSteps: { status: OrderStatus; label: string; icon: string }[] = [
    { status: 'paid', label: 'Plată Confirmată', icon: '💳' },
    { status: 'generating_script', label: 'Scriem Scenariul', icon: '✍️' },
    { status: 'generating_voice', label: 'Înregistrăm Vocea', icon: '🎙️' },
    { status: 'generating_video', label: 'Creăm Videoclipul', icon: '🎬' },
    { status: 'merging', label: 'Ultimele Retușuri', icon: '✨' },
    { status: 'completed', label: 'Gata!', icon: '🎄' },
];

function getStepIndex(status: OrderStatus): number {
    const index = statusSteps.findIndex(s => s.status === status);
    return index >= 0 ? index : 0;
}

export default function OrderStatusPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderId = params.id as string;

    // Get email from wizard store or URL params
    const { email: storeEmail, reset } = useWizardStore();
    const urlEmail = searchParams.get('email');
    const paymentSuccess = searchParams.get('payment') === 'success';

    // Use email from store first, then URL, then localStorage fallback
    const [email, setEmail] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        // Try to get email from various sources
        const emailToUse = storeEmail || urlEmail || localStorage.getItem(`order_email_${orderId}`);
        if (emailToUse) {
            setEmail(emailToUse);
            // Store email for future visits
            localStorage.setItem(`order_email_${orderId}`, emailToUse);
        }

        // Clear wizard state if payment was successful
        if (paymentSuccess && storeEmail) {
            reset();
        }
    }, [storeEmail, urlEmail, orderId, paymentSuccess, reset]);

    const { order, isLoading, error, mutate } = useOrderStatus(orderId, email);

    const currentStepIndex = order ? getStepIndex(order.status) : 0;
    const isCompleted = order?.status === 'completed';
    const isFailed = order?.status === 'failed';

    // Show loading while hydrating, waiting for email, or initial load
    // Don't show loading if we already have order data (prevents flashing during polling)
    if (!isHydrated || (!email && !error) || (isLoading && !order)) {
        return (
            <>
                <Header variant="light" />
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 pt-32 pb-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center justify-center py-20">
                            <LoaderAnimation size="lg" text="Se încarcă comanda ta..." />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Show error if no email found
    if (!email) {
        return (
            <>
                <Header variant="light" />
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 pt-32 pb-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-lg mx-auto text-center py-20">
                            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Verificare Email Necesară</h1>
                            <p className="text-gray-600 mb-8">
                                Pentru a vedea statusul comenzii, te rugăm să accesezi linkul primit pe email.
                            </p>
                            <Link href="/">
                                <CTAButton icon={<Home className="w-5 h-5" />}>
                                    Înapoi Acasă
                                </CTAButton>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Header variant="light" />
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 pt-32 pb-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-lg mx-auto text-center py-20">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Comanda Nu A Fost Găsită</h1>
                            <p className="text-gray-600 mb-8">
                                Nu am putut găsi această comandă. Te rugăm să verifici URL-ul sau să contactezi suportul.
                            </p>
                            <Link href="/">
                                <CTAButton icon={<Home className="w-5 h-5" />}>
                                    Înapoi Acasă
                                </CTAButton>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header variant="light" />

            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 pt-32 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8 sm:mb-12"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full shadow-sm mb-4 sm:mb-6">
                                <span className="text-xs sm:text-sm text-gray-500">ID Comandă:</span>
                                <code className="text-xs sm:text-sm font-mono text-christmas-red truncate max-w-[120px] sm:max-w-none">{orderId}</code>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-christmas px-2">
                                {isCompleted ? (
                                    <>Videoclipul Tău Este Gata! 🎄</>
                                ) : isFailed ? (
                                    <>Ceva Nu A Mers Bine 😔</>
                                ) : (
                                    <>Creăm Videoclipul Tău Magic... ✨</>
                                )}
                            </h1>

                            <div className="flex items-center justify-center gap-2">
                                <StatusBadge status={order.status} />
                                {!isCompleted && !isFailed && (
                                    <button
                                        onClick={() => mutate()}
                                        className="p-2 text-gray-400 hover:text-christmas-red transition-colors"
                                        title="Reîmprospătează status"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Progress Steps */}
                        {!isCompleted && !isFailed && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 mb-8"
                            >
                                {/* Mobile: Vertical steps */}
                                <div className="block sm:hidden space-y-4">
                                    {statusSteps.map((step, index) => {
                                        const isActive = index === currentStepIndex;
                                        const isComplete = index < currentStepIndex;

                                        return (
                                            <div key={step.status} className="flex items-center gap-4">
                                                <div
                                                    className={`
                                                        w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                                                        ${isComplete
                                                            ? 'bg-christmas-green text-white'
                                                            : isActive
                                                                ? 'bg-christmas-red text-white shadow-lg'
                                                                : 'bg-gray-100 text-gray-400'
                                                        }
                                                    `}
                                                >
                                                    {isComplete ? <CheckCircle className="w-5 h-5" /> : step.icon}
                                                </div>
                                                <p className={`text-sm font-medium
                                                    ${isActive ? 'text-christmas-red' : isComplete ? 'text-christmas-green' : 'text-gray-400'}
                                                `}>
                                                    {step.label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop: Horizontal steps */}
                                <div className="hidden sm:block relative">
                                    {/* Progress bar */}
                                    <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 rounded-full">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>

                                    {/* Steps */}
                                    <div className="relative flex justify-between">
                                        {statusSteps.map((step, index) => {
                                            const isActive = index === currentStepIndex;
                                            const isComplete = index < currentStepIndex;

                                            return (
                                                <div key={step.status} className="flex flex-col items-center">
                                                    <motion.div
                                                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                                        transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                                                        className={`
                                                            w-12 h-12 rounded-full flex items-center justify-center text-xl
                                                            ${isComplete
                                                                ? 'bg-christmas-green text-white'
                                                                : isActive
                                                                    ? 'bg-christmas-red text-white shadow-lg'
                                                                    : 'bg-gray-100 text-gray-400'
                                                            }
                                                        `}
                                                    >
                                                        {isComplete ? <CheckCircle className="w-6 h-6" /> : step.icon}
                                                    </motion.div>
                                                    <p className={`mt-2 text-xs font-medium text-center max-w-[80px]
                                                        ${isActive ? 'text-christmas-red' : isComplete ? 'text-christmas-green' : 'text-gray-400'}
                                                    `}>
                                                        {step.label}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Current status message */}
                                <div className="mt-8 text-center">
                                    <LoaderAnimation size="sm" />
                                    <p className="text-gray-600 mt-4">
                                        Spiridușii lui Moș Crăciun lucrează din greu! De obicei durează aproximativ 15 minute.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Failed Order Message */}
                        {isFailed && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-8"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        Ne pare rău, a apărut o problemă
                                    </h2>

                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        Din păcate, nu am putut genera videoclipul tău.
                                        Nu îți face griji - echipa noastră de suport te va ajuta să rezolvi problema.
                                    </p>

                                    {order.errorMessage && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                                            <p className="text-sm text-red-800">
                                                <strong>Detalii eroare:</strong> {order.errorMessage}
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
                                        <h3 className="font-semibold text-gray-900 mb-4">
                                            📞 Contactează Suportul
                                        </h3>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-gray-500">Email:</span>
                                                <a
                                                    href={`mailto:${siteConfig.contact.email}?subject=Problemă comandă ${orderId}&body=Bună ziua,%0D%0A%0D%0AAm o problemă cu comanda mea.%0D%0A%0D%0AID Comandă: ${orderId}%0D%0AEmail: ${order.email}%0D%0ANume copil: ${order.childDetails.name}%0D%0A%0D%0AEroare: ${order.errorMessage || 'N/A'}%0D%0A%0D%0AVă mulțumesc!`}
                                                    className="text-christmas-red hover:underline font-medium"
                                                >
                                                    {siteConfig.contact.email}
                                                </a>
                                            </div>

                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-gray-500">Telefon:</span>
                                                <a
                                                    href={`tel:${siteConfig.contact.phoneInternational}`}
                                                    className="text-christmas-red hover:underline font-medium"
                                                >
                                                    {siteConfig.contact.phone}
                                                </a>
                                            </div>

                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-gray-500">WhatsApp:</span>
                                                <a
                                                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Bună! Am o problemă cu comanda ${orderId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-christmas-red hover:underline font-medium"
                                                >
                                                    Scrie-ne pe WhatsApp
                                                </a>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-4">
                                            Menționează ID-ul comenzii: <code className="bg-gray-200 px-1 rounded">{orderId}</code>
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <Link href="/">
                                            <CTAButton variant="outline" icon={<Home className="w-5 h-5" />}>
                                                Înapoi Acasă
                                            </CTAButton>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Video Player (when completed) */}
                        {isCompleted && order.videoUrl && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8"
                            >
                                <VideoPlayer
                                    src={order.videoUrl}
                                    title={`Mesajul lui Moș Crăciun pentru ${order.childDetails.name}`}
                                />

                                {/* Actions */}
                                <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                                    <a href={order.videoUrl} download>
                                        <CTAButton icon={<Download className="w-5 h-5" />}>
                                            Descarcă Video
                                        </CTAButton>
                                    </a>
                                    <CTAButton
                                        variant="outline"
                                        icon={<Share2 className="w-5 h-5" />}
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: 'Video de la Moș Crăciun pentru ' + order.childDetails.name,
                                                    text: 'Uite ce video personalizat de la Moș Crăciun!',
                                                    url: window.location.href,
                                                });
                                            }
                                        }}
                                    >
                                        Distribuie
                                    </CTAButton>
                                </div>
                            </motion.div>
                        )}

                        {/* Order Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                        >
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                🎁 Detalii Comandă
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 text-xs sm:text-sm">Numele Copilului</p>
                                    <p className="font-semibold text-gray-900">{order.childDetails.name}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 text-xs sm:text-sm">Vârsta</p>
                                    <p className="font-semibold text-gray-900">{order.childDetails.age} ani</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                                    <p className="font-semibold text-gray-900 break-all">{order.email}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 text-xs sm:text-sm">Creat la</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString('ro-RO', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Help text */}
                        <div className="mt-8 text-center text-sm text-gray-500">
                            <p>
                                Întrebări? Contactează-ne la{' '}
                                <a href={`mailto:${siteConfig.contact.email}`} className="text-christmas-red hover:underline">
                                    {siteConfig.contact.email}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
