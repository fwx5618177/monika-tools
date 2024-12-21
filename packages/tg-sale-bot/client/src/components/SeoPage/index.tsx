import React from "react";
import { Helmet } from "react-helmet-async";

interface SeoPageProps {
  title: string;
  description: string;
  keywords: string;
  imageUrl: string;
  url?: string;
}

const SeoPage: React.FC<SeoPageProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  url,
}) => {
  const pageUrl = url || window.location.href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SeoPage;
