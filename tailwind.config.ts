import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nexivo: {
          black: "#0A0A0A",
          ink: "#111827",
          blue: "#1D4ED8",
          "blue-dark": "#0B2A7A",
          "blue-light": "#3B82F6",
          red: "#DC2626",
          "red-dark": "#991B1B",
          "red-light": "#F87171",
          gray: "#6B7280",
          surface: "#F8FAFC",
          border: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.1)",
        pop: "0 10px 30px rgba(10,10,10,0.12)",
      },
      backgroundImage: {
        "nexivo-stripe":
          "linear-gradient(90deg, #1D4ED8 0%, #1D4ED8 50%, #DC2626 50%, #DC2626 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
