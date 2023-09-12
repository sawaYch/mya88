/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["i.ytimg.com"],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [
      "puppeteer-extra",
      "puppeteer-extra-plugin-stealth",
    ],
  },
};

module.exports = nextConfig;
