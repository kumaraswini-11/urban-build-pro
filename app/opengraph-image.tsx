import { ImageResponse } from "next/og";

export const alt = "UrbanBuild — General contracting and architecture";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social preview card (was the 231x48 logo declared as 1200x630, C2).
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#121315",
        color: "#ffffff",
        borderBottom: "24px solid #FFC221",
      }}
    >
      <div style={{ display: "flex", fontSize: 88, fontWeight: 800 }}>
        URBAN<span style={{ color: "#FFC221" }}>BUILD</span>
      </div>
      <div style={{ marginTop: 24, fontSize: 40, opacity: 0.8 }}>
        Building robust, lasting solutions
      </div>
    </div>,
    size,
  );
}
