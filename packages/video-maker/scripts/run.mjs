#!/bin/env node

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { generateRobots } from './robots.mjs';
import { generateSitemap } from './sitemap.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = resolve(__dirname, '..', '..', 'dist/sitemap.xml');

generateSitemap(path);
generateRobots(path);
