/** @type {import('next').NextConfig} */
const nextConfig = {
  // Externalize pdf-parse and pdfjs-dist to avoid webpack bundling issues
  serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pdf-parse for server-side only
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'pdfjs-dist': 'commonjs pdfjs-dist',
      });
    }
    return config;
  },
}

module.exports = nextConfig

