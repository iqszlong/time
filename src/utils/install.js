import utils from "./index";
import icons from "./icons";
export default {
  install(app) {
    for (const key in utils) {
      app.config.globalProperties[key] = utils[key];
    }
    for (const key in icons) {
      app.config.globalProperties[key] = icons[key];
    }
    // console.log(app.config.globalProperties);
  },
};
