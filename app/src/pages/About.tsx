import { useSeo } from '@seo/useSeo';

const AboutPage = () => {
  const SeoComponent = useSeo('about');

  return (
    <div>
      {SeoComponent}
      <h1>About Page</h1>
    </div>
  );
};

export default AboutPage;
