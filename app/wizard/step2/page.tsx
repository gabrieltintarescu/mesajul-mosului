'use client';

import { Step2Invoicing, StepWizard } from '@/components/wizard';
import { useWizardStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WizardStep2Page() {
    const router = useRouter();
    const { orderId, childDetails } = useWizardStore();

    useEffect(() => {
        // Redirect to step 1 if no order has been initiated
        if (!orderId || !childDetails.name) {
            router.push('/wizard/step1');
        }
    }, [orderId, childDetails, router]);

    return (
        <StepWizard currentStep={2}>
            <Step2Invoicing />
        </StepWizard>
    );
}
