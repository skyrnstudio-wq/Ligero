import { ImageResponse } from "next/og";

export const alt = "Ligero Parfum, Independent Indian Perfume House";
export const size = {
  width: 1200,
  height: 630,
};
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
          padding: "64px 76px",
          background: "linear-gradient(135deg, #1c140e 0%, #261b13 55%, #16100b 100%)",
          color: "#f3ede3",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(216, 159, 104, 0.28)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#d89f68",
            fontFamily: "sans-serif",
          }}
        >
          <span>Mumbai, India</span>
          <span>Eau de Parfum · 50 ml</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 400,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              lineHeight: 1.0,
              color: "#fbf8f2",
            }}
          >
            LIGÉRO PARFUM
          </div>
          <div
            style={{
              fontSize: 32,
              fontStyle: "italic",
              fontWeight: 300,
              color: "#e6ddd0",
              maxWidth: 860,
              lineHeight: 1.35,
            }}
          >
            Seven permanent Eau de Parfum creations formulated in small batches with pure botanical extracts and resins.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(243, 237, 227, 0.16)",
            paddingTop: 22,
            fontSize: 16,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#b09f8f",
            fontFamily: "sans-serif",
          }}
        >
          <span>Aubé · Fleur · Ambre Doux · Noctis · Blanc · Marée · Noir Cacao</span>
          <span style={{ color: "#d89f68" }}>ligeroparfum.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
