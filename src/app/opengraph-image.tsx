import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Les Clefs de l'Immo - Gestion de patrimoine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const blasonData = await readFile(
    join(process.cwd(), "public/images/lesclefs-blason.png"),
    "base64"
  );
  const blasonSrc = `data:image/png;base64,${blasonData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires <img> */}
        <img
          src={blasonSrc}
          alt=""
          width={160}
          height={200}
          style={{ objectFit: "contain", marginBottom: 24 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#1e293b",
              letterSpacing: "-0.02em",
            }}
          >
            Les Clefs de l&apos;Immo
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "#64748b",
            }}
          >
            Gestion de patrimoine
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
