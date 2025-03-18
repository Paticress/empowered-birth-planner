import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Change this to '/' when deploying to a subdomain since the app will be at the root of that subdomain
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
    // Vite's BuildOptions doesn't have a direct TypeScript type checking option
    // Instead, we'll remove the incorrect 'skipTypeCheck' property entirely
    // and rely on the build.js script to handle TypeScript checking separately
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create dynamic chunks based on imports
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack';
            }
            // Other third-party libraries go to 'vendor'
            return 'vendor';
          }
          
          // Group app code by feature areas
          if (id.includes('/components/Guide/')) {
            return 'feature-guide';
          }
          if (id.includes('/components/Lead/')) {
            return 'feature-lead';
          }
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
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
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      'lucide-react',
      'date-fns',
      '@tanstack/react-query'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  // Enable caching
  cacheDir: '.vite-cache',
  // Improve dev performance
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
