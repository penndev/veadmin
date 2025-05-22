import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import replace from "@rollup/plugin-replace";
import eslint from "vite-plugin-eslint";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      eslint({ fix: true }),
      replace({
        preventAssignment: false,
        "import.meta.env.MODE": JSON.stringify(mode),
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        path: "path-browserify",
      },
    },
    envPrefix: ["VITE", "VE"],
    base: "",
  };
});
