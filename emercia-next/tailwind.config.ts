import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: "#0c0a09",
        noir2: "#131010",
        panel: "#1a1512",
        panel2: "#221a16",
        ivory: "#f5efe6",
        ivoryDim: "#cabfb0",
        muted: "#a99b88",
        gold: "#c9a54e",
        goldBright: "#e6cd8b",
        amber: "#b5763a",
        rose: "#b8798a",
        line: "rgba(201, 165, 78, 0.20)",
        "line-soft": "rgba(245, 239, 230, 0.08)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lux: "0 30px 80px rgba(0, 0, 0, 0.6)",
      },
      letterSpacing: {
        luxe: "0.24em",
        wide2: "0.42em",
      },
    },
  },
  plugins: [],
};

export default config;
