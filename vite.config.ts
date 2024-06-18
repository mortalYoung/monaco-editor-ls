import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { MagicRegExpTransformPlugin } from "magic-regexp/transform";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), MagicRegExpTransformPlugin.vite()],
});
