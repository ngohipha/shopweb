/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/index.html"],
  theme: {
    fontFamily: {
      main: ["Poppins", "sans-serif"],
    },
    extend: {
      width: {
        main: "1220px",
      },
      backgroundColor: {
        main: "#ee3131",
        overlay: "rgba(0,0,0,0.7)",
      },
      colors: {
        main: "#ee3131",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
        6: "6 6 0%",
        7: "7 7 0%",
        8: "8 8 0%",
      },
      keyframes: {
        "slide-top": {
          "0%": {
            " -webkit-transform": "translateY(20px);",
            transform: "translateY(20px);",
          },
          "100%": {
            "  -webkit-transform": "translateY(0px);",
            transform: " translateY(0px);",
          },
        },
        "slide-top-sm": {
          "0%": {
            " -webkit-transform": "translateY(8px);",
            transform: "translateY(8px);",
          },
          "100%": {
            "  -webkit-transform": "translateY(0px);",
            transform: " translateY(0px);",
          },
        },
        "shadow-pop-tr": {
          "0%": {
            "-webkit-box-shadow":
              "0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e",
            "box-shadow":
              "0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e",
            "-webkit-transform": "translateX(0) translateY(0)",
            transform: "translateX(0) translateY(0)",
          },
          "100%": {
            "-webkit-box-shadow":
              "1px -1px #3e3e3e, 2px -2px #3e3e3e, 3px -3px #3e3e3e, 4px -4px #3e3e3e, 5px -5px #3e3e3e, 6px -6px #3e3e3e, 7px -7px #3e3e3e, 8px -8px #3e3e3e",
            "box-shadow":
              "1px -1px #3e3e3e, 2px -2px #3e3e3e, 3px -3px #3e3e3e, 4px -4px #3e3e3e, 5px -5px #3e3e3e, 6px -6px #3e3e3e, 7px -7px #3e3e3e, 8px -8px #3e3e3e",
            "-webkit-transform": "translateX(-8px) translateY(8px)",
            transform: "translateX(-8px) translateY(8px)",
          },
        },
      },
      animation: {
        "slide-top":
          "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
        "slide-top-sm": "slide-top-sm 0.2s linear both;",
        "shadow-pop-tr": "shadow-pop-tr 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-line-clamp")],
};
