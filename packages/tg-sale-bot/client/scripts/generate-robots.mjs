import fs from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// 获取当前模块的目录名
const __dirname = dirname(fileURLToPath(import.meta.url));

const content = `
User-agent: *
Disallow: /
Allow: /
Sitemap: https://bot.aisim.top/sitemap.xml
`;

const path = resolve(__dirname, "..", "..", "dist/robots.txt");
fs.writeFileSync(path, content);
console.log("Robots.txt successfully generated!");
