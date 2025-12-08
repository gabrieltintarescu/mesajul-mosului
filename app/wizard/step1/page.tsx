'use client';

import { Step1Form, StepWizard } from '@/components/wizard';

export default function WizardStep1Page() {
    return (
        <StepWizard currentStep={1}>
            <Step1Form />
        </StepWizard>
    );
}
