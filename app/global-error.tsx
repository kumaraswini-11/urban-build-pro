"use client"; // Error boundaries must be Client Components

// Replaces the root layout when it crashes, so globals.css is not available:
// keep the styling inline and minimal.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#ffffff",
          color: "#121315",
        }}
      >
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 32, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ margin: "0 0 24px", color: "#55565c" }}>
            Please try again. If the problem continues, call or email us.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "14px 28px",
              border: 0,
              background: "#FFC221",
              color: "#121315",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
