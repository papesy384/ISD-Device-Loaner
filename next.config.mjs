import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Run `npm run dev` from the ISD-Device-Loaner directory so process.cwd() is the project root
const projectRoot = path.resolve(process.cwd());

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.modules = [
      path.join(projectRoot, "node_modules"),
      ...(config.resolve.modules || []),
    ];
    return config;
  },
  experimental: {
    optimizePackageImports: ["next-intl", "html5-qrcode"],
  },
};

export default withNextIntl(nextConfig);
