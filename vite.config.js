import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import replace from "@rollup/plugin-replace";
import eslint from "vite-plugin-eslint";
import { resolve } from "path";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      eslint({ fix: true }),
      replace({
        preventAssignment: false,
        // 通过静态打包的方式来排除不需要的文件
        // 因为动态打包会将所有的依赖都打包到一起
        "import.meta.env.MODE": `"${mode}"`,
        "import.meta.env.BUILD": `"${pkg.version}|${Math.floor(Date.now() / 1000)}"`,
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
