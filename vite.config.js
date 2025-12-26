import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from '@tailwindcss/vite'
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd()) || {};
  // console.log("mode", mode);
  return {
    base: env.VITE_BASE_URL || "/",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./", import.meta.url)),
      },
      extensions: ['.js', '.json', '.vue', '.ts'],
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 将所有带短横线的标签名都视为自定义元素
            isCustomElement: (tag) => tag.includes("z-"),
          },
        },
      }),
      AutoImport({
        imports: ["vue", "vue-router", "pinia", "vue-i18n", {
          "naive-ui": [
            "useMessage",
            "useDialog",
            "useMessage",
            "useNotification",
          ],
          "@/api/index.js": [["default", "api"]],
          "@/utils/index.js": [["default", "utils"]],
        },],
        dts: "./auto-imports.d.ts",
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      tailwindcss(),
    ],
    server: {
      // port: 5678,
      proxy: {
        "/api": {
          target: "http://api.master.lazymeta.cn",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^/api"), ""),
        },
        "/jsonserver": {
          target: "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^/jsonserver"), ""),
        },
        "/file": {
          target: "http://api.master.lazymeta.cn",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^/file"), ""),
        },
      },
    },
    build: {
      assetsInlineLimit: 0,
      outDir: mode ? `dist/${mode}` : `dist`,
    },
  };
});
