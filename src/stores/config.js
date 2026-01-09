import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
// import { hg,cz1,cz10,cz2,cz3,cz4,moe_ss} from "@lazy/utils/wallpaper";

export const useConfigStore = defineStore("config", () => {
  const defaultData = {
    sourcePath: "//api.paugram.com/bing",
    fit: "cover", // 背景填充方式
    hposition: "center", // 背景填充水平位置
    vposition: "center", // 背景填充垂直位置
    visible: true,
    mask: { enabled: true, from: 0, to: 100 },
    state: "idel", // pause || play
    autoPause: true, // 播放页离开自动暂停
    random: false, //播放页随机播放
    time: { display: '12' },
    naiveTheme: "dark", // 主题
    country: "CN",
    language: "ZH_CN",
    location: null, // 地理位置
  }
  const config = reactive(JSON.parse(JSON.stringify(defaultData)));


  function setConfig(data) {
    for (const key in data) {
      config[key] = data[key];
    }
    config.state = "play"
  }



  function resetConfig() {
    for (const key in config) {
      config[key] = defaultData[key];
    }
  }

  return { config, setConfig, resetConfig };
}, {
  persist: true,
},);
