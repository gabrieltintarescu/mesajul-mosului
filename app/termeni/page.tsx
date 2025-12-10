'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Link from 'next/link';

import { Footer, Header } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { siteConfig } from '@/lib/config';

export default function TermsPage() {
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
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-christmas">
                            Termeni și Condiții
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
                                    Acești termeni și condiții (&quot;Termeni&quot;) reglementează utilizarea site-ului
                                    {siteConfig.brand.name} (mesajul-mosului.ro) și a serviciilor oferite de
                                    <strong> GTC SELECT GRUP SRL</strong>.
                                </p>
                                <div className="mt-4 text-sm text-gray-500">
                                    <p><strong>Date firmă:</strong></p>
                                    <p>GTC SELECT GRUP SRL</p>
                                    <p>CUI: 39138255</p>
                                    <p>Reg. Com.: J40/4601/2018</p>
                                    <p>Adresa: Str. Comarnic 59, București, România</p>
                                    <p>Email: {siteConfig.contact.email}</p>
                                </div>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Prin utilizarea site-ului și a serviciilor noastre, acceptați acești Termeni
                                    în integralitatea lor. Dacă nu sunteți de acord cu acești Termeni, vă rugăm
                                    să nu utilizați serviciile noastre.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrierea Serviciului</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {siteConfig.brand.name} oferă servicii de creare a videoclipurilor personalizate
                                    cu Moș Crăciun. Serviciul include:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Generarea unui scenariu personalizat bazat pe datele furnizate</li>
                                    <li>Crearea unui videoclip cu Moș Crăciun folosind tehnologie AI</li>
                                    <li>Livrarea videoclipului prin email în format digital</li>
                                    <li>Posibilitatea de descărcare și partajare a videoclipului</li>
                                </ul>
                            </div>

                            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Natura Produsului Digital și Politica de Returnare</h2>
                                <div className="bg-red-100 p-4 rounded-lg mb-4">
                                    <p className="text-red-800 font-semibold">⚠️ IMPORTANT - VĂ RUGĂM SĂ CITIȚI CU ATENȚIE</p>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Produsele oferite de {siteConfig.brand.name} sunt <strong>produse digitale personalizate</strong>,
                                    create special pentru fiecare client în parte, pe baza informațiilor furnizate la comandă.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    <strong>Conform legislației în vigoare, în special:</strong>
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                    <li>Directiva 2011/83/UE privind drepturile consumatorilor</li>
                                    <li>OUG 34/2014 transpusă în legislația română</li>
                                    <li>Art. 16 lit. (m) din Directiva 2011/83/UE</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    <strong>Dreptul de retragere NU se aplică</strong> pentru:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                    <li>Furnizarea de conținut digital care nu este livrat pe un suport material,
                                        dacă executarea a început cu acordul prealabil expres al consumatorului și
                                        după ce acesta a confirmat că a luat cunoștință de faptul că își va pierde
                                        dreptul de retragere</li>
                                    <li>Furnizarea de bunuri care sunt fabricate conform specificațiilor
                                        consumatorului sau care sunt în mod clar personalizate</li>
                                </ul>
                                <div className="bg-yellow-100 p-4 rounded-lg">
                                    <p className="text-gray-700 font-medium">
                                        📌 Prin plasarea comenzii și efectuarea plății, confirmați că:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                                        <li>Sunteți de acord ca procesarea comenzii să înceapă imediat</li>
                                        <li>Înțelegeți că produsul este personalizat și nu poate fi returnat</li>
                                        <li>Renunțați la dreptul de retragere pentru acest produs digital personalizat</li>
                                        <li>Ați verificat corectitudinea datelor introduse înainte de plată</li>
                                    </ul>
                                </div>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    <strong>În consecință, nu oferim rambursări</strong> pentru comenzile procesate,
                                    deoarece videoclipurile sunt create automat și personalizat pentru fiecare
                                    client imediat după confirmarea plății.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Excepții de la Politica de Nerambursare</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    În mod excepțional, putem analiza solicitările de rambursare în următoarele situații:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li><strong>Eroare tehnică din partea noastră:</strong> dacă videoclipul nu a fost
                                        livrat din cauza unei probleme tehnice pe care nu am putut-o rezolva</li>
                                    <li><strong>Plată dublă accidentală:</strong> în cazul în care sistemul a procesat
                                        aceeași comandă de două ori</li>
                                    <li><strong>Fraudă dovedită:</strong> în cazul utilizării frauduloase a cardului dumneavoastră</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Orice solicitare de rambursare trebuie adresată în scris la {siteConfig.contact.email}
                                    în termen de 7 zile de la data comenzii, cu descrierea detaliată a problemei.
                                    Decizia de aprobare a rambursării rămâne la latitudinea noastră exclusivă.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prețuri și Plăți</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Toate prețurile afișate pe site sunt:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Exprimate în Lei (RON)</li>
                                    <li>Prețuri finale, inclusiv TVA (unde este cazul)</li>
                                    <li>Valabile la momentul plasării comenzii</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    Plățile sunt procesate securizat prin <strong>Stripe</strong>. Acceptăm carduri
                                    Visa, Mastercard, și alte metode de plată disponibile. Nu stocăm datele cardului
                                    dumneavoastră pe serverele noastre.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Obligațiile Utilizatorului</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Prin utilizarea serviciului, vă angajați să:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Furnizați informații corecte și complete la plasarea comenzii</li>
                                    <li>Verificați datele introduse înainte de a efectua plata</li>
                                    <li>Nu utilizați serviciul în scopuri ilegale sau neautorizate</li>
                                    <li>Nu încercați să perturbați funcționarea site-ului sau serviciilor</li>
                                    <li>Nu redistribuiți conținutul fără acordul nostru în scopuri comerciale</li>
                                    <li>Aveți dreptul legal de a furniza datele despre copilul pentru care se creează videoclipul</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Proprietate Intelectuală</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Tot conținutul site-ului (texte, imagini, logo-uri, design, cod sursă) este
                                    protejat de drepturile de autor și aparține GTC SELECT GRUP SRL sau licențiatorilor săi.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Videoclipurile personalizate create pentru dumneavoastră vă sunt licențiate
                                    pentru <strong>uz personal și necomercial</strong>. Puteți:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                                    <li>Viziona și partaja videoclipul cu familia și prietenii</li>
                                    <li>Posta pe rețelele sociale pentru uz personal</li>
                                    <li>Păstra o copie pentru amintiri personale</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    <strong>Nu aveți dreptul</strong> să utilizați videoclipurile în scopuri
                                    comerciale, să le revândeți sau să le modificați pentru a crea produse derivate.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitarea Răspunderii</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    În măsura maximă permisă de lege:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Serviciul este furnizat &quot;ca atare&quot;, fără garanții de niciun fel,
                                        exprese sau implicite</li>
                                    <li>Nu garantăm că serviciul va fi neîntrerupt sau fără erori</li>
                                    <li>Nu suntem responsabili pentru daune indirecte, incidentale, speciale
                                        sau consecutive rezultate din utilizarea serviciului</li>
                                    <li>Răspunderea noastră totală nu va depăși suma plătită pentru comandă</li>
                                    <li>Nu suntem responsabili pentru erorile cauzate de informații incorecte
                                        furnizate de dumneavoastră</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Forța Majoră</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Nu vom fi responsabili pentru neîndeplinirea obligațiilor din cauza unor
                                    evenimente de forță majoră, inclusiv, dar fără a se limita la: dezastre
                                    naturale, războaie, acte de terorism, greve, întreruperi ale serviciilor
                                    de internet sau electricitate, defecțiuni ale serviciilor terțe pe care
                                    ne bazăm (Stripe, Resend, HeyGen, etc.).
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificări ale Termenilor</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Ne rezervăm dreptul de a modifica acești Termeni în orice moment.
                                    Modificările vor fi publicate pe această pagină cu data ultimei actualizări.
                                    Continuarea utilizării serviciului după modificări constituie acceptarea
                                    noilor Termeni.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Legea Aplicabilă și Jurisdicție</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Acești Termeni sunt guvernați de legislația din România. Orice dispute
                                    vor fi soluționate de instanțele competente din București, România, cu
                                    excepția cazului în care legislația privind protecția consumatorilor
                                    prevede altfel.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Dispoziții Finale</h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Dacă orice prevedere a acestor Termeni este considerată invalidă,
                                        celelalte prevederi rămân în vigoare</li>
                                    <li>Nerevendicarea unui drept nu constituie o renunțare la acesta</li>
                                    <li>Acești Termeni constituie acordul complet între părți cu privire
                                        la obiectul lor</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Pentru orice întrebări referitoare la acești Termeni și Condiții:
                                </p>
                                <div className="mt-4 text-gray-600">
                                    <p><strong>GTC SELECT GRUP SRL</strong></p>
                                    <p>Email: {siteConfig.contact.email}</p>
                                    <p>Telefon: {siteConfig.contact.phone}</p>
                                    <p>Adresa: Str. Comarnic 59, București, România</p>
                                </div>
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
