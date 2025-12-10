'use client';

import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import Link from 'next/link';

import { Footer, Header } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { siteConfig } from '@/lib/config';

export default function CookiesPage() {
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
                            <Cookie className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-christmas">
                            Politica Cookie-uri
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Ce sunt Cookie-urile?</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Cookie-urile sunt mici fișiere text stocate pe dispozitivul dumneavoastră
                                    (computer, telefon, tabletă) atunci când vizitați un site web. Acestea permit
                                    site-ului să vă recunoască și să rețină informații despre vizita dumneavoastră,
                                    cum ar fi preferințele de limbă sau alte setări.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. De ce folosim Cookie-uri?</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Site-ul {siteConfig.brand.name} (mesajul-mosului.ro) folosește cookie-uri pentru:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Funcționarea corectă a site-ului</li>
                                    <li>Salvarea progresului în formular (wizard de comandă)</li>
                                    <li>Memorarea preferințelor dumneavoastră</li>
                                    <li>Analiza traficului și îmbunătățirea serviciilor</li>
                                    <li>Asigurarea securității și prevenirea fraudei</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Tipuri de Cookie-uri Utilizate</h2>

                                <div className="space-y-6">
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Cookie-uri Strict Necesare</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Esențiale pentru funcționarea site-ului. Nu pot fi dezactivate.
                                        </p>
                                        <table className="w-full mt-3 text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="text-left p-2">Nume</th>
                                                    <th className="text-left p-2">Scop</th>
                                                    <th className="text-left p-2">Durată</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">wizard-store</td>
                                                    <td className="p-2">Salvează datele formularului de comandă</td>
                                                    <td className="p-2">Sesiune</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">__stripe_mid</td>
                                                    <td className="p-2">Procesare plăți securizată (Stripe)</td>
                                                    <td className="p-2">1 an</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">__stripe_sid</td>
                                                    <td className="p-2">Sesiune de plată (Stripe)</td>
                                                    <td className="p-2">30 min</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Cookie-uri de Preferințe</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Permit site-ului să rețină preferințele dumneavoastră.
                                        </p>
                                        <table className="w-full mt-3 text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="text-left p-2">Nume</th>
                                                    <th className="text-left p-2">Scop</th>
                                                    <th className="text-left p-2">Durată</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">cookie-consent</td>
                                                    <td className="p-2">Memorează alegerea pentru cookie-uri</td>
                                                    <td className="p-2">1 an</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="border-l-4 border-yellow-500 pl-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Cookie-uri Analitice</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Ne ajută să înțelegem cum este utilizat site-ul pentru a-l îmbunătăți.
                                        </p>
                                        <table className="w-full mt-3 text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="text-left p-2">Nume</th>
                                                    <th className="text-left p-2">Scop</th>
                                                    <th className="text-left p-2">Durată</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">_ga</td>
                                                    <td className="p-2">Google Analytics - identificare vizitatori</td>
                                                    <td className="p-2">2 ani</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">_gid</td>
                                                    <td className="p-2">Google Analytics - identificare sesiune</td>
                                                    <td className="p-2">24 ore</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">sentry-*</td>
                                                    <td className="p-2">Monitorizare erori pentru îmbunătățiri</td>
                                                    <td className="p-2">Sesiune</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Cookie-uri de Marketing</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Utilizate pentru a vă afișa reclame relevante (dacă este cazul).
                                        </p>
                                        <table className="w-full mt-3 text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="text-left p-2">Nume</th>
                                                    <th className="text-left p-2">Scop</th>
                                                    <th className="text-left p-2">Durată</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                <tr className="border-b">
                                                    <td className="p-2 font-mono text-xs">_fbp</td>
                                                    <td className="p-2">Facebook Pixel - măsurare conversii</td>
                                                    <td className="p-2">3 luni</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookie-uri de la Terți</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Site-ul nostru poate include conținut de la servicii terțe care își setează
                                    propriile cookie-uri:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li><strong>Stripe:</strong> pentru procesarea securizată a plăților</li>
                                    <li><strong>Google Analytics:</strong> pentru analiza traficului (dacă este activat)</li>
                                    <li><strong>Sentry:</strong> pentru monitorizarea și raportarea erorilor</li>
                                    <li><strong>Facebook:</strong> pentru măsurarea conversiilor publicitare</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Aceste servicii terțe au propriile politici de confidențialitate și cookie-uri.
                                    Vă recomandăm să le consultați pentru mai multe informații.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Gestionarea Cookie-urilor</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Puteți controla și gestiona cookie-urile în mai multe moduri:
                                </p>

                                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                                    5.1 Setările Browserului
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Majoritatea browserelor vă permit să:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                    <li>Vizualizați cookie-urile stocate și să le ștergeți individual</li>
                                    <li>Blocați cookie-urile de la terți</li>
                                    <li>Blocați cookie-urile de la anumite site-uri</li>
                                    <li>Blocați toate cookie-urile</li>
                                    <li>Ștergeți toate cookie-urile când închideți browserul</li>
                                </ul>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-yellow-800">
                                        <strong>⚠️ Atenție:</strong> Dacă blocați cookie-urile strict necesare,
                                        este posibil ca unele funcționalități ale site-ului să nu funcționeze
                                        corect (ex: salvarea datelor în formular, procesarea plăților).
                                    </p>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
                                    5.2 Link-uri pentru Setări Browser
                                </h3>
                                <ul className="list-none text-gray-600 space-y-2">
                                    <li>
                                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-christmas-red hover:underline">
                                            → Google Chrome
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.mozilla.org/ro/kb/cookie-uri-informatii-site-urile-le-stocheaza-compu" target="_blank" rel="noopener noreferrer" className="text-christmas-red hover:underline">
                                            → Mozilla Firefox
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-christmas-red hover:underline">
                                            → Safari
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://support.microsoft.com/ro-ro/microsoft-edge/ștergeți-modulele-cookie-în-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-christmas-red hover:underline">
                                            → Microsoft Edge
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Local Storage și Session Storage</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Pe lângă cookie-uri, folosim și tehnologii similare precum Local Storage și
                                    Session Storage pentru a stoca date în browserul dumneavoastră. Acestea sunt
                                    utilizate pentru:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                                    <li>Salvarea temporară a datelor din formularul de comandă</li>
                                    <li>Păstrarea stării aplicației între pagini</li>
                                    <li>Îmbunătățirea performanței prin cache local</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Puteți șterge aceste date din setările browserului, la fel ca și cookie-urile.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Actualizări ale Politicii</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Această politică poate fi actualizată periodic pentru a reflecta modificări
                                    ale cookie-urilor utilizate sau ale legislației aplicabile. Data ultimei
                                    actualizări este afișată în partea de sus a acestei pagini.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Pentru întrebări despre utilizarea cookie-urilor pe site-ul nostru:
                                </p>
                                <div className="mt-4 text-gray-600">
                                    <p><strong>GTC SELECT GRUP SRL</strong></p>
                                    <p>Email: {siteConfig.contact.email}</p>
                                    <p>Telefon: {siteConfig.contact.phone}</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Documente Conexe</h2>
                                <ul className="list-none space-y-2">
                                    <li>
                                        <Link href="/privacy" className="text-christmas-red hover:underline">
                                            → Politica de Confidențialitate
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="text-christmas-red hover:underline">
                                            → Termeni și Condiții
                                        </Link>
                                    </li>
                                </ul>
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
