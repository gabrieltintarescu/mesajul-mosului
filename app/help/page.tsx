'use client';

import { motion } from 'framer-motion';
import {
    AlertCircle,
    Download,
    HelpCircle,
    Mail,
    RefreshCw,
    Video
} from 'lucide-react';
import Link from 'next/link';

import { Footer, Header } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { CTAButton } from '@/components/ui';
import { siteConfig } from '@/lib/config';

const helpTopics = [
    {
        icon: Video,
        title: 'Probleme cu Videoclipul',
        description: 'Nu ai primit videoclipul sau ai probleme la redare?',
        href: '#video-issues',
        color: 'bg-blue-500',
    },
    {
        icon: Download,
        title: 'Descărcare și Partajare',
        description: 'Cum descarci și trimiți videoclipul?',
        href: '#download',
        color: 'bg-green-500',
    },
    {
        icon: RefreshCw,
        title: 'Modificări și Rambursări',
        description: 'Vrei să modifici comanda sau să ceri rambursare?',
        href: '#refunds',
        color: 'bg-orange-500',
    },
    {
        icon: AlertCircle,
        title: 'Probleme Tehnice',
        description: 'Erori sau probleme cu site-ul?',
        href: '#technical',
        color: 'bg-red-500',
    },
];

const guides = [
    {
        id: 'video-issues',
        icon: Video,
        title: 'Probleme cu Videoclipul',
        sections: [
            {
                title: 'Nu am primit videoclipul pe email',
                steps: [
                    'Verifică folderul Spam sau Junk din email',
                    'Asigură-te că adresa de email introdusă este corectă',
                    'Așteaptă până la 15 minute de la confirmarea plății',
                    'Verifică pagina de status a comenzii (link-ul din email)',
                    'Dacă problema persistă, contactează-ne cu ID-ul comenzii',
                ],
            },
            {
                title: 'Videoclipul nu se redă',
                steps: [
                    'Încearcă să descarci videoclipul și să-l deschizi local',
                    'Folosește un alt browser (Chrome, Firefox, Safari)',
                    'Verifică conexiunea la internet',
                    'Dezactivează temporar extensiile de browser',
                    'Încearcă pe alt dispozitiv (telefon, tabletă)',
                ],
            },
            {
                title: 'Calitatea video este slabă',
                steps: [
                    'Descarcă videoclipul în loc să-l vizualizezi streaming',
                    'Verifică să ai o conexiune stabilă la internet',
                    'Videoclipurile sunt în HD (720p) - ar trebui să fie clare',
                    'Dacă problema persistă, contactează-ne pentru regenerare',
                ],
            },
        ],
    },
    {
        id: 'download',
        icon: Download,
        title: 'Descărcare și Partajare',
        sections: [
            {
                title: 'Cum descarc videoclipul?',
                steps: [
                    'Deschide email-ul cu subiectul "Videoclipul tău de la Moș Crăciun"',
                    'Click pe butonul "Descarcă Videoclipul" sau "Vezi Videoclipul"',
                    'Pe pagina cu videoclipul, click pe butonul de descărcare',
                    'Videoclipul se va salva în folderul Downloads',
                ],
            },
            {
                title: 'Cum trimit videoclipul pe WhatsApp?',
                steps: [
                    'Descarcă videoclipul pe telefon',
                    'Deschide WhatsApp și selectează conversația',
                    'Apasă pe iconița de atașare (📎)',
                    'Selectează "Video" și alege videoclipul descărcat',
                    'Trimite!',
                ],
            },
            {
                title: 'Link-ul de descărcare nu funcționează',
                steps: [
                    'Link-urile sunt valide 7 zile de la generare',
                    'Dacă a expirat, contactează-ne pentru un link nou',
                    'Încearcă să deschizi link-ul într-un alt browser',
                    'Verifică să nu ai probleme cu conexiunea la internet',
                ],
            },
        ],
    },
    {
        id: 'refunds',
        icon: RefreshCw,
        title: 'Modificări și Rambursări',
        sections: [
            {
                title: 'Pot modifica comanda după plată?',
                steps: [
                    'Din păcate, comenzile nu pot fi modificate după plată',
                    'Videoclipul se generează automat imediat',
                    'Verifică cu atenție datele înainte de a plăti',
                    'Pentru greșeli majore, contactează-ne pentru soluții',
                ],
            },
            {
                title: 'Cum solicit rambursarea?',
                steps: [
                    `Trimite un email la ${siteConfig.contact.email}`,
                    'Include ID-ul comenzii și motivul solicitării',
                    'Răspundem în maxim 24 de ore',
                    'Rambursările se procesează în 5-10 zile lucrătoare',
                ],
            }
        ],
    },
    {
        id: 'technical',
        icon: AlertCircle,
        title: 'Probleme Tehnice',
        sections: [
            {
                title: 'Site-ul nu funcționează corect',
                steps: [
                    'Reîncarcă pagina (Ctrl+R sau Cmd+R)',
                    'Șterge cache-ul și cookie-urile browserului',
                    'Încearcă într-un browser diferit',
                    'Dezactivează extensiile de browser',
                    'Verifică dacă ai JavaScript activat',
                ],
            },
            {
                title: 'Plata nu a fost procesată',
                steps: [
                    'Verifică să ai fonduri suficiente pe card',
                    'Asigură-te că datele cardului sunt corecte',
                    'Încearcă cu un alt card',
                    'Contactează banca pentru deblocare plăți online',
                    'Dacă banii au fost retrași dar comanda nu apare, contactează-ne',
                ],
            },
            {
                title: 'Am plătit dar nu văd comanda',
                steps: [
                    'Verifică email-ul pentru confirmarea plății',
                    'Plățile se confirmă în câteva secunde/minute',
                    'Caută în Spam dacă nu vezi email-ul',
                    'Contactează-ne cu dovada plății (screenshot)',
                ],
            },
        ],
    },
];

