'use client';

import { CTAButton, InputField } from '@/components/ui';
import { initiateOrder } from '@/lib/api';
import { useWizardStore } from '@/store';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building2, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FormErrors {
    invoiceType?: string;
    name?: string;
    cnp?: string;
    companyName?: string;
    cui?: string;
    address?: string;
    city?: string;
    county?: string;
    postalCode?: string;
    phone?: string;
}

export function Step2Invoicing() {
    const router = useRouter();
    const { invoicingDetails, setInvoicingDetails, childDetails, email, setOrderId, setOrderFinalPriceCents } = useWizardStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const invoiceType = invoicingDetails.invoiceType || 'individual';

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!invoicingDetails.name?.trim()) {
            newErrors.name = 'Te rugăm să introduci numele';
        }

        if (invoiceType === 'individual') {
            if (!invoicingDetails.cnp?.trim() || invoicingDetails.cnp.length !== 13) {
                newErrors.cnp = 'Te rugăm să introduci un CNP valid (13 cifre)';
            }
        } else {
            if (!invoicingDetails.companyName?.trim()) {
                newErrors.companyName = 'Te rugăm să introduci numele companiei';
            }
            if (!invoicingDetails.cui?.trim()) {
                newErrors.cui = 'Te rugăm să introduci CUI-ul';
            }
        }

        if (!invoicingDetails.address?.trim()) {
            newErrors.address = 'Te rugăm să introduci adresa';
        }

        if (!invoicingDetails.city?.trim()) {
            newErrors.city = 'Te rugăm să introduci orașul';
        }

        if (!invoicingDetails.county?.trim()) {
            newErrors.county = 'Te rugăm să introduci județul';
        }

        if (!invoicingDetails.postalCode?.trim()) {
            newErrors.postalCode = 'Te rugăm să introduci codul poștal';
        }

        if (!invoicingDetails.phone?.trim() || !/^(\+40|0)[0-9]{9}$/.test(invoicingDetails.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Te rugăm să introduci un număr de telefon valid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Create order with all details (child details + invoicing)
            const response = await initiateOrder({
                childDetails: {
                    name: childDetails.name!,
                    age: childDetails.age!,
                    gender: childDetails.gender!,
                    achievements: childDetails.achievements!,
                    favoriteThings: childDetails.favoriteThings!,
                    behavior: childDetails.behavior || 'nice',
                },
                email,
                invoicingDetails: {
                    invoiceType: invoicingDetails.invoiceType || 'individual',
                    name: invoicingDetails.name!,
                    cnp: invoicingDetails.cnp,
                    companyName: invoicingDetails.companyName,
                    cui: invoicingDetails.cui,
                    regCom: invoicingDetails.regCom,
                    address: invoicingDetails.address!,
                    city: invoicingDetails.city!,
                    county: invoicingDetails.county!,
                    postalCode: invoicingDetails.postalCode!,
                    phone: invoicingDetails.phone!,
                },
            });

            if (response.success && response.data) {
                setOrderId(response.data.orderId);
                setOrderFinalPriceCents(response.data.finalPrice);
                router.push('/wizard/step3');
            } else {
                setSubmitError(response.error || 'A apărut o eroare. Te rugăm să încerci din nou.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            setSubmitError('A apărut o eroare. Te rugăm să încerci din nou.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 md:p-12 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="text-5xl mb-4"
                    >
                        📄
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 font-christmas">
                        Detalii Facturare
                    </h1>
                    <p className="text-gray-600">
                        Completează datele pentru emiterea facturii
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Invoice Type Selector */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setInvoicingDetails({ invoiceType: 'individual' })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${invoiceType === 'individual'
                                ? 'border-christmas-red bg-red-50 text-christmas-red'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                        >
                            <User className="w-6 h-6" />
                            <span className="font-medium">Persoană Fizică</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setInvoicingDetails({ invoiceType: 'business' })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${invoiceType === 'business'
                                ? 'border-christmas-red bg-red-50 text-christmas-red'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                        >
                            <Building2 className="w-6 h-6" />
                            <span className="font-medium">Persoană Juridică</span>
                        </button>
                    </div>

                    {/* Individual Fields */}
                    {invoiceType === 'individual' ? (
                        <>
                            <div className="relative">
                                <div className="absolute left-4 top-10 text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <InputField
                                    label="Nume și Prenume"
                                    placeholder="Introdu numele complet"
                                    value={invoicingDetails.name || ''}
                                    onChange={(e) => setInvoicingDetails({ name: e.target.value })}
                                    error={errors.name}
                                    required
                                    className="pl-12"
                                />
                            </div>

                            <InputField
                                label="CNP"
                                placeholder="Codul Numeric Personal (13 cifre)"
                                value={invoicingDetails.cnp || ''}
                                onChange={(e) => setInvoicingDetails({ cnp: e.target.value.replace(/\D/g, '').slice(0, 13) })}
                                error={errors.cnp}
                                required
                            />
                        </>
                    ) : (
                        <>
                            <div className="relative">
                                <div className="absolute left-4 top-10 text-gray-400">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <InputField
                                    label="Denumire Firmă"
                                    placeholder="Numele companiei"
                                    value={invoicingDetails.companyName || ''}
                                    onChange={(e) => setInvoicingDetails({ companyName: e.target.value })}
                                    error={errors.companyName}
                                    required
                                    className="pl-12"
                                />
                            </div>

                            <InputField
                                label="Persoană de Contact"
                                placeholder="Nume și prenume"
                                value={invoicingDetails.name || ''}
                                onChange={(e) => setInvoicingDetails({ name: e.target.value })}
                                error={errors.name}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="CUI"
                                    placeholder="Codul Unic de Înregistrare"
                                    value={invoicingDetails.cui || ''}
                                    onChange={(e) => setInvoicingDetails({ cui: e.target.value })}
                                    error={errors.cui}
                                    required
                                />

                                <InputField
                                    label="Nr. Reg. Comerțului"
                                    placeholder="J00/000/0000"
                                    value={invoicingDetails.regCom || ''}
                                    onChange={(e) => setInvoicingDetails({ regCom: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {/* Address Section */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-christmas-gold" />
                            Adresa de Facturare
                        </h3>

                        <div className="space-y-4">
                            <InputField
                                label="Adresă"
                                placeholder="Strada, număr, bloc, scara, apartament"
                                value={invoicingDetails.address || ''}
                                onChange={(e) => setInvoicingDetails({ address: e.target.value })}
                                error={errors.address}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="Oraș"
                                    placeholder="Orașul"
                                    value={invoicingDetails.city || ''}
                                    onChange={(e) => setInvoicingDetails({ city: e.target.value })}
                                    error={errors.city}
                                    required
                                />

                                <InputField
                                    label="Județ"
                                    placeholder="Județul"
                                    value={invoicingDetails.county || ''}
                                    onChange={(e) => setInvoicingDetails({ county: e.target.value })}
                                    error={errors.county}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="Cod Poștal"
                                    placeholder="000000"
                                    value={invoicingDetails.postalCode || ''}
                                    onChange={(e) => setInvoicingDetails({ postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                    error={errors.postalCode}
                                    required
                                />

                                <InputField
                                    label="Telefon"
                                    placeholder="07XX XXX XXX"
                                    value={invoicingDetails.phone || ''}
                                    onChange={(e) => setInvoicingDetails({ phone: e.target.value })}
                                    error={errors.phone}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {submitError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {submitError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <CTAButton
                            type="submit"
                            size="lg"
                            className="w-full"
                            isLoading={isSubmitting}
                            icon={<ArrowRight className="w-5 h-5" />}
                        >
                            Continuă la Plată
                        </CTAButton>
                    </div>

                    {/* Back Link */}
                    <Link href="/wizard/step1">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-christmas-red transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Înapoi la Detalii Copil
                        </button>
                    </Link>
                </form>
            </div>
        </motion.div>
    );
}
