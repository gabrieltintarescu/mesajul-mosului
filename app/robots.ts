import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://mesajul-mosului.ro';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/status-comanda/',
                    '/comanda/pas-2',
                    '/comanda/pas-3',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
