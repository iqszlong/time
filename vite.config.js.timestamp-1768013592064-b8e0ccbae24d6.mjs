// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///M:/root/self-components/node_modules/.pnpm/vite@5.4.21_lightningcss@1.30.2_terser@5.44.1/node_modules/vite/dist/node/index.js";
import tailwindcss from "file:///M:/root/self-components/node_modules/.pnpm/@tailwindcss+vite@4.1.18_vite@5.4.21_lightningcss@1.30.2_terser@5.44.1_/node_modules/@tailwindcss/vite/dist/index.mjs";
import vue from "file:///M:/root/self-components/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.4.21_lightningcss@1.30.2_terser@5.44.1__vue@3.5.26_typescript@5.9.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///M:/root/self-components/node_modules/.pnpm/unplugin-auto-import@0.16.7_@vueuse+core@14.1.0_vue@3.5.26_typescript@5.9.3___rollup@4.54.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///M:/root/self-components/node_modules/.pnpm/unplugin-vue-components@0.25.2_@babel+parser@7.28.5_rollup@4.54.0_vue@3.5.26_typescript@5.9.3_/node_modules/unplugin-vue-components/dist/vite.mjs";
import { NaiveUiResolver } from "file:///M:/root/self-components/node_modules/.pnpm/unplugin-vue-components@0.25.2_@babel+parser@7.28.5_rollup@4.54.0_vue@3.5.26_typescript@5.9.3_/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_import_meta_url = "file:///M:/root/self-components/apps/time/vite.config.js";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd()) || {};
  return {
    base: env.VITE_BASE_URL || "/",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        "~": fileURLToPath(new URL("./", __vite_injected_original_import_meta_url))
      },
      extensions: [".js", ".json", ".vue", ".ts"]
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 将所有带短横线的标签名都视为自定义元素
            isCustomElement: (tag) => tag.includes("z-")
          }
        }
      }),
      AutoImport({
        imports: ["vue", "vue-router", "pinia", "vue-i18n", {
          "naive-ui": [
            "useMessage",
            "useDialog",
            "useMessage",
            "useNotification"
          ],
          "@/api/index.js": [["default", "api"]],
          "@/utils/index.js": [["default", "utils"]]
        }],
        dts: "./auto-imports.d.ts"
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      }),
      tailwindcss()
    ],
    server: {
      // port: 5678,
      proxy: {
        "/api": {
          target: "http://api.master.lazymeta.cn",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^/api"), "")
        },
        "/jsonserver": {
          target: "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^/jsonserver"), "")
        },
        "/file": {
          target: "http://api.master.lazymeta.cn",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^/file"), "")
        }
      }
    },
    build: {
      assetsInlineLimit: 0,
      outDir: mode ? `dist/${mode}` : `dist`
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJNOlxcXFxyb290XFxcXHNlbGYtY29tcG9uZW50c1xcXFxhcHBzXFxcXHRpbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIk06XFxcXHJvb3RcXFxcc2VsZi1jb21wb25lbnRzXFxcXGFwcHNcXFxcdGltZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vTTovcm9vdC9zZWxmLWNvbXBvbmVudHMvYXBwcy90aW1lL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcblxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgeyBOYWl2ZVVpUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKSB8fCB7fTtcclxuICAvLyBjb25zb2xlLmxvZyhcIm1vZGVcIiwgbW9kZSk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6IGVudi5WSVRFX0JBU0VfVVJMIHx8IFwiL1wiLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICBcIn5cIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9cIiwgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgIH0sXHJcbiAgICAgIGV4dGVuc2lvbnM6IFsnLmpzJywgJy5qc29uJywgJy52dWUnLCAnLnRzJ10sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICB2dWUoe1xyXG4gICAgICAgIHRlbXBsYXRlOiB7XHJcbiAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgLy8gXHU1QzA2XHU2MjQwXHU2NzA5XHU1RTI2XHU3N0VEXHU2QTJBXHU3RUJGXHU3Njg0XHU2ODA3XHU3QjdFXHU1NDBEXHU5MEZEXHU4OUM2XHU0RTNBXHU4MUVBXHU1QjlBXHU0RTQ5XHU1MTQzXHU3RDIwXHJcbiAgICAgICAgICAgIGlzQ3VzdG9tRWxlbWVudDogKHRhZykgPT4gdGFnLmluY2x1ZGVzKFwiei1cIiksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbXCJ2dWVcIiwgXCJ2dWUtcm91dGVyXCIsIFwicGluaWFcIiwgXCJ2dWUtaTE4blwiLCB7XHJcbiAgICAgICAgICBcIm5haXZlLXVpXCI6IFtcclxuICAgICAgICAgICAgXCJ1c2VNZXNzYWdlXCIsXHJcbiAgICAgICAgICAgIFwidXNlRGlhbG9nXCIsXHJcbiAgICAgICAgICAgIFwidXNlTWVzc2FnZVwiLFxyXG4gICAgICAgICAgICBcInVzZU5vdGlmaWNhdGlvblwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIFwiQC9hcGkvaW5kZXguanNcIjogW1tcImRlZmF1bHRcIiwgXCJhcGlcIl1dLFxyXG4gICAgICAgICAgXCJAL3V0aWxzL2luZGV4LmpzXCI6IFtbXCJkZWZhdWx0XCIsIFwidXRpbHNcIl1dLFxyXG4gICAgICAgIH0sXSxcclxuICAgICAgICBkdHM6IFwiLi9hdXRvLWltcG9ydHMuZC50c1wiLFxyXG4gICAgICB9KSxcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbTmFpdmVVaVJlc29sdmVyKCldLFxyXG4gICAgICB9KSxcclxuICAgICAgdGFpbHdpbmRjc3MoKSxcclxuICAgIF0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgLy8gcG9ydDogNTY3OCxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9hcGkubWFzdGVyLmxhenltZXRhLmNuXCIsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeL2FwaVwiKSwgXCJcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIi9qc29uc2VydmVyXCI6IHtcclxuICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl4vanNvbnNlcnZlclwiKSwgXCJcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIi9maWxlXCI6IHtcclxuICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vYXBpLm1hc3Rlci5sYXp5bWV0YS5jblwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXi9maWxlXCIpLCBcIlwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGFzc2V0c0lubGluZUxpbWl0OiAwLFxyXG4gICAgICBvdXREaXI6IG1vZGUgPyBgZGlzdC8ke21vZGV9YCA6IGBkaXN0YCxcclxuICAgIH0sXHJcbiAgfTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1IsU0FBUyxlQUFlLFdBQVc7QUFDbFUsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxTQUFTO0FBRWhCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsdUJBQXVCO0FBUG1KLElBQU0sMkNBQTJDO0FBVXBPLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDakQsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUM7QUFFN0MsU0FBTztBQUFBLElBQ0wsTUFBTSxJQUFJLGlCQUFpQjtBQUFBLElBQzNCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsUUFDcEQsS0FBSyxjQUFjLElBQUksSUFBSSxNQUFNLHdDQUFlLENBQUM7QUFBQSxNQUNuRDtBQUFBLE1BQ0EsWUFBWSxDQUFDLE9BQU8sU0FBUyxRQUFRLEtBQUs7QUFBQSxJQUM1QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLFFBQ0YsVUFBVTtBQUFBLFVBQ1IsaUJBQWlCO0FBQUE7QUFBQSxZQUVmLGlCQUFpQixDQUFDLFFBQVEsSUFBSSxTQUFTLElBQUk7QUFBQSxVQUM3QztBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFNBQVMsQ0FBQyxPQUFPLGNBQWMsU0FBUyxZQUFZO0FBQUEsVUFDbEQsWUFBWTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsVUFDQSxrQkFBa0IsQ0FBQyxDQUFDLFdBQVcsS0FBSyxDQUFDO0FBQUEsVUFDckMsb0JBQW9CLENBQUMsQ0FBQyxXQUFXLE9BQU8sQ0FBQztBQUFBLFFBQzNDLENBQUU7QUFBQSxRQUNGLEtBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUFBLE1BQy9CLENBQUM7QUFBQSxNQUNELFlBQVk7QUFBQSxJQUNkO0FBQUEsSUFDQSxRQUFRO0FBQUE7QUFBQSxNQUVOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLE9BQU8sT0FBTyxHQUFHLEVBQUU7QUFBQSxRQUN6RDtBQUFBLFFBQ0EsZUFBZTtBQUFBLFVBQ2IsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLElBQUksT0FBTyxjQUFjLEdBQUcsRUFBRTtBQUFBLFFBQ2hFO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsSUFBSSxPQUFPLFFBQVEsR0FBRyxFQUFFO0FBQUEsUUFDMUQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsbUJBQW1CO0FBQUEsTUFDbkIsUUFBUSxPQUFPLFFBQVEsSUFBSSxLQUFLO0FBQUEsSUFDbEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
