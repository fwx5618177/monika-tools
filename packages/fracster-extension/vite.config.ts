import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import { copyFileSync, statSync } from "fs";

export default defineConfig({
  base: "./",
  publicDir: "public",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content/index.ts"),
        background: resolve(__dirname, "src/background/index.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      scopeBehaviour: "local",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        math: "always",
        globalVars: {},
      },
    },
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    exclude: /node_modules/,
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    open: true,
    cors: true,
    proxy: {},
  },
  plugins: [
    react(),
    {
      name: "copy-manifest",
      apply: "build",
      closeBundle: () => {
        const from = path.join(__dirname, "manifest.json");
        const to = path.join(__dirname, "dist", "manifest.json");
        copyFileSync(from, to);
        console.log("copy manifest.json");

        // 检测是否复制成功
        const stats = statSync(to);
        if (stats.isFile()) {
          console.log("copy manifest.json success");
        } else {
          console.log("copy manifest.json fail");
          throw new Error("copy manifest.json fail");
        }
      },
    },
  ],
});
