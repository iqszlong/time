import html2canvas from "html2canvas";
import QRCode from "easyqrcodejs";
import { dayjs } from "./day";
import XEUtils from "xe-utils";

const { isUndefined } = XEUtils;

export const createImg = async (dom) => {
  try {
    const canvas = await html2canvas(dom, {
      allowTaint: true, // 允许加载跨域的图片
      useCORS: true, // 跨域
      logging: true, // log日志
    });
    let imgBase64 = canvas.toDataURL("image/jpeg", 1);
    // console.log(imgBase64);
    return imgBase64;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createQrCode = (dom, { opt = { text: "bing.com" }, fn } = {}) => {
  if (isUndefined(dom)) return;
  new QRCode(dom, {
    ...opt,
    onRenderingEnd: () => {
      // 二维码渲染成功后...
      // console.log("Qr done");
      fn && fn();
    },
  });

  // const qrCode = new QRCode(url, {
  //   logo: DEFAULT_LOGO, // DEFAULT_LOGO logo地址-本地
  //   logoWidth: 60,
  //   logoHeight: 60,
  //   logoBackgroundTransparent: true,
  //   onRenderingEnd: () => {
  //     // 二维码渲染成功后...
  //   },
  // });
};

export const downloadImg = (
  imgBase64,
  fileName = `share_img`,
  timeUix = dayjs().unix()
) => {
  let link = document.createElement("a");
  link.href = imgBase64.replace("image/jpeg", "image/octet-stream");
  link.download = `${fileName}_${timeUix}.jpg`;
  link.click();
};
