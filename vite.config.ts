
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", 
  server: {
    port: 8080,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    // Enable these optimizations for production builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-tooltip',
          ],
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Generate CSS separately
    cssCodeSplit: true,
    // Enable source maps in production for easier debugging
    sourcemap: true,
  },
  // Optimize performance during development
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Enable caching
  cacheDir: '.vite-cache',
});
