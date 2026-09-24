import { ref, onMounted } from 'vue';
import { UAParser } from 'ua-parser-js';

export function useBrowser() {
  const browser = ref({});
  const os = ref({});
  const engine = ref({});
  const isLoading = ref(true);

  onMounted(() => {
    const uap = new UAParser();
    const result = uap.getResult();
    browser.value = result.browser;
    os.value = result.os;
    engine.value = result.engine;
    isLoading.value = false;
  });

  return {
    browser,
    os,
    engine,
    isLoading
  };
}