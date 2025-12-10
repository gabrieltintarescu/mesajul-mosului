/**
 * Configurație centralizată pentru informații de contact și alte setări frontend
 * Modifică aici pentru a actualiza rapid pe tot site-ul
 */

export const siteConfig = {
    // Informații de contact
    contact: {
        email: 'contact@mesajul-mosului.ro',
        phone: '0751 954 687',
        phoneInternational: '+40751954687',
        whatsapp: '40751954687', // fără + pentru link wa.me
    },

    // Social media
    social: {
        facebook: 'https://facebook.com/mesajdelamosu',
        instagram: 'https://instagram.com/mesajdelamosu',
        tiktok: 'https://tiktok.com/@mesajdelamosu',
    },

    // Program de lucru
    workingHours: {
        weekdays: '9:00 - 18:00',
        saturday: '10:00 - 14:00',
        sunday: 'Închis',
    },

    // Nume brand
    brand: {
        name: 'Mesajul Moșului',
        tagline: 'Mesaje video personalizate de la Moș Crăciun',
    },
};

// Helper pentru link-uri
export const getContactLinks = () => ({
    emailLink: `mailto:${siteConfig.contact.email}`,
    phoneLink: `tel:${siteConfig.contact.phoneInternational}`,
    whatsappLink: `https://wa.me/${siteConfig.contact.whatsapp}`,
});
