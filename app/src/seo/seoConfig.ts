export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  hreflang?: { lang: string; url: string }[]; // 新增 hreflang 配置
  customMetaTags?: { name: string; content: string }[];
}

export type Lang = 'en' | 'es' | 'zh';
export type PageKey = 'common' | 'home' | 'about';

export const defaultSeoConfig: Record<
  Lang,
  Partial<Record<PageKey, SeoConfig>>
> = {
  en: {
    common: {
      title: 'common',
      description: 'This is the default description of Monika Tools.',
      keywords: 'default, keywords, Monika Tools',
      ogTitle: 'Monika Tools',
      ogDescription:
        'This is the default Open Graph description of Monika Tools.',
      ogImage: '/default-og-image.png',
      twitterTitle: 'Monika Tools',
      twitterDescription:
        'This is the default Twitter description of Monika Tools.',
      twitterImage: '/default-twitter-image.png',
      hreflang: [
        { lang: 'en', url: 'https://example.com/en/' },
        { lang: 'es', url: 'https://example.com/es/' },
        { lang: 'fr', url: 'https://example.com/fr/' },
      ],
    },
    home: {
      title: 'Monika Tools',
      description: 'This is the default description of Monika Tools.',
      keywords: 'default, keywords, Monika Tools',
      ogTitle: 'Monika Tools',
      ogDescription:
        'This is the default Open Graph description of Monika Tools.',
      ogImage: '/default-og-image.png',
      twitterTitle: 'Monika Tools',
      twitterDescription:
        'This is the default Twitter description of Monika Tools.',
      twitterImage: '/default-twitter-image.png',
      hreflang: [
        { lang: 'en', url: 'https://example.com/en/' },
        { lang: 'es', url: 'https://example.com/es/' },
        { lang: 'fr', url: 'https://example.com/fr/' },
      ],
    },
  },
  es: {
    common: {
      title: 'Mi Aplicación',
      description: 'Esta es la descripción predeterminada de Mi Aplicación.',
      keywords: 'predeterminado, palabras clave, mi aplicación',
      ogTitle: 'Mi Aplicación',
      ogDescription:
        'Esta es la descripción predeterminada de Open Graph de Mi Aplicación.',
      ogImage: '/default-og-image.png',
      twitterTitle: 'Mi Aplicación',
      twitterDescription:
        'Esta es la descripción predeterminada de Twitter de Mi Aplicación.',
      twitterImage: '/default-twitter-image.png',
      hreflang: [
        { lang: 'en', url: 'https://example.com/en/' },
        { lang: 'es', url: 'https://example.com/es/' },
        { lang: 'fr', url: 'https://example.com/fr/' },
      ],
    },
    home: {
      title: 'Mi Aplicación',
      description: 'Esta es la descripción predeterminada de Mi Aplicación.',
      keywords: 'predeterminado, palabras clave, mi aplicación',
      ogTitle: 'Mi Aplicación',
      ogDescription:
        'Esta es la descripción predeterminada de Open Graph de Mi Aplicación.',
      ogImage: '/default-og-image.png',
      twitterTitle: 'Mi Aplicación',
      twitterDescription:
        'Esta es la descripción predeterminada de Twitter de Mi Aplicación.',
      twitterImage: '/default-twitter-image.png',
      hreflang: [
        { lang: 'en', url: 'https://example.com/en/' },
        { lang: 'es', url: 'https://example.com/es/' },
        { lang: 'fr', url: 'https://example.com/fr/' },
      ],
    },
  },
  zh: {
    common: {
      title: '我的应用',
      description: '这是我的应用的默认描述。',
      keywords: '默认，关键词，我的应用',
      ogTitle: '我的应用',
      ogDescription: '这是我的应用的默认 Open Graph 描述。',
      ogImage: '/default-og-image.png',
      twitterTitle: '我的应用',
      twitterDescription: '这是我的应用的默认 Twitter 描述。',
      twitterImage: '/default-twitter-image.png',
      hreflang: [
        { lang: 'en', url: 'https://example.com/en/' },
        { lang: 'es', url: 'https://example.com/es/' },
        { lang: 'fr', url: 'https://example.com/fr/' },
      ],
    },
    home: {
      title: '我的应用',
      description: '这是我的应用的默认描述。',
      keywords: '默认，关键词，我的应用',
      ogTitle: '我的应用',
      ogDescription: '这是我的应用的默认 Open Graph 描述。',
      ogImage: '/default-og-image.png',
      twitterTitle: '我的应用',
      twitterDescription: '这是我的应用的默认 Twitter 描述。',
      twitterImage: '/default-twitter-image.png',
      hreflang: [
        { lang: 'en', url: 'https://example.com/en/' },
        { lang: 'es', url: 'https://example.com/es/' },
        { lang: 'fr', url: 'https://example.com/fr/' },
      ],
    },
  },
};
