'use client';

import { motion } from 'framer-motion';
import {
    Clock,
    Mail,
    Phone,
    Send
} from 'lucide-react';
import { useState } from 'react';

import { Footer, Header } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { CTAButton, InputField, TextAreaField, WhatsAppIcon } from '@/components/ui';
import { getContactLinks, siteConfig } from '@/lib/config';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const contactLinks = getContactLinks();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || 'Eroare la trimiterea mesajului');
            }
        } catch {
            setError('Eroare de conexiune. Încearcă din nou.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            value: siteConfig.contact.email,
            href: contactLinks.emailLink,
            description: 'Răspundem în maxim 24 de ore',
        },
        {
            icon: Phone,
            title: 'Telefon',
            value: siteConfig.contact.phone,
            href: contactLinks.phoneLink,
            description: 'Luni - Vineri, 9:00 - 18:00',
        },
        {
            icon: WhatsAppIcon,
            title: 'WhatsApp',
            value: siteConfig.contact.phone,
            href: contactLinks.whatsappLink,
            description: 'Scrie-ne oricând',
        },
    ];

    return (
        <>
            <Header variant="light" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 hero-gradient overflow-hidden">
                <SnowfallBackground />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-christmas">
                            Contactează-ne
                        </h1>
                        <p className="text-xl text-white/80">
                            Suntem aici să te ajutăm. Scrie-ne și îți răspundem cât mai curând posibil.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 bg-gradient-to-b from-white to-red-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Contact Info */}
                            <div className="lg:col-span-1 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Informații de Contact
                                    </h2>

                                    {contactInfo.map((info, index) => (
                                        <motion.a
                                            key={info.title}
                                            href={info.href}
                                            target={info.title === 'WhatsApp' ? '_blank' : undefined}
                                            rel={info.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow mb-4 block"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-christmas-red/10 flex items-center justify-center flex-shrink-0">
                                                <info.icon className="w-6 h-6 text-christmas-red" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{info.title}</h3>
                                                <p className="text-christmas-red font-medium">{info.value}</p>
                                                <p className="text-sm text-gray-500">{info.description}</p>
                                            </div>
                                        </motion.a>
                                    ))}

                                    {/* Working Hours */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="p-4 bg-gradient-to-br from-christmas-green to-green-600 rounded-xl text-white mt-6"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Clock className="w-5 h-5" />
                                            <h3 className="font-semibold">Program de Lucru</h3>
                                        </div>
                                        <ul className="space-y-1 text-sm text-white/90">
                                            <li className="flex justify-between">
                                                <span>Luni - Vineri:</span>
                                                <span>9:00 - 18:00</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Sâmbătă:</span>
                                                <span>10:00 - 14:00</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Duminică:</span>
                                                <span>Închis</span>
                                            </li>
                                        </ul>
                                        <p className="text-xs text-white/70 mt-3">
                                            * În perioada Crăciunului suntem disponibili non-stop!
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-2"
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Trimite-ne un Mesaj
                                    </h2>

                                    {submitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                                <Send className="w-10 h-10 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                Mesaj Trimis cu Succes!
                                            </h3>
                                            <p className="text-gray-600">
                                                Mulțumim pentru mesaj! Îți vom răspunde în cel mai scurt timp posibil.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <InputField
                                                    label="Numele Tău"
                                                    placeholder="Ex: Ion Popescu"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, name: e.target.value })
                                                    }
                                                    required
                                                />
                                                <InputField
                                                    label="Email"
                                                    type="email"
                                                    placeholder="ex: ion@email.com"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, email: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <InputField
                                                label="Subiect"
                                                placeholder="Ex: Întrebare despre comandă"
                                                value={formData.subject}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, subject: e.target.value })
                                                }
                                                required
                                            />

                                            <TextAreaField
                                                label="Mesajul Tău"
                                                placeholder="Descrie cum te putem ajuta..."
                                                value={formData.message}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, message: e.target.value })
                                                }
                                                required
                                            />

                                            {error && (
                                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <CTAButton
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="animate-spin mr-2">⏳</span>
                                                        Se trimite...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Trimite Mesajul
                                                    </>
                                                )}
                                            </CTAButton>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
