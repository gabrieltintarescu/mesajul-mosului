'use client';

import { Step2Payment, StepWizard } from '@/components/wizard';
import { useWizardStore } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function WizardStep3Content() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { orderId: storeOrderId, childDetails, setOrderId, setChildDetails, setEmail, setOrderFinalPriceCents } = useWizardStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for orderId in URL (for abandoned cart recovery)
    const urlOrderId = searchParams.get('orderId');
    const urlEmail = searchParams.get('email');

    useEffect(() => {
        async function loadOrder() {
            // If we have an orderId in URL but not in store, fetch the order to resume
            if (urlOrderId && !storeOrderId) {
                // Need email for security verification
                if (!urlEmail) {
                    setError('Link invalid - email lipsește');
                    setIsLoading(false);
                    return;
                }

                try {
                    const response = await fetch(`/api/orders/${urlOrderId}?email=${encodeURIComponent(urlEmail)}`);
                    const result = await response.json();

                    if (result.success && result.data?.order) {
                        const order = result.data.order;

                        // Check if order is still pending payment
                        if (order.status !== 'pending_payment') {
                            // Order already paid or processed, redirect to order page
                            router.push(`/status-comanda/${urlOrderId}`);
                            return;
                        }

                        // Restore order data to store (including email for payment step)
                        setOrderId(order.id);
                        setEmail(urlEmail);  // Set email from URL so Step2Payment can use it
                        if (order.final_price) {
                            setOrderFinalPriceCents(order.final_price);
                        }
                        if (order.childDetails) {
                            setChildDetails(order.childDetails);
                        }

                        setIsLoading(false);
                    } else {
                        setError('Comanda nu a fost găsită');
                        setIsLoading(false);
                    }
                } catch {
                    setError('Eroare la încărcarea comenzii');
                    setIsLoading(false);
                }
            } else if (storeOrderId && childDetails.name) {
                // We have order in store, proceed normally
                setIsLoading(false);
            } else {
                // No order in URL or store, redirect to step 1
                router.push('/comanda/pas-1');
            }
        }

        loadOrder();
    }, [urlOrderId, urlEmail, storeOrderId, childDetails.name, router, setOrderId, setChildDetails, setEmail, setOrderFinalPriceCents]);

    if (isLoading) {
        return (
            <StepWizard currentStep={3}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-white">Se încarcă comanda...</p>
                    </div>
                </div>
            </StepWizard>
        );
    }

    if (error) {
        return (
            <StepWizard currentStep={3}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/comanda/pas-1')}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Începe o comandă nouă
                        </button>
                    </div>
                </div>
            </StepWizard>
        );
    }

    return (
        <StepWizard currentStep={3}>
            <Step2Payment />
        </StepWizard>
    );
}

export default function WizardStep3Page() {
    return (
        <Suspense fallback={
            <StepWizard currentStep={3}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-white">Se încarcă...</p>
                    </div>
                </div>
            </StepWizard>
        }>
            <WizardStep3Content />
        </Suspense>
    );
}
