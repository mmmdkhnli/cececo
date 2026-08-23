"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0b1220",
          color: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, color: "#a3a3a3", fontSize: 15, lineHeight: 1.5 }}>
            The application hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 24,
              borderRadius: 8,
              border: "none",
              background: "#22c55e",
              color: "#0b1220",
              fontWeight: 600,
              fontSize: 14,
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
