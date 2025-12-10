'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Gift,
  Heart,
  MessageCircle,
  Play,
  Shield,
  Sparkles,
  Star,
  Video,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { FeatureCard, Footer, Header, PricingBox } from '@/components/layout';
import { SnowfallBackground } from '@/components/sections';
import { CTAButton, MotionFadeIn } from '@/components/ui';

function getDaysUntilChristmas(): number {
  const today = new Date();
  const currentYear = today.getFullYear();
  const christmas = new Date(currentYear, 11, 25); // December 25

  // If Christmas has passed this year, calculate for next year
  if (today > christmas) {
    christmas.setFullYear(currentYear + 1);
  }

  const diffTime = christmas.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function Home() {
  const daysUntilChristmas = useMemo(() => getDaysUntilChristmas(), []);

  const testimonials = [
    {
      name: 'Maria P.',
      location: 'București, România',
      quote: 'Fața fetiței mele s-a luminat când Moșul i-a spus numele și a menționat dragostea ei pentru unicorni! L-a urmărit de 10 ori. Absolut magic!',
    },
    {
      name: 'Andrei D.',
      location: 'Cluj-Napoca, România',
      quote: 'Cel mai bun cadou de Crăciun! Fiul meu nu-i venea să creadă că Moșul știa despre performanțele lui la fotbal. Merită fiecare ban.',
    },
    {
      name: 'Elena M.',
      location: 'Iași, România',
      quote: 'Calitatea video este uimitoare și personalizarea este perfectă. Copiii mei cred că e Moșul adevărat! Vom comanda și anul viitor.',
    },
    {
      name: 'Cristian R.',
      location: 'Timișoara, România',
      quote: 'Atât de ușor de folosit și livrat în câteva minute. Fiica mea a rămas fără cuvinte când Moșul a felicitat-o pentru că a învățat să citească!',
    },
    {
      name: 'Georgiana T.',
      location: 'Brașov, România',
      quote: 'O experiență minunată! Copilul meu a plâns de bucurie. Videoclipul este de o calitate excelentă și personalizarea este incredibilă!',
    },
    {
      name: 'Ionuț V.',
      location: 'Constanța, România',
      quote: 'Serviciu rapid și profesionist. Videoclipul a depășit toate așteptările. Fetița mea îl arată tuturor prietenilor ei!',
    },
  ];

  const features = [
    {
      icon: MessageCircle,
      title: 'Scenariu Personalizat',
      description: 'Moș Crăciun îl strigă pe copilul tău pe nume și transmite mesajul tău într-un mod magic.',
    },
    {
      icon: Video,
      title: 'Calitate Video HD',
      description: 'Video de înaltă calitate care arată uimitor pe orice dispozitiv. Descarcă-l și păstrează-l pentru totdeauna.',
    },
    {
      icon: Clock,
      title: 'Gata în 15 Minute',
      description: 'Ne mândrim cu livrearea rapidă a videoclipului personalizat. Îl primești direct pe email.',
    },
    {
      icon: Heart,
      title: 'Făcut cu Dragoste',
      description: 'Fiecare video este creat pentru a aduce bucurie și uimire în ochii copilului tău.',
    },
    {
      icon: Shield,
      title: 'Sigur și Privat',
      description: 'Datele tale sunt în siguranță. Nu împărtășim niciodată informațiile tale cu terți.',
    },
    {
      icon: Zap,
      title: 'Tehnologie Avansată',
      description: 'Folosim cele mai noi tehnologii pentru a crea videoclipuri naturale și captivante care par autentice.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Spune-ne Despre Copil',
      description: 'Completează numele, vârsta și ce vrei să-i transmită Moșul.',
      icon: '✏️',
    },
    {
      step: 2,
      title: 'Plată Securizată',
      description: 'Checkout rapid cu Stripe. Datele tale sunt mereu protejate.',
      icon: '💳',
    },
    {
      step: 3,
      title: 'Creăm Magia',
      description: 'Echipa noastră creează un video personalizat special pentru copilul tău.',
      icon: '✨',
    },
    {
      step: 4,
      title: 'Primești Videoclipul',
      description: 'Primești link-ul video pe email în aproximativ 15 minute.',
      icon: '🎬',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        <SnowfallBackground />

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🎄</div>
          <div className="absolute top-40 right-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>⭐</div>
          <div className="absolute bottom-40 left-1/4 text-5xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🎁</div>
          <div className="absolute bottom-20 right-1/4 text-4xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🔔</div>
        </div>

        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8"
            >
              <Sparkles className="w-4 h-4 text-christmas-gold" />
              <span className="text-sm font-medium">
                {daysUntilChristmas} {daysUntilChristmas === 1 ? 'zi' : 'zile'} până la Crăciun!
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-christmas"
            >
              Mesaje Video Personalizate de la{' '}
              <span className="text-christmas-gold">Moș Crăciun</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto"
            >
              Creează amintiri de Crăciun de neuitat cu un video magic, în care Moșul vorbește direct cu copilul tău.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/comanda/pas-1">
                <CTAButton
                  size="lg"
                  icon={<Sparkles className="w-5 h-5" />}
                  className="animate-pulse-glow"
                >
                  Creează videoclipul - 89 Lei
                </CTAButton>
              </Link>

              <a href="#demo">
                <CTAButton size="lg" className="!bg-none !bg-transparent !border-2 !border-white !text-white !shadow-none hover:!bg-white/20 hover:!text-white">
                  <Play className="w-5 h-5" />
                  Vezi demo
                </CTAButton>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-christmas-green" />
                <span>50.000+ Familii fericite</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-christmas-gold fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Livrare în 15 Min</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-red-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <MotionFadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-christmas">
              De ce să alegi <span className="text-christmas-red">Mesajul Mosului</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Combinăm tehnologia de ultimă generație cu magia Crăciunului pentru experiențe cu adevărat personalizate.
            </p>
          </MotionFadeIn>

          {/* Desktop: Grid Cards */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>

          {/* Mobile: Benefits List */}
          <MotionFadeIn className="md:hidden max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <ul className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.li
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-christmas-red to-red-600 flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </MotionFadeIn>
        </div>
      </section>

      {/* Santa Banner Section */}
      <section className="relative py-16 md:py-32 overflow-hidden bg-[#1a1a1a]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center md:bg-right bg-no-repeat"
          style={{ backgroundImage: 'url(/santa_banner.png)' }}
        />
        {/* Dark Overlay - stronger on mobile for readability */}
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/70 to-black/50 md:to-transparent" />


        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0,40 C240,100 480,10 720,60 C960,110 1200,20 1440,80 L1440,120 L0,120 Z" fill="white" />
          </svg>
        </div>
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <MotionFadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-christmas-gold/20 backdrop-blur-sm border border-christmas-gold/30 text-christmas-gold mb-4 md:mb-6">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-medium">Magia Crăciunului</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 font-christmas leading-tight">
                Fă-l Pe Copilul Tău Să Creadă Din Nou În Magie
              </h2>
              <p className="text-base md:text-xl text-white/80 mb-6 md:mb-8 leading-relaxed">
                Imaginează-ți chipul copilului tău când Moș Crăciun îi spune pe nume și vorbește despre realizările lui.
              </p>
              <Link href="/comanda/pas-1" className="inline-block">
                <CTAButton icon={<ArrowRight className="w-4 h-4" />}>
                  Creează Videoclipul Acum
                </CTAButton>
              </Link>
            </MotionFadeIn>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0,40 C240,100 480,10 720,60 C960,110 1200,20 1440,80 L1440,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <MotionFadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-christmas">
              Cum funcționează?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creează videoclipul personalizat de la Moș Crăciun în doar 4 pași simpli.
            </p>
          </MotionFadeIn>

          {/* Desktop: Grid Cards */}
          <div className="hidden md:block max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <MotionFadeIn key={item.step} delay={index * 0.1}>
                  <div className="relative text-center">
                    {/* Connector line */}
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-christmas-red to-christmas-gold z-0"
                        style={{ width: 'calc(100% - 3rem)', left: 'calc(50% + 1.5rem)' }} />
                    )}

                    {/* Step number */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-christmas-red to-red-600 
                        flex items-center justify-center text-4xl shadow-lg shadow-red-500/20"
                    >
                      {item.icon}
                    </motion.div>

                    <div className="inline-block px-3 py-1 bg-christmas-gold/10 text-christmas-red font-bold text-sm rounded-full mb-3">
                      Pasul {item.step}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </MotionFadeIn>
              ))}
            </div>
          </div>

          {/* Mobile: Compact List */}
          <MotionFadeIn className="md:hidden max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <ul className="space-y-6">
                {howItWorks.map((item, index) => (
                  <motion.li
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-christmas-red to-red-600 flex items-center justify-center text-2xl shadow-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-christmas-red bg-christmas-gold/10 px-2 py-0.5 rounded-full">
                          Pasul {item.step}
                        </span>
                        <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </MotionFadeIn>

          {/* CTA */}
          <MotionFadeIn className="text-center mt-16">
            <Link href="/comanda/pas-1">
              <CTAButton size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Începe Acum
              </CTAButton>
            </Link>
          </MotionFadeIn>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0,20 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#fef2f2" />
            </svg>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-red-50 to-white relative">
        <div className="container mx-auto px-4">
          <MotionFadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-christmas">
              Vezi Magia în Acțiune
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Urmărește un exemplu de video personalizat de la Moș Crăciun.
            </p>
          </MotionFadeIn>

          <MotionFadeIn className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
              {/* YouTube Video Embed */}
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/eNmMsPIYXcI?rel=0"
                  title="Demo Video Moș Crăciun"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </MotionFadeIn>

          {/* CTA Button */}
          <MotionFadeIn className="text-center mt-12">
            <Link href="/comanda/pas-1">
              <CTAButton size="lg" icon={<Sparkles className="w-5 h-5" />}>
                Creează Propriul Tău Video
              </CTAButton>
            </Link>
          </MotionFadeIn>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0,60 C360,10 720,70 1080,30 C1260,10 1380,40 1440,20 L1440,80 L0,80 Z" fill="#f0fdf4" />
          </svg>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-green-50 to-white relative">
        <div className="container mx-auto px-4">
          <MotionFadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-christmas">
              Iubit de <span className="text-christmas-green">Familii</span> din Toată Lumea
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Alătură-te miilor de părinți fericiți care au făcut Crăciunul de neuitat.
            </p>
          </MotionFadeIn>

          {/* Testimonial Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <MotionFadeIn key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-christmas-gold fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-christmas-red to-red-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              </MotionFadeIn>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0,40 C240,80 720,10 1200,60 L1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pt-0 md:pt-12 pb-24 bg-gradient-to-b from-white to-red-50 relative">
        <div className="container mx-auto px-4">
          <MotionFadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-christmas-red/10 text-christmas-red mb-6">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Ofertă de Sărbători</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-christmas">
              Prețuri Simple și Transparente
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un singur preț, fără costuri ascunse. Creează amintiri magice pentru familia ta.
            </p>
          </MotionFadeIn>

          <div className="max-w-lg mx-auto">
            <PricingBox
              title="Pachetul Magia Crăciunului"
              price={89}
              originalPrice={129}
              isPopular
              features={[
                'Video personalizat de 5-7 minute',
                'Calitate HD (1080p)',
                'Scenariu cu numele copilului',
                'Menționează realizările și preferințele',
                'Livrat în 15 minute',
                'Descărcări și distribuiri nelimitate',
                'Garanție de returnare 30 de zile',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-christmas-red via-red-600 to-christmas-red relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🎄</div>
          <div className="absolute bottom-10 right-10 text-8xl">🎁</div>
          <div className="absolute top-1/2 left-1/4 text-6xl">❄️</div>
          <div className="absolute top-1/4 right-1/4 text-6xl">⭐</div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <MotionFadeIn>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-christmas">
                Fă Acest Crăciun De Neuitat
              </h2>
              <p className="text-xl text-white/80 mb-10">
                Creează un mesaj video personalizat de la Moș Crăciun pe care copilul tău îl va prețui pentru totdeauna.
              </p>
              <Link href="/comanda/pas-1">
                <CTAButton
                  size="lg"
                  className="!bg-transparent !border-2 !border-white !text-white !shadow-none hover:!bg-white/20 hover:!text-white"
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  Creează Videoclipul Acum
                </CTAButton>
              </Link>
            </MotionFadeIn>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute -bottom-px left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto" preserveAspectRatio="none">
            <path d="M0,30 C480,80 960,10 1440,50 L1440,81 L0,81 Z" fill="#111827" />
          </svg>
        </div>
      </section>

      <Footer />
    </>
  );
}
