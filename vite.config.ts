
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", 
  server: {
    host: "0.0.0.0",     // Ensures the server is accessible externally
    port: 8080,          // Port configured to 8080
    strictPort: true,    // Forces the use of this specific port
    open: true,          // Opens the browser automatically
  },
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    process.env.NODE_ENV !== 'production' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Explicitly set the entry point
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
});
