'use client';

import { Step2Invoicing, StepWizard } from '@/components/wizard';
import { useWizardStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WizardStep2Page() {
    const router = useRouter();
    const { childDetails, email } = useWizardStore();
    const [isHydrated, setIsHydrated] = useState(false);

    // Wait for Zustand to hydrate from localStorage
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Only check after hydration is complete
        if (!isHydrated) return;

        // Redirect to step 1 if child details are not filled
        if (!childDetails.name || !email) {
            router.push('/wizard/step1');
        }
    }, [isHydrated, childDetails, email, router]);

    // Show loading while hydrating
    if (!isHydrated) {
        return (
            <StepWizard currentStep={2}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600">Se încarcă...</p>
                    </div>
                </div>
            </StepWizard>
        );
    }

    // Don't render content if redirecting
    if (!childDetails.name || !email) {
        return null;
    }

    return (
        <StepWizard currentStep={2}>
            <Step2Invoicing />
        </StepWizard>
    );
}
