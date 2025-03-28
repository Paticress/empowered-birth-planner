
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Find index.html in the project structure
function findIndexHtml(dir: string): string | null {
  const files = fs.readdirSync(dir);
  
  // Check if index.html exists in this directory
  if (files.includes('index.html')) {
    return path.join(dir, 'index.html');
  }
  
  // Recursively check subdirectories
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && file !== 'node_modules' && file !== '.git' && file !== 'dist') {
      try {
        const indexPath = findIndexHtml(filePath);
        if (indexPath) {
          return indexPath;
        }
      } catch (error) {
        // Continue searching other directories if error occurs
      }
    }
  }
  
  return null;
}

// Try to find index.html
const indexPath: string | null = findIndexHtml(__dirname);
const root: string = indexPath ? path.dirname(indexPath) : __dirname;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path must be "/" for GitHub Pages with custom domain
  base: "/", 
  root: root, // Set the root to the directory containing index.html
  server: {
    port: 8080,
    open: true,
    // Add historyApiFallback for SPA routing during development
    historyApiFallback: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
      }
    },
    // Fix the output format to support ES modules
    rollupOptions: {
      output: {
        format: 'es', // Using ES modules format
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
      // Don't bundle the favicon - let it be handled by the build process
      external: [
        /\/favicon\.ico$/
      ]
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Generate CSS separately
    cssCodeSplit: true,
    // Generate source maps for easier debugging
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
}));
