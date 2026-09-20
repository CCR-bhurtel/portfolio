import { ImageResponse } from "next/og";
import { MARK_PATH } from "@/components/mark";
import { focusAreas, site } from "@/lib/content";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0B0D0E",
          color: "#F7F7F4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg viewBox="0 0 96 96" width="56" height="56">
            <path d={MARK_PATH} fill="#F7F7F4" />
            <rect x="64" y="42" width="14" height="12" fill="#2F6BFF" />
          </svg>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#A9ACA8",
            }}
          >
            <div style={{ width: 12, height: 12, background: "#2F6BFF" }} />
            AI engineer · Full-stack developer
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 92,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            I build AI systems and products that ship.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 36,
            paddingTop: 28,
            borderTop: "2px solid rgba(247,247,244,.16)",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#A9ACA8",
          }}
        >
          {focusAreas.map((area) => (
            <div key={area}>{area}</div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
