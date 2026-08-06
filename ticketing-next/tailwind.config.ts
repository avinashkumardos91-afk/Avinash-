import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080910",
        bg2: "#0d0f1a",
        surface: "rgba(255,255,255,0.04)",
        surface2: "rgba(255,255,255,0.07)",
        line: "rgba(255,255,255,0.10)",
        line2: "rgba(255,255,255,0.18)",
        ink: "#eef1fb",
        dim: "#9aa3c4",
        faint: "#6b7395",
        violet: "#8b7bff",
        cyan: "#3fe0d0",
        urgent: "#ff5c72",
        high: "#ffab5e",
        normal: "#6ea8fe",
        low: "#7f89a8",
        ok: "#3fe0a0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: { lux: "0 24px 60px rgba(0,0,0,0.5)" },
    },
  },
  plugins: [],
};
export default config;
