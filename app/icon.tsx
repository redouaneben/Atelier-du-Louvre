import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { theme } from "@/config/theme";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const initial = siteConfig.name.trim().charAt(0).toUpperCase() || "M";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.colors.brand,
          color: theme.colors.paper,
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          borderRadius: 8,
        }}
      >
        {initial}
      </div>
    ),
    { ...size }
  );
}
