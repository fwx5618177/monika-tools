import Seo from './Seo';
import { defaultSeoConfig, Lang, PageKey, SeoConfig } from './seoConfig';

export const useSeo = (pageKey: PageKey = 'common', lang: Lang = 'en') => {
  const seoConfig = defaultSeoConfig[lang][pageKey] as SeoConfig;

  return <Seo pageKey={pageKey} config={seoConfig} lang={lang} />;
};
