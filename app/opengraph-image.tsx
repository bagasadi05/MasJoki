import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "Mas Joki — Bantuan Tugas Kuliah Transparan";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const imagePath = path.join(process.cwd(), "public", "mas-joki.jpg");
  const imageData = fs.readFileSync(imagePath);
  const imageBase64 = `data:image/jpeg;base64,${imageData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fbf9f4",
          padding: "60px 80px",
          border: "16px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "680px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                backgroundColor: "#2563EB",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "9999px",
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              HARGA TRANSPARAN DI AWAL
            </span>
          </div>

          {/* Teks Besar Sesuai Permintaan */}
          <h1
            style={{
              fontSize: "50px",
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Tugas Beres, Harga Kelihatan di Awal
          </h1>

          {/* Teks Kecil Sesuai Permintaan */}
          <p
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#475569",
              marginTop: "20px",
              lineHeight: 1.4,
            }}
          >
            masjoki — parafrase, makalah, PPT, artikel jurnal, Turnitin
          </p>

          {/* Trust bullet footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "32px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#059669",
            }}
          >
            <span>Dikerjakan langsung tanpa perantara</span>
            <span>|</span>
            <span>DP 50% dulu</span>
          </div>
        </div>

        {/* Mascot Avatar Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "36px",
            border: "3px solid #cbd5e1",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageBase64}
            alt="Mas Joki"
            style={{
              width: "280px",
              height: "280px",
              borderRadius: "28px",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              marginTop: "16px",
              fontSize: "22px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Mas Joki
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            masjoki.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