export default function HelpPage() {
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
                            Centru de Ajutor
                        </h1>
                        <p className="text-xl text-white/80">
                            Ghiduri pas cu pas pentru a rezolva orice problemă.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Cu ce te putem ajuta?
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {helpTopics.map((topic, index) => (
                                <motion.a
                                    key={topic.title}
                                    href={topic.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                >
                                    <div className={`w-12 h-12 rounded-lg ${topic.color} flex items-center justify-center mb-4`}>
                                        <topic.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-christmas-red transition-colors">
                                        {topic.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{topic.description}</p>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Guides */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {guides.map((guide, guideIndex) => (
                            <motion.div
                                key={guide.id}
                                id={guide.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-lg bg-christmas-red flex items-center justify-center">
                                        <guide.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{guide.title}</h2>
                                </div>

                                <div className="space-y-6">
                                    {guide.sections.map((section, sectionIndex) => (
                                        <div
                                            key={sectionIndex}
                                            className="bg-white rounded-xl shadow-md p-6"
                                        >
                                            <h3 className="font-semibold text-lg text-gray-900 mb-4">
                                                {section.title}
                                            </h3>
                                            <ol className="space-y-3">
                                                {section.steps.map((step, stepIndex) => (
                                                    <li
                                                        key={stepIndex}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-christmas-green/10 text-christmas-green text-sm font-medium flex items-center justify-center">
                                                            {stepIndex + 1}
                                                        </span>
                                                        <span className="text-gray-700">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still need help */}
            <section className="py-16 bg-gradient-to-b from-white to-red-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl shadow-lg"
                    >
                        <div className="w-16 h-16 rounded-full bg-christmas-gold/20 flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-christmas-gold" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Încă ai nevoie de ajutor?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Nu ezita să ne contactezi. Echipa noastră este pregătită să te ajute cu orice problemă.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/contact">
                                <CTAButton>
                                    <Mail className="w-5 h-5 mr-2" />
                                    Contactează-ne
                                </CTAButton>
                            </Link>
                            <Link href="/intrebari-frecvente">
                                <CTAButton>
                                    <HelpCircle className="w-5 h-5 mr-2" />
                                    Vezi Întrebările Frecvente
                                </CTAButton>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </>
    );
}
