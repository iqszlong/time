import api from "@/api";
// import XEUtils from "xe-utils";
// import * as popover from "./popover"; //消息提示
// const { message } = popover;
// const { isNull } = XEUtils;

let wait = null;
const codeInfo = reactive({
  text: "发送验证码",
  canpostingtext: "发送验证码",
  posting: true,
  postingText: "秒后再次发送",
});

const postCode = (mobile) => {
  codeInfo.posting = true;
  api
    .verifyCode({ mobile })
    .then((res) => {
      message.success(`验证码已发送 ${res.data?.code}`);
      waitSendCode();
    })
    .catch((error) => {
      message.error(`验证码发送失败，请稍后重试`);
      console.log(error);
      codeInfo.posting = false;
    });
};

const waitSendCode = () => {
  let delay = 60;

  wait = setInterval(() => {
    // console.log('setInterval');
    if (delay > 1) {
      delay--;
      codeInfo.text = `${delay}${codeInfo.postingText}`;
    } else {
      codeInfo.posting = false;
      codeInfo.text = codeInfo.canpostingtext;
      clearInterval(wait);
      wait = null;
    }
  }, 1000);
};

const checkCode = async ({ mobile, code }) => {
  let pass = false;
  try {
    const res = await api.checkVerifyCode({ mobile, code });
    // console.log(res);
    if (res.code == 200) pass = true;
  } catch (error) {
    message.error(`验证码错误，请检查验证码`);
    console.log(error);
  }
  return pass;
};

const clearCodeWait = () => {
  const {isNull} = utils
  if (!isNull(wait)) {
    clearInterval(wait);
    wait = null;
    codeInfo.text = "发送验证码";
    codeInfo.canpostingtext = "发送验证码";
    codeInfo.posting = true;
    codeInfo.postingText = "秒后再次发送";
  }
};

export { codeInfo, clearCodeWait, postCode, checkCode };
