import { createI18n } from "vue-i18n";
import zhCnData from "@/lang/zh-CN.json";
import enUsData from "@/lang/en-US.json";
// ui库语言包
import { zhCN, dateZhCN } from "naive-ui";
// 当前设置语言
const currentLang = import.meta.env.MODE == "china" ? "zh" : "en";
// 默认语言
const defaultLang = import.meta.env.MODE == "china" ? "zh" : "en";

const enLang = { label: "English", value: "en", ui: [null, null] };
const zhLang = { label: "中文", value: "zh", ui: [zhCN, dateZhCN] };

// 语言列表
export const langList = () => {
  if (import.meta.env.MODE == "global") {
    return [enLang];
  }
  if (import.meta.env.MODE == "china") {
    return [zhLang];
  }
  return [enLang, zhLang];
};

export const i18n = createI18n({
  legacy: false,
  locale: currentLang,
  fallbackLocale: defaultLang,
  messages: {
    en: enUsData,
    zh: zhCnData,
  },
});
