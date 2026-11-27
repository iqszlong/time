import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from '@tailwindcss/vite'
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd()) || {};
  // Service Worker 离线缓存开关，对应 .env 里的 VITE_ENABLE_PWA
  const pwaEnabled = env.VITE_ENABLE_PWA === "true";
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
          "@/api/index.js": [["default", "api"]],
          "@/utils/index.js": [["default", "utils"]],
          "naive-ui": [
            "useMessage",
            "useDialog",
            "useMessage",
            "useNotification",
          ],
        },],
        dts: "./auto-imports.d.ts",
      }),
      Components({
        extensions: ['vue'],
        dts: './components.d.ts',
        globs: [
          'src/components/*.vue',
          'src/components/*/*.vue',
          'src/components/ui/*.vue',
          'src/components/ui/*/*.vue',
        ],
        resolvers: [NaiveUiResolver()],
      }),
      tailwindcss(),
      // Service Worker 离线缓存，由 .env 的 VITE_ENABLE_PWA 控制，默认关闭。
      // 关闭时只挂一个 disable 实例，virtual:pwa-register 退化为空实现，
      // 不生成 sw.js，页面也不会注册任何 Service Worker。
      VitePWA({
        disable: !pwaEnabled,
        registerType: "prompt",
        injectRegister: false,
        manifest: false,
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,webp,jpg,jpeg}"],
          // 字体、产物里的 zip 不进 precache，改由运行时缓存按需存
          globIgnores: ["fonts/**", "**/*.zip"],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/file\//, /^\/jsonserver\//],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: false,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/fonts/"),
              handler: "CacheFirst",
              options: {
                cacheName: `time-fonts-${mode}`,
                expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.bunny\.net\//,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: `time-webfonts-${mode}`,
                expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: `time-images-${mode}`,
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 14 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
    server: {
      open: false,
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
      minify: "terser",
      assetsInlineLimit: 0,
      target: "modules",
      terserOptions: { compress: { drop_console: true, drop_debugger: true } }, // 移除 console debugger
      outDir: `dist/${mode}`,
      rollupOptions: {
        external: [],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          // globals: {
          // vue: 'Vue',
          // 'vue-router': 'VueRouter',
          // 'xe-utils': 'XEUtils',
          // },
          manualChunks(id) {
            // 分包
            if (id.includes('xe-utils')) {
              return 'xe-utils';
            } else if (id.includes('components/vue/z')) {
              return 'iqszlong-components';
            } else if (id.includes('utils/js')) {
              return 'lazy-utils';
            } else if (id.includes('augmented-ui')) {
              return 'augmented-ui';
            } else if (id.includes('wangeditor/editor')) {
              return 'wangeditor-editor';
            } else if (id.includes('vditor')) {
              return 'vditor';
            } else if (id.includes('dexie')) {
              return 'dexie';
            } else if (id.includes('html2canvas')) {
              return 'html2canvas';
            } else if (id.includes('easyqrcodejs')) {
              return 'easyqrcodejs';
            } else if (id.includes('qs')) {
              return 'qs';
            } else if (id.includes('spark-md5')) {
              return 'spark-md5';
            } else if (id.includes('pinia')) {
              return 'pinia';
            } else if (id.includes('json5')) {
              return 'json5';
            } else if (id.includes('naive-ui')) {
              return 'naive-ui';
            } else if (id.includes('reka-ui')) {
              return 'reka-ui';
            } else if (id.includes('lucide-vue-next')) {
              return 'lucide-vue-next';
            } else if (id.includes('i18n-jsautotranslate')) {
              return 'i18n-jsautotranslate';
            } else if (id.includes('qiniu-js')) {
              return 'qiniu-js';
            } else if (id.includes('tailwind')) {
              return 'tailwind';
            } else if (id.includes('dayjs')) {
              return 'dayjs';
            } else if (id.includes('reka-ui')) {
              return 'reka-ui';
            } else if (id.includes('shadcn-vue')) {
              return 'shadcn-vue';
            } else if (id.includes('vue-')) {
              return 'vue-plugin';
            } else if (id.includes('node_modules')) {
              return 'vendor';
            } else {
              // console.log(id)
            }
          },
          // advancedChunks: {
          //   groups: [
          //     {
          //       test: /xe-utils/,
          //       name: 'xe-utils',
          //     },
          //     {
          //       test: /html2canvas/,
          //       name: 'html2canvas',
          //     },
          //     {
          //       test: /easyqrcodejs/,
          //       name: 'easyqrcodejs',
          //     },
          //     {
          //       test: /node_modules/,
          //       name: 'libs',
          //     },
          //   ],
          // },
        }
      },
    },
  };
});
