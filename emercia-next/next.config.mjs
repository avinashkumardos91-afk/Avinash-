/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // allow product imagery from a Medusa backend / CDN once configured
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
