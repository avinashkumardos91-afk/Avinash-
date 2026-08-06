import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // neon.tech-inspired: near-black grounds, electric green → teal accent
        bg: "#08090a",
        bg2: "#0e1113",
        surface: "rgba(255,255,255,0.035)",
        surface2: "rgba(255,255,255,0.06)",
        line: "rgba(255,255,255,0.09)",
        line2: "rgba(0,229,153,0.28)",
        ink: "#ecfdf5",
        dim: "#8b9a95",
        faint: "#5c6a66",
        violet: "#00e599", // accent 1 (neon green)
        cyan: "#22d3ee", // accent 2 (teal)
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
