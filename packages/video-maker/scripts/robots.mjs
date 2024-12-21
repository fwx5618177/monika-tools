import fs from 'fs';

export const generateRobots = async (path) => {
  const content = `
User-agent: *
Disallow: /admin
Allow: /
Sitemap: https://my-telegram-miniapp.com/sitemap.xml
`;

  fs.writeFileSync(path, content);
  console.log('Robots.txt successfully generated!');
};
