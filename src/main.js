// 必须在最前面：WebView2 宿主在 NavigationCompleted 时会推背景文件句柄，
// 监听晚于那次推送就会丢消息，页面又要重新要一次授权。
import '@/utils/host-fs';

import '@/assets/fonts.css';
import "@/assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { toast } from 'vue-sonner'

import App from "@/App.vue";
import { setupRouter } from "@/router";
import "@iqszlong/components";
// import components from "@/components/install";
// import utils from "@/utils/install";
import { shadcnui } from "@/utils/shadcnui";
// 多语言
import { i18n } from "@/lang/i18n";

async function setupApp() {
  const app = createApp(App);
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app
  // .use(utils)
  .use(pinia)
  .use(i18n);
  await setupRouter(app);
  app.mount("#app");
}
setupApp();

// Service Worker 离线缓存：仅当 .env 的 VITE_ENABLE_PWA 为 true 时生效。
// 关闭时 vite-plugin-pwa 的注册模块是空实现，这里不会注册任何东西。
if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_PWA === 'true') {
  import('virtual:pwa-register').then(({ registerSW }) => {
    let updateSW
    updateSW = registerSW({
      // 等首屏渲染完再装，不和页面抢带宽
      immediate: false,
      onNeedRefresh() {
        toast('有新版本，更新后会自动刷新', {
          action: { label: '更新', onClick: () => updateSW(true) },
          duration: Infinity,
        })
      },
      onRegisteredSW(url, registration) {
        // 页面常开时定时问一下有没有新版
        registration && setInterval(() => registration.update(), 60 * 60 * 1000)
      },
      onRegisterError(error) {
        console.error('[pwa] Service Worker 注册失败', error)
      },
    })
  })
}

shadcnui();
