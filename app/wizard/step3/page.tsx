'use client';

import { Step2Payment, StepWizard } from '@/components/wizard';
import { useWizardStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WizardStep3Page() {
    const router = useRouter();
    const { orderId, childDetails, invoicingDetails } = useWizardStore();

    useEffect(() => {
        // Redirect to step 1 if no order has been initiated
        if (!orderId || !childDetails.name) {
            router.push('/wizard/step1');
            return;
        }
        // Redirect to step 2 if invoicing details are missing
        if (!invoicingDetails.name || !invoicingDetails.address) {
            router.push('/wizard/step2');
            return;
        }
    }, [orderId, childDetails, invoicingDetails, router]);

    return (
        <StepWizard currentStep={3}>
            <Step2Payment />
        </StepWizard>
    );
}
