import { toMsg } from "@iqszlong/components/vue/zpopover/msg";

const setUpMessage = () => {
  class Message {
    constructor(){}
    default(msg, option = {}) {
      toMsg(msg, {
        ...option,
        css: option.css
          ? ["pop-msg", "center-top", ...option.css]
          : ["pop-msg", "center-top"],
      });
    }

    success(msg, option = {}) {
      toMsg(msg, {
        ...option,
        css: option.css
          ? ["pop-msg", "center-top", "success", ...option.css]
          : ["pop-msg", "center-top", "success"],
      });
    }

    info(msg, option = {}) {
      toMsg(msg, {
        ...option,
        css: option.css
          ? ["pop-msg", "center-top", "info", ...option.css]
          : ["pop-msg", "center-top", "info"],
      });
    }

    warning(msg, option = {}) {
      toMsg(msg, {
        ...option,
        css: option.css
          ? ["pop-msg", "center-top", "warning", ...option.css]
          : ["pop-msg", "center-top", "warning"],
      });
    }

    error(msg, option = {}) {
      toMsg(msg, {
        ...option,
        css: option.css
          ? ["pop-msg", "center-top", "error", ...option.css]
          : ["pop-msg", "center-top", "error"],
      });
    }
  }

  return new Message();
};

const popmsg = setUpMessage();

export { popmsg };
