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
import { useParams } from 'next/navigation';

import { Footer, Header } from '@/components/layout';
import { VideoPlayer } from '@/components/sections';
import { CTAButton, LoaderAnimation, StatusBadge } from '@/components/ui';
import { useOrderStatus } from '@/hooks';
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
    const orderId = params.id as string;
    const { order, isLoading, error, mutate } = useOrderStatus(orderId);

    const currentStepIndex = order ? getStepIndex(order.status) : 0;
    const isCompleted = order?.status === 'completed';
    const isFailed = order?.status === 'failed';

    if (isLoading && !order) {
        return (
            <>
                <Header />
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

    if (error || !order) {
        return (
            <>
                <Header />
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
            <Header />

            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 pt-32 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
                                <span className="text-sm text-gray-500">ID Comandă:</span>
                                <code className="text-sm font-mono text-christmas-red">{orderId}</code>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-christmas">
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
                                className="bg-white rounded-3xl shadow-xl p-8 mb-8"
                            >
                                <div className="relative">
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
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                🎁 Detalii Comandă
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Numele Copilului</p>
                                    <p className="font-semibold text-gray-900">{order.childDetails.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Vârsta</p>
                                    <p className="font-semibold text-gray-900">{order.childDetails.age} ani</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{order.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Creat la</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString('ro-RO', {
                                            year: 'numeric',
                                            month: 'long',
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
                                <a href="mailto:hello@santaai.com" className="text-christmas-red hover:underline">
                                    hello@santaai.com
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
