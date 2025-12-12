'use client';

import { CTAButton, InputField, SelectField, TextAreaField } from '@/components/ui';
import { siteConfig } from '@/lib/config';
import { ttqIdentify, ttqInitiateCheckout } from '@/lib/tiktok';
import { useWizardStore } from '@/store';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Smile, Star, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface FormErrors {
    name?: string;
    age?: string;
    gender?: string;
    achievements?: string;
    favoriteThings?: string;
    email?: string;
}

export function Step1Form() {
    const router = useRouter();
    const { childDetails, email, setChildDetails, setEmail } = useWizardStore();
    const [errors, setErrors] = useState<FormErrors>({});

    // Track InitiateCheckout when user lands on step 1
    useEffect(() => {
        ttqInitiateCheckout(siteConfig.pricing.basePrice);
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!childDetails.name?.trim()) {
            newErrors.name = 'Te rugăm să introduci numele copilului';
        }

        if (!childDetails.age || childDetails.age < 1 || childDetails.age > 17) {
            newErrors.age = 'Te rugăm să introduci o vârstă validă (1-17)';
        }

        if (!childDetails.gender) {
            newErrors.gender = 'Te rugăm să selectezi genul';
        }

        if (!childDetails.achievements?.trim()) {
            newErrors.achievements = 'Te rugăm să scrii ce vrei să-i spună Moșul copilului';
        }

        if (!childDetails.favoriteThings?.trim()) {
            newErrors.favoriteThings = 'Te rugăm să menționezi câteva lucruri preferate';
        }

        if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Te rugăm să introduci o adresă de email validă';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Identify user with email for better tracking
        if (email) {
            ttqIdentify({ email });
        }

        // Store is already updated via onChange handlers
        // Navigate to step 2 for invoicing details
        router.push('/comanda/pas-2');
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
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="text-5xl mb-4"
                    >
                        🎅
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 font-christmas">
                        Spune-ne Despre Copilul Tău
                    </h1>
                    <p className="text-gray-600">
                        Moș Crăciun are nevoie de aceste detalii pentru a crea un video magic personalizat
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Child's Name */}
                    <div className="relative">
                        <div className="absolute left-4 top-10 text-gray-400">
                            <User className="w-5 h-5" />
                        </div>
                        <InputField
                            label="Numele Copilului"
                            placeholder="Introdu prenumele copilului"
                            value={childDetails.name || ''}
                            onChange={(e) => setChildDetails({ name: e.target.value })}
                            error={errors.name}
                            required
                            className="pl-12"
                        />
                    </div>

                    {/* Age and Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="Vârsta"
                            type="number"
                            min={1}
                            max={17}
                            placeholder="Vârsta"
                            value={childDetails.age || ''}
                            onChange={(e) => setChildDetails({ age: parseInt(e.target.value) || undefined })}
                            error={errors.age}
                            required
                        />

                        <SelectField
                            label="Gen"
                            value={childDetails.gender || ''}
                            onChange={(e) => setChildDetails({ gender: e.target.value as 'boy' | 'girl' })}
                            options={[
                                { value: 'boy', label: 'Băiat' },
                                { value: 'girl', label: 'Fată' },
                            ]}
                            error={errors.gender}
                            required
                        />
                    </div>

                    {/* Behavior */}
                    <SelectField
                        label="Cum s-a comportat copilul anul acesta?"
                        value={childDetails.behavior || 'nice'}
                        onChange={(e) => setChildDetails({ behavior: e.target.value as 'nice' | 'naughty' | 'mostly_nice' })}
                        options={[
                            { value: 'nice', label: '😇 Foarte Cuminte - Un adevărat îngeraș!' },
                            { value: 'mostly_nice', label: '😊 Aproape Cuminte - Câteva mici abateri' },
                            { value: 'naughty', label: '😈 Puțin Neastâmpărat - Loc de îmbunătățire' },
                        ]}
                        helperText="Nu-ți face griji, Moș Crăciun e mereu blând și încurajator!"
                    />

                    {/* Achievements / Message for Santa */}
                    <div className="relative">
                        <TextAreaField
                            label="Ce Să-i Spună Moș Crăciun?"
                            placeholder="Ex: a învățat să meargă pe bicicletă, a luat note bune, uneori nu și-a făcut temele, să fie mai ordonat, să asculte de părinți..."
                            value={childDetails.achievements || ''}
                            onChange={(e) => setChildDetails({ achievements: e.target.value })}
                            error={errors.achievements}
                            helperText="Scrie realizări, sfaturi, sau ce vrei să menționeze Moșul (realizări, greșeli de corectat, încurajări)"
                            required
                        />
                        <Star className="absolute right-4 top-2 w-4 h-4 text-christmas-gold" />
                    </div>

                    {/* Favorite Things */}
                    <div className="relative">
                        <TextAreaField
                            label="Lucruri Preferate"
                            placeholder="Ex: dinozauri, prințese, fotbal, desen, înghețată, animalul de companie..."
                            value={childDetails.favoriteThings || ''}
                            onChange={(e) => setChildDetails({ favoriteThings: e.target.value })}
                            error={errors.favoriteThings}
                            helperText="Moș Crăciun le va menționa pentru a face videoclipul extra special!"
                            required
                        />
                        <Heart className="absolute right-4 top-2 w-4 h-4 text-christmas-red" />
                    </div>

                    {/* Email */}
                    <InputField
                        label="Adresa Ta de Email"
                        type="email"
                        placeholder="parinte@exemplu.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        helperText="Vom trimite link-ul video pe acest email"
                        required
                    />

                    {/* Submit Button */}
                    <div className="pt-4">
                        <CTAButton
                            type="submit"
                            size="lg"
                            className="w-full"
                            icon={<ArrowRight className="w-5 h-5" />}
                        >
                            Continuă la Facturare
                        </CTAButton>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 pt-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Smile className="w-4 h-4 text-christmas-green" />
                            100% Satisfacție
                        </span>
                        <span>•</span>
                        <span>🔒 Sigur și Privat</span>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
