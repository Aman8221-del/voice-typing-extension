import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/Content.js"),
        background: resolve(__dirname, "src/background.js"),
      },
      output: {
        // The manifest references content.js/background.js by name, so those
        // entries must not be hashed.
        entryFileNames: (chunk) =>
          ["content", "background"].includes(chunk.name)
            ? "[name].js"
            : "assets/[name]-[hash].js",
      },
    },
  },
});
