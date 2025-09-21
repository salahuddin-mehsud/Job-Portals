import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",               // custom build output dir
    chunkSizeWarningLimit: 2000,   // optional performance tweak
  },
  plugins: [
    tsconfigPaths(),   // keep TypeScript path alias support
    react(),           // React plugin
    tagger(),          // DhiWise component tagger
    tailwindcss(),     // NEW Tailwind plugin
  ],
  server: {
    port: "4028",                     // custom port
    host: "0.0.0.0",                  // expose server on LAN
    strictPort: true,                 // prevent auto-port change
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'], // custom domains
  },
});
