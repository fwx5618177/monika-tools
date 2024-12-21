import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "path";
import { copyFileSync, statSync } from "fs";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    define: {
      "process.env": {
        NODE_ENV: isDevelopment ? "development" : "production",
      },
    },
    base: "./",
    publicDir: "public",
    sourcemap: true,
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
      open: isDevelopment,
      cors: true,
      proxy: {},
      hmr: {
        protocol: "ws",
        host: "localhost",
      },
    },

    plugins: [
      react(),
      {
        name: "copy-manifest",
        apply: "build",
        closeBundle: () => {
          const copyManifest = (from: string, to: string) => {
            const fromFile = path.join(__dirname, from);
            const toFile = path.join(__dirname, to);

            copyFileSync(fromFile, toFile);

            const stats = statSync(toFile);
            if (stats.isFile()) {
              console.log(`copy ${from} to ${to} success`);
            } else {
              console.log(`copy ${from} to ${to} fail`);
              throw new Error(`copy ${from} to ${to} fail`);
            }

            console.log(`copy ${from} to ${to}`);
          };

          copyManifest("manifest.json", "dist/manifest.json");
          copyManifest("rules.json", "dist/rules.json");
        },
      },
    ],
  };
});
