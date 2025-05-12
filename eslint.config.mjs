import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(['**/dist/', 'webpack.config.js']),
  { files: ["**/*.{ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "error",
      semi: ["error", "always"],
    }
  }
]);