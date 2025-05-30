import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: "public", // Default: "public"

  server: {
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
