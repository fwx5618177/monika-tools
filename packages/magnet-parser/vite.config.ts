import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
      overrides: {
        os: "os-browserify/browser",
        fs: "memfs",
        net: "net-browserify",
        path: "path-browserify",
        stream: "stream-browserify",
      },
    }),
  ],
  optimizeDeps: {
    include: ["webtorrent"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 目标后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径，例如将 '/api/query-magnet' 代理到 '/query-magnet'
      },
    },
  },
});
