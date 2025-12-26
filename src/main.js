import "@/assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from "@/App.vue";
import { setupRouter } from "@/router";
import "@iqszlong/components";
// import components from "@/components/install";
import utils from "@/utils/install";
import { shadcnui } from "@/utils/shadcnui";
// 多语言
import { i18n } from "@/lang/i18n";

async function setupApp() {
  const app = createApp(App);
  await setupRouter(app);
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia).use(utils).use(i18n);
  app.mount("#app");
}
setupApp();

shadcnui();
