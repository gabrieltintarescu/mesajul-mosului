'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Link from 'next/link';

import { Footer, Header } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { siteConfig } from '@/lib/config';

export default function PrivacyPage() {
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
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-christmas">
                            Politica de Confidențialitate
                        </h1>
                        <p className="text-xl text-white/80">
                            Ultima actualizare: 10 Decembrie 2024
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informații Generale</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Această politică de confidențialitate descrie modul în care <strong>GTC SELECT GRUP SRL</strong>
                                    (&quot;noi&quot;, &quot;al nostru&quot;) colectează, utilizează și protejează informațiile personale
                                    pe care le furnizați atunci când utilizați site-ul nostru {siteConfig.brand.name}
                                    (mesajul-mosului.ro).
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Datele Colectate</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Colectăm următoarele tipuri de informații:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li><strong>Date de identificare:</strong> nume, prenume, adresă de email</li>
                                    <li><strong>Date pentru personalizare video:</strong> numele copilului, vârsta, realizări, mesaje speciale</li>
                                    <li><strong>Date de facturare:</strong> adresă, date firmă (pentru facturi pe firmă)</li>
                                    <li><strong>Date de plată:</strong> procesate securizat prin Stripe (nu stocăm date de card)</li>
                                    <li><strong>Date tehnice:</strong> adresă IP, tip browser, pagini vizitate</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Scopul Prelucrării Datelor</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Utilizăm datele colectate pentru:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Crearea videoclipurilor personalizate cu Moș Crăciun</li>
                                    <li>Procesarea plăților și emiterea facturilor</li>
                                    <li>Trimiterea videoclipului finalizat pe email</li>
                                    <li>Comunicări privind statusul comenzii</li>
                                    <li>Suport clienți și rezolvarea problemelor</li>
                                    <li>Îmbunătățirea serviciilor noastre</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Temeiul Legal</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Prelucrăm datele dumneavoastră personale în baza următoarelor temeiuri legale,
                                    conform Regulamentului General privind Protecția Datelor (GDPR):
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                                    <li><strong>Executarea contractului:</strong> pentru livrarea serviciului comandat</li>
                                    <li><strong>Obligații legale:</strong> pentru emiterea facturilor conform legislației fiscale</li>
                                    <li><strong>Consimțământ:</strong> pentru comunicări de marketing (opțional)</li>
                                    <li><strong>Interes legitim:</strong> pentru îmbunătățirea serviciilor și prevenirea fraudei</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Partajarea Datelor</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Datele dumneavoastră pot fi partajate cu alte terțe pentru furnizarea produsului digital, cât și cu autorități când este cerut de lege.
                                </p>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Nu vindem și nu închiriem datele dumneavoastră personale către terți.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Stocarea și Securitatea Datelor</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Datele sunt stocate pe servere securizate în Uniunea Europeană. Implementăm măsuri
                                    tehnice și organizatorice adecvate pentru protecția datelor, inclusiv:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                                    <li>Criptare SSL/TLS pentru toate comunicările</li>
                                    <li>Acces restricționat la date pe bază de necesitate</li>
                                    <li>Backup-uri regulate și securizate</li>
                                    <li>Monitorizare continuă a securității</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Perioada de Păstrare</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Păstrăm datele dumneavoastră pentru perioade diferite în funcție de scop:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                                    <li><strong>Date de comandă:</strong> 5 ani (conform obligațiilor fiscale)</li>
                                    <li><strong>Videoclipuri generate:</strong> 30 de zile după livrare</li>
                                    <li><strong>Date de contact:</strong> până la solicitarea ștergerii</li>
                                    <li><strong>Date tehnice (logs):</strong> 90 de zile</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Drepturile Dumneavoastră</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Conform GDPR, aveți următoarele drepturi:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li><strong>Dreptul de acces:</strong> să solicitați o copie a datelor dumneavoastră</li>
                                    <li><strong>Dreptul la rectificare:</strong> să corectați datele inexacte</li>
                                    <li><strong>Dreptul la ștergere:</strong> să solicitați ștergerea datelor</li>
                                    <li><strong>Dreptul la restricționare:</strong> să limitați prelucrarea</li>
                                    <li><strong>Dreptul la portabilitate:</strong> să primiți datele într-un format structurat</li>
                                    <li><strong>Dreptul de opoziție:</strong> să vă opuneți prelucrării</li>
                                    <li><strong>Dreptul de retragere a consimțământului:</strong> în orice moment</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Pentru exercitarea acestor drepturi, contactați-ne la {siteConfig.contact.email}.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Protecția Minorilor</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Serviciul nostru este destinat adulților care comandă videoclipuri pentru copii.
                                    Nu colectăm în mod intenționat date direct de la copii sub 16 ani. Toate datele
                                    despre copii sunt furnizate de părinți/tutori legali pentru scopul exclusiv al
                                    personalizării videoclipului.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificări ale Politicii</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Ne rezervăm dreptul de a actualiza această politică periodic. Modificările
                                    semnificative vor fi comunicate prin email sau prin notificare pe site.
                                    Vă încurajăm să consultați periodic această pagină.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact și Plângeri</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Pentru întrebări despre această politică sau pentru a exercita drepturile dumneavoastră:
                                </p>
                                <div className="mt-4 text-gray-600">
                                    <p><strong>Email:</strong> {siteConfig.contact.email}</p>
                                    <p><strong>Telefon:</strong> {siteConfig.contact.phone}</p>
                                    <p><strong>Adresă:</strong> Str. Comarnic 59, București, România</p>
                                </div>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Dacă considerați că drepturile dumneavoastră au fost încălcate, puteți depune
                                    o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
                                    Caracter Personal (ANSPDCP) - <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-christmas-red hover:underline">www.dataprotection.ro</a>.
                                </p>
                            </div>
                        </motion.div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-christmas-red hover:text-christmas-red/80 font-medium"
                            >
                                ← Înapoi la pagina principală
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
