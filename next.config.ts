import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:lang(vi|en)/research",
        destination: "/:lang/activities/research",
        permanent: true,
      },
      {
        source: "/:lang(vi|en)/research/:slug",
        destination: "/:lang/activities/research/:slug",
        permanent: true,
      },
      {
        source: "/:lang(vi|en)/team",
        destination: "/:lang/about/team",
        permanent: true,
      },
      {
        source: "/:lang(vi|en)/about/social-media-vietnam",
        destination: "/:lang/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
