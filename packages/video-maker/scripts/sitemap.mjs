import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

export const generateSitemap = async (path) => {
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/home', changefreq: 'monthly', priority: 0.8 },
  ];

  const writeStream = createWriteStream(path);

  const stream = new SitemapStream({
    hostname: 'https://xxx.com',
  });

  links.forEach((link) => stream.write(link));
  stream.end();

  streamToPromise(stream)
    .then((data) => {
      writeStream.write(data.toString());
      console.log('Sitemap successfully generated!');
    })
    .catch((err) => {
      console.error('Error generating sitemap:', err);
    });
};
