import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginVue.configs["flat/essential"],
  eslintPluginPrettierRecommended, // prettier 风格控制
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);
