import Seo from './Seo';
import { defaultSeoConfig, Lang, PageKey, SeoConfig } from './seoConfig';
import { useParams } from 'react-router-dom';

export const useSeo = (pageKey: PageKey = 'common') => {
  const { lang = 'en' } = useParams<{ lang: Lang }>();
  const seoConfig = (defaultSeoConfig[lang][pageKey] ||
    defaultSeoConfig['en']['common']) as SeoConfig;

  return <Seo pageKey={pageKey} config={seoConfig} lang={lang} />;
};
