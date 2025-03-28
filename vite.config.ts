
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
  base: "/", // Base path must be "/" for correct absolute paths
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
    // Set up output handling for both module and non-module code
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Ensure proper handling of modules and non-modules
        intro: `
          // Fallback for browsers without module support
          const isModern = typeof document !== "undefined" && "noModule" in HTMLScriptElement.prototype;
          console.log("Build running with isModern:", isModern);
        `
      },
      external: [
        /\/favicon\.ico$/
      ]
    },
    // Generate chunks with optimized sizes
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: true,
  },
  // Add appropriate optimizations for both modern and legacy browsers
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
      target: 'es2020' // More compatible target
    }
  },
  cacheDir: '.vite-cache',
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Add JSX factory for React 17+ compatibility
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  }
}));
