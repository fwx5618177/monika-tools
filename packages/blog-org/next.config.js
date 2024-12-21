/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(frag|vert)$/,
      type: "asset/source",
    });

    return config;
  },
};

module.exports = nextConfig;
