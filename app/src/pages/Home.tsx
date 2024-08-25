import { useSeo } from '@seo/useSeo';

const HomePage = () => {
  const SeoComponent = useSeo('home');

  return (
    <div>
      {SeoComponent}
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

export default HomePage;
