/**
 * Web app manifest — lets guests add Dearly to their home screen and gives
 * browsers a proper name, colour and icon.
 */

import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7F0",
    theme_color: "#B8860B",
    icons: [{ src: "/logo.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" }],
  };
}
