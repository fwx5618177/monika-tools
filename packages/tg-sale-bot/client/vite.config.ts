import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDev = mode === "development";
  const isUat = mode === "uat";
  const baseUrl = isDev
    ? env.VITE_APP_BASE_URL_DEV
    : isUat
      ? env.VITE_APP_BASE_URL_UAT
      : env.VITE_APP_BASE_URL_PROD;

  console.log("baseUrl:", baseUrl);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@styles": resolve(__dirname, "src/styles"),
        "@components": resolve(__dirname, "src/components"),
        "@pages": resolve(__dirname, "src/pages"),
        "@utils": resolve(__dirname, "src/utils"),
        "@i18n": resolve(__dirname, "src/i18n"),
        "@config": resolve(__dirname, "src/config"),
        "@apis": resolve(__dirname, "src/apis"),
        "@interfaces": resolve(__dirname, "src/interfaces"),
        "@constants": resolve(__dirname, "src/constants"),
        "@providers": resolve(__dirname, "src/providers"),
        "@store": resolve(__dirname, "src/store"),
        "@hooks": resolve(__dirname, "src/hooks"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1024,
      sourcemap: mode === "development",
      outDir: "../dist",
      assetsDir: ".",
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react"],
            "react-dom": ["react-dom"],
            "react-router-dom": ["react-router-dom"],
            formik: ["formik"],
            moment: ["moment"],
            "react-i18next": ["react-i18next"],
            lodash: ["lodash"],
            numeral: ["numeral"],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: mode === "production",
        },
      },
      minify: "esbuild",
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: baseUrl,
          changeOrigin: true,
        },
      },
      watch: {
        usePolling: true,
      },
      historyApiFallback: true,
    },
    define: {
      "process.env": {
        NODE_ENV: mode,
        VITE_APP_BASE_URL: baseUrl,
        VITE_APP_RECEIVE_ADDRESS_TON: env.VITE_APP_RECEIVE_ADDRESS_TON,
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "react-i18next"],
    },
  };
});
