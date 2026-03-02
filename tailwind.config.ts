import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // The site uses a clean Sans-Serif, Poppins works well.
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",

        /* ========== Zekorn Brand Palette ========== */
        brand: {
          // The vibrant brand pink/red seen in CTA buttons and stats section
          red: "#D8345F",
          // The dark background used in the hero and dark panels
          dark: "#111111",
          // The mint green seen in the cart icon
          mint: "#29C482",
        },

        background: "#F9F9F9", // Light gray page background
        surface: "#F5F5F5", // Light surface for product cards/placeholders
        panel: "#111111", // Dark hero overlay/panel background

        primary: {
          50: "#FFF1F3", // Light pink background used in promo section
          100: "#FFE2E7",
          200: "#FFC9D4",
          300: "#F896AA",
          400: "#EF6382",
          500: "#D8345F", // Main Brand Pink/Red
          600: "#BC224C",
          700: "#9E1A3D",
          800: "#841835",
          900: "#6E172F",
          DEFAULT: "#D8345F",
          foreground: "#FFFFFF",
        },

        // Refined Grays for text and UI elements
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#111111",
        },

        success: {
          DEFAULT: "#29C482",
          foreground: "#FFFFFF",
        },

        accent: "#D8345F",
        price: "#111111",
        whatsapp: "#25D366",
      },

      animation: {
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
    screens: {
      xs: "400px",
      xmd: "800px",
      slg: "999px",
      ...require("tailwindcss/defaultTheme").screens,
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#E83E44",
              foreground: "#FFFFFF",
            },
            focus: "#E83E44",
          },
        },
      },
    }),
  ],
};
export default config;
