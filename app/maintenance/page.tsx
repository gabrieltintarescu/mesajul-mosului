'use client';

import { siteConfig } from '@/lib/config';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-green-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Santa Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full">
                        <span className="text-6xl">🎅</span>
                    </div>
                </div>

                {/* Main Message */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Site în Mentenanță
                </h1>

                <p className="text-xl text-white/90 mb-6">
                    Moș Crăciun lucrează la câteva îmbunătățiri magice! 🎄✨
                </p>

                <p className="text-white/70 mb-8">
                    Ne pare rău pentru neplăceri. Site-ul va fi disponibil în curând.
                    <br />
                    Vă mulțumim pentru răbdare!
                </p>

                {/* Contact Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <p className="text-white/80 mb-4">
                        Pentru întrebări urgente, ne puteți contacta:
                    </p>
                    <div className="space-y-2">
                        <a
                            href={`mailto:${siteConfig.contact.email}`}
                            className="block text-white hover:text-yellow-300 transition-colors"
                        >
                            📧 {siteConfig.contact.email}
                        </a>
                        <a
                            href={`tel:${siteConfig.contact.phoneInternational}`}
                            className="block text-white hover:text-yellow-300 transition-colors"
                        >
                            📞 {siteConfig.contact.phone}
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-white/50 text-sm">
                    © {new Date().getFullYear()} {siteConfig.brand.name}
                </p>
            </div>

            {/* Decorative snowflakes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-white/20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        ❄
                    </div>
                ))}
            </div>
        </div>
    );
}
