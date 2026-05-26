import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*?*utm_", "/*?*gclid"],
      },
    ],
    sitemap: "https://omodajaecoo.com.uy/sitemap.xml",
    host: "https://omodajaecoo.com.uy",
  };
}
