import { ChildDetails, InvoicingDetails } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardState {
    step: number;
    childDetails: Partial<ChildDetails>;
    invoicingDetails: Partial<InvoicingDetails>;
    email: string;
    orderId: string | null;

    // Actions
    setStep: (step: number) => void;
    setChildDetails: (details: Partial<ChildDetails>) => void;
    setInvoicingDetails: (details: Partial<InvoicingDetails>) => void;
    setEmail: (email: string) => void;
    setOrderId: (orderId: string) => void;
    reset: () => void;
}

const initialState = {
    step: 1,
    childDetails: {},
    invoicingDetails: {},
    email: '',
    orderId: null,
};

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            ...initialState,

            setStep: (step) => set({ step }),

            setChildDetails: (details) =>
                set((state) => ({
                    childDetails: { ...state.childDetails, ...details },
                })),

            setInvoicingDetails: (details) =>
                set((state) => ({
                    invoicingDetails: { ...state.invoicingDetails, ...details },
                })),

            setEmail: (email) => set({ email }),

            setOrderId: (orderId) => set({ orderId }),

            reset: () => set(initialState),
        }),
        {
            name: 'santa-wizard-storage',
        }
    )
);
