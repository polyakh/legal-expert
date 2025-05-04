// vite.config.js
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { compression } from "vite-plugin-compression2";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Static files directory
  publicDir: "public",

  build: {
    // Disable source maps in production for security and performance
    sourcemap: false,

    // Configure JS minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3, // More optimization passes
        pure_funcs: ["console.log", "console.info", "console.debug"],
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        properties: {
          regex: /^_/, // Mangle private properties (starting with _)
        },
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },

    // Use LightningCSS for faster CSS minification
    cssMinify: "lightningcss",
    cssTarget: ["chrome80", "firefox80", "safari14"],

    // Ensure proper browser compatibility
    target: ["es2020", "chrome80", "firefox80", "safari14", "edge80"],

    // Performance metrics
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1500,

    // Organize output files
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    assetsInlineLimit: 4096, // 4kb - inline small assets as data URLs

    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy-policy.html"),
      },
      output: {
        // Optimize code splitting
        manualChunks: {
          vendor: [
            // List your major dependencies here for better caching
          ],
        },
        // Organize files by type
        entryFileNames: "assets/js/[name].[hash].js",
        chunkFileNames: "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "asset"; // fallback if name is undefined
          const ext = name.split(".").pop();

          if (/\.css$/i.test(name)) {
            return "assets/css/[name].[hash][extname]";
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(name)) {
            return "assets/images/[name].[hash][extname]";
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return "assets/fonts/[name].[hash][extname]";
          }
          return "assets/[name].[hash][extname]";
        },
      },
    },
  },

  // Optimization plugins
  plugins: [
    // HTML minification
    ViteMinifyPlugin({
      collapseWhitespace: true,
      conservativeCollapse: true, // Preserve one space between elements for readability
      removeComments: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      minifyJS: true, // For inline JS in HTML
      minifyCSS: true, // For inline CSS in HTML
      minifyURLs: true,
      useShortDoctype: true,
    }),

    // Gzip compression
    compression({
      algorithm: "gzip",
      threshold: 10240,
      compressionOptions: { level: 9 },
      deleteOriginalAssets: false,
      skipIfLargerOrEqual: true,
      filename: (file) => `${file}.gz`,
    }),

    // Brotli compression (more efficient than gzip)
    compression({
      algorithm: "brotliCompress",
      threshold: 10240,
      compressionOptions: { level: 11 },
      deleteOriginalAssets: false,
      skipIfLargerOrEqual: true,
      filename: (file) => `${file}.br`,
    }),
  ],

  // Dev server settings
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  },

  // Preview server settings
  preview: {
    port: 8080,
    open: true,
    strictPort: true,
    host: true,
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
    },
  },

  // Resolve configuration
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
    extensions: [".js", ".json"],
  },
});
