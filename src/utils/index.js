import lazyUtils from "@lazy/utils"; // 通用工具库
import * as request from "./request"; // 请求封装
import XEUtils from "xe-utils"; // XEUtils https://x-extends.gitee.io/xe-utils
import * as popover  from "./popover" //消息提示
import * as day from "./day"; // 日期库
import * as upload from "./upload" // 文件上传
import * as mobileCode from "./mobileCode"; // 短信验证码
import * as shareImg from "./shareImg"; // 分享图片
import * as system from "./system"; // 系统相关
import * as file from "./file"; // 文件转换
import * as icons from "./icons"; // 图标库
import * as naiveui from "./naiveui"; // naiveui
export default {
  ...lazyUtils,
  ...request,
  ...XEUtils,
  ...popover,
  ...upload,
  ...mobileCode,
  ...shareImg,
  ...day,
  ...system,
  ...file,
  ...naiveui,
  icons,
};
