import { Lang } from '@seo/seoConfig';
import { useSeo } from '@seo/useSeo';
import { useParams } from 'react-router-dom';

const HomePage = () => {
  const { lang } = useParams<{ lang: Lang }>();
  const SeoComponent = useSeo('home', lang);

  return (
    <div>
      {SeoComponent}
      <h1>Welcome to the Home Page122444...</h1>
    </div>
  );
};

export default HomePage;
