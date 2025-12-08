import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Embed build configuration
  if (mode === 'embed') {
    return {
      plugins: [react()],
      define: {
        // Replace process.env with empty object for browser compatibility
        'process.env': '{}',
        'process.env.NODE_ENV': JSON.stringify('production'),
        'global': 'window',
      },
      build: {
        lib: {
          entry: './src/embed.jsx',
          name: 'TroikaChatbot',
          fileName: (format) => `chatbot-fullscreen-bundle.${format === 'umd' ? 'js' : format}`,
          formats: ['umd'],
        },
        // Bundle React and ReactDOM for standalone deployment
        // This makes the bundle self-contained but larger
        rollupOptions: {
          // Don't externalize - bundle everything for standalone use
          output: {
            // Override default filename to use .js extension
            entryFileNames: 'chatbot-fullscreen-bundle.js',
            assetFileNames: 'chatbot-fullscreen-bundle.css',
            format: 'umd',
            // UMD library name - this will be available as window.TroikaChatbot
            name: 'TroikaChatbot',
            globals: {},
          },
        },
        outDir: 'dist',
        emptyOutDir: false, // Don't clear dist folder (keep main build)
        cssCodeSplit: false, // Bundle CSS into single file
        minify: 'esbuild', // Minify for production (esbuild is built into Vite)
      },
    };
  }

  // Default SPA build configuration
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0", // allow access from network
      port: 5174, // your port
      allowedHosts: [
        "92a161b07434.ngrok-free.app", // 👈 add your ngrok domain here
      ],
    },
  };
});
