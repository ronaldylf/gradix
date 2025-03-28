import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@interfaces": path.resolve(__dirname, "./src/interfaces"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    }
  },
})
