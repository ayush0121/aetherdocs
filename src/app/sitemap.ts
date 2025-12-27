import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Update this to your production domain
    const baseUrl = 'https://aetherdocs-mu.vercel.app';

    // List of all static routes
    const routes = [
        '',
        '/merge-pdf',
        '/split-pdf',
        '/compress-pdf',
        '/pdf-to-jpg',
        '/jpg-to-pdf',
        '/rotate-pdf',
        '/watermark-pdf',
        '/protect-pdf',
        '/unlock-pdf',
        '/sign-pdf',
        '/redact-pdf',
        '/chat-pdf',
        '/p2p-share',
        '/pdf-to-word',
        '/word-to-pdf',
        '/pdf-to-powerpoint',
        '/powerpoint-to-pdf',
        '/pdf-to-excel',
        '/excel-to-pdf',
        '/edit-pdf',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
