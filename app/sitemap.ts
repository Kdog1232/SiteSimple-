import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/privacy", "/terms"];

  return paths.map((path): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "yearly",
    priority: path === "" ? 1 : 0.3,
  }));
}
