import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: "public", // Default: "public"

  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "certs/_wildcard.kuchmambetov.dev+3-key.pem")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "certs/_wildcard.kuchmambetov.dev+3.pem")
      ),
    },
    allowedHosts: ["food_helper.kuchmambetov.dev"],
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    copyPublicDir: true, // Default: true
  },
});
