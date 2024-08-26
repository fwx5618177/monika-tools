import { useSeo } from '@seo/useSeo';
import './about.module.scss';

const AboutPage = () => {
  const SeoComponent = useSeo('about');

  return (
    <div className="about-page">
      {SeoComponent}
      <section className="hero-section">
        <div className="hero-content">
          <div className="tagline">About Acme</div>
          <h1 className="hero-title">Empowering Individuals to Thrive</h1>
          <p className="hero-description">
            At Acme, our mission is to provide innovative tools and resources
            that help individuals unlock their full potential. We believe in the
            power of technology to drive personal growth, productivity, and
            success.
          </p>
        </div>
        <div className="hero-image">
          <img src="/placeholder.svg" alt="About" />
        </div>
      </section>
      <section className="section blog-section">
        <div className="section-image">
          <img src="/placeholder.svg" alt="Blog" />
        </div>
        <div className="section-content">
          <div className="section-tagline">Our Blog</div>
          <h2 className="section-title">Insights and Inspiration</h2>
          <p className="section-description">
            Explore our blog for the latest insights, tips, and inspiration to
            help you grow, learn, and thrive. From productivity hacks to
            personal development, we've got you covered.
          </p>
          <a href="#" className="section-link">
            Read the Blog
          </a>
        </div>
      </section>
      <section className="section tools-section">
        <div className="section-content">
          <div className="section-tagline">Our Tools</div>
          <h2 className="section-title">Unlock Your Potential</h2>
          <p className="section-description">
            Explore our suite of powerful tools designed to help you streamline
            your workflow, boost your productivity, and achieve your goals. From
            task management to personal finance, we've got the tools you need to
            succeed.
          </p>
          <a href="#" className="section-link">
            Explore Our Tools
          </a>
        </div>
        <div className="section-image">
          <img src="/placeholder.svg" alt="Tools" />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
