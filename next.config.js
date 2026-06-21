// Set NEXT_PUBLIC_BASE_PATH if this gets deployed under a sub-path
// (e.g. a GitHub Pages project site or a /chromatic-linen path off beaconlaundry.com.au).
// Leave it blank for a root domain or subdomain deployment.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
