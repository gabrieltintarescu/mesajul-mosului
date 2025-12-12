'use client';

import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Footer, Header } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { CTAButton } from '@/components/ui';
import { siteConfig } from '@/lib/config';

interface FAQItem {
    question: string;
    answer: string;
}

const faqCategories = [
    {
        title: 'Despre Serviciu',
        icon: '🎅',
        items: [
            {
                question: 'Ce este Mesajul Moșului?',
                answer: 'Mesajul Moșului este un serviciu care creează videoclipuri personalizate de la Moș Crăciun pentru copilul tău. Folosim tehnologie avansată pentru a genera mesaje video în care Moșul vorbește direct cu copilul, menționându-i numele, realizările și lucrurile preferate.',
            },
            {
                question: 'Cum funcționează?',
                answer: 'Este foarte simplu! Completezi un formular cu detalii despre copil (nume, vârstă, realizări, lucruri preferate), faci plata securizată, iar noi creăm videoclipul personalizat. Îl primești pe email în aproximativ 15 minute.',
            },
            {
                question: 'În ce limbă este videoclipul?',
                answer: 'Toate videoclipurile sunt în limba română, perfect pentru copiii din România și din diaspora.',
            },
            {
                question: 'Cât durează videoclipul?',
                answer: 'Fiecare videoclip are o durată de aproximativ 1-3 minute, suficient pentru a transmite un mesaj cald și personalizat.',
            },
        ],
    },
    {
        title: 'Plată și Prețuri',
        icon: '💳',
        items: [
            {
                question: 'Cât costă un videoclip?',
                answer: `Prețul standard este de ${siteConfig.pricing.basePrice} Lei pentru un videoclip complet personalizat. Acceptăm și coduri de cupon pentru reduceri.`,
            },
            {
                question: 'Ce metode de plată acceptați?',
                answer: 'Acceptăm plăți cu cardul (Visa, Mastercard) prin Stripe, una dintre cele mai sigure platforme de plăți din lume.',
            },
            {
                question: 'Pot primi factură?',
                answer: 'Da! În pasul 2 al comenzii poți solicita factură completând datele de facturare (nume/firmă, CUI dacă este cazul, adresă).',
            }
        ],
    },
    {
        title: 'Livrare și Acces',
        icon: '📧',
        items: [
            {
                question: 'Cât durează până primesc videoclipul?',
                answer: 'Videoclipul este livrat în aproximativ 15 minute de la confirmarea plății. Îl primești direct pe adresa de email introdusă.',
            },
            {
                question: 'Pot descărca videoclipul?',
                answer: 'Da! Primești un link de descărcare pe email și poți salva videoclipul pe dispozitivul tău pentru a-l păstra pentru totdeauna.',
            },
            {
                question: 'Cât timp este valid link-ul de descărcare?',
                answer: 'Link-ul de descărcare este valid timp de 7 zile. Te recomandăm să descarci videoclipul cât mai curând posibil.',
            },
            {
                question: 'Pot trimite videoclipul pe WhatsApp?',
                answer: 'Absolut! După descărcare, poți trimite videoclipul prin WhatsApp, Facebook Messenger, email sau orice altă aplicație.',
            },
        ],
    },
    {
        title: 'Personalizare',
        icon: '✨',
        items: [
            {
                question: 'Ce informații pot personaliza?',
                answer: 'Poți personaliza: numele copilului, vârsta, genul, mesajul de la părinți (realizări, sfaturi, încurajări), lucrurile preferate și comportamentul general.',
            },
            {
                question: 'Pot menționa greșeli ale copilului?',
                answer: 'Da! În câmpul "Ce Să-i Spună Moș Crăciun?" poți scrie atât realizări cât și lucruri de îmbunătățit. Moșul le va transmite într-un mod blând și încurajator.',
            },
            {
                question: 'Pot comanda pentru mai mulți copii?',
                answer: 'Da, poți face câte comenzi dorești. Fiecare copil va primi propriul videoclip personalizat.',
            },
            {
                question: 'Pot modifica videoclipul după ce a fost creat?',
                answer: 'Odată creat, videoclipul nu poate fi modificat. Te rugăm să verifici cu atenție datele înainte de a finaliza comanda.',
            },
        ],
    },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left hover:text-christmas-red transition-colors"
            >
                <span className="font-medium text-gray-900 pr-8">{item.question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <p className="pb-5 text-gray-600 leading-relaxed">{item.answer}</p>
            </motion.div>
        </div>
    );
}

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

    const toggleItem = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

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
                            <HelpCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-christmas">
                            Întrebări Frecvente
                        </h1>
                        <p className="text-xl text-white/80">
                            Găsește răspunsuri la cele mai comune întrebări despre serviciul nostru.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 bg-gradient-to-b from-white to-red-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {faqCategories.map((category, categoryIndex) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: categoryIndex * 0.1 }}
                                className="mb-12"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">{category.icon}</span>
                                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                                </div>
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    {category.items.map((item, itemIndex) => (
                                        <FAQAccordion
                                            key={itemIndex}
                                            item={item}
                                            isOpen={openItems[`${categoryIndex}-${itemIndex}`] || false}
                                            onToggle={() => toggleItem(categoryIndex, itemIndex)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Still have questions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-2xl mx-auto text-center mt-16 p-8 bg-white rounded-2xl shadow-lg"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Nu ai găsit răspunsul?</h3>
                        <p className="text-gray-600 mb-6">
                            Echipa noastră este aici să te ajute. Contactează-ne și îți vom răspunde cât mai curând.
                        </p>
                        <Link href="/contact">
                            <CTAButton>Contactează-ne</CTAButton>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </>
    );
}
