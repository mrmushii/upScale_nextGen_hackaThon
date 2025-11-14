/** @type {import('next').NextConfig} */
const nextConfig = {
  // Externalize pdf-parse and pdfjs-dist to avoid webpack bundling issues
  serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  
  // Image configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img-c.udemycdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'udemycdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.udemycdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pdf-parse for server-side only
      // Use a function to properly handle the externalization
      config.externals = config.externals || [];
      
      // Add pdf-parse as external - this prevents webpack from bundling it
      const originalExternals = config.externals;
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        ({ request }, callback) => {
          if (request === 'pdf-parse' || request === 'pdfjs-dist') {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];
    }
    return config;
  },
}

module.exports = nextConfig

