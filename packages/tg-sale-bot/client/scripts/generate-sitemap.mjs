import { resolve, dirname } from "path";
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/home", changefreq: "monthly", priority: 0.8 },
];

const path = resolve(__dirname, "..", "..", "dist/sitemap.xml");
const writeStream = createWriteStream(path);

const stream = new SitemapStream({
  hostname: "https://bot.aisim.top/",
});

links.forEach((link) => stream.write(link));
stream.end();

streamToPromise(stream)
  .then((data) => {
    writeStream.write(data.toString());
    console.log("Sitemap successfully generated!");
  })
  .catch((err) => {
    console.error("Error generating sitemap:", err);
  });
