import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: ["0.846rem", { lineHeight: "1.15rem" }],
      sm: ["0.923rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      md: ["1.077rem", { lineHeight: "1.5rem" }],
      lg: ["1.231rem", { lineHeight: "1.75rem" }],
      xl: ["1.462rem", { lineHeight: "2rem" }],
      "2xl": ["1.846rem", { lineHeight: "2.25rem" }],
      "3xl": ["2.154rem", { lineHeight: "2.5rem" }],
      "4xl": ["2.462rem", { lineHeight: "2.75rem" }],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        brand: { DEFAULT: "#FEB604", primary: "#FEB604" },
      },
      fontFamily: {
        rethink: ["var(--font-rethink)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        raleway: ["var(--font-raleway)", "sans-serif"],
        motterdam: ["var(--font-motterdam)", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
