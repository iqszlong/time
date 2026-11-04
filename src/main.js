// 必须在最前面：WebView2 宿主在 NavigationCompleted 时会推背景文件句柄，
// 监听晚于那次推送就会丢消息，页面又要重新要一次授权。
import '@/utils/host-fs';

import '@/assets/fonts.css';
import "@/assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

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

shadcnui();
