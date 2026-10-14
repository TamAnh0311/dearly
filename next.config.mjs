/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  compress: true,
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{ kebabCase member }}",
    },
  },
};

export default nextConfig;
