/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        sky: {
          light: "#B0E0E6",
          DEFAULT: "#87CEEB",
          dark: "#5F9EA0",
        },
        grass: {
          light: "#98FB98",
          DEFAULT: "#90EE90",
          dark: "#3CB371",
        },
        sakura: {
          light: "#FFC0CB",
          DEFAULT: "#FFB6C1",
          dark: "#FF69B4",
        },
        lemon: {
          light: "#FFFACD",
          DEFAULT: "#FFFACD",
          dark: "#F0E68C",
        },
        lavender: {
          light: "#E6E6FA",
          DEFAULT: "#D8BFD8",
          dark: "#9370DB",
        },
        peach: {
          light: "#FFE4B5",
          DEFAULT: "#FFDAB9",
          dark: "#FFA07A",
        },
        mint: {
          light: "#98FB98",
          DEFAULT: "#98FB98",
          dark: "#3CB371",
        },
        island: {
          sand: "#F5DEB3",
          water: "#87CEEB",
        },
      },
      fontFamily: {
        cute: ['"Comic Sans MS"', '"Marker Felt"', '"Chalkboard SE"', "cursive"],
        rounded: ['"Hiragino Maru Gothic ProN"', '"Yu Gothic"', "sans-serif"],
      },
      animation: {
        "breathing": "breathing 3s ease-in-out infinite",
        "breathing-slow": "breathing 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "walking": "walking 0.6s ease-in-out infinite",
        "blink": "blink 4s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 0.5s ease-out",
        "float-up": "float-up 2s ease-out forwards",
        "cloud-drift": "cloud-drift 60s linear infinite",
        "cloud-drift-slow": "cloud-drift 90s linear infinite",
        "sway": "sway 4s ease-in-out infinite",
        "sway-slow": "sway 6s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "pop-in": "pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "shake": "shake 0.5s ease-in-out",
        "sleepy": "sleepy 2s ease-in-out infinite",
        "ripple": "ripple 3s ease-in-out infinite",
      },
      keyframes: {
        breathing: {
          "0%, 100%": { transform: "scale(1) translateY(0)" },
          "50%": { transform: "scale(1.02) translateY(-3px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        walking: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-5px) rotate(2deg)" },
        },
        blink: {
          "0%, 45%, 55%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.1)" },
        },
        "bounce-gentle": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.1)" },
          "50%": { transform: "scale(0.95)" },
          "70%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-80px) scale(0.5)", opacity: "0" },
        },
        "cloud-drift": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(10deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        sleepy: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-2px) rotate(2deg)" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
