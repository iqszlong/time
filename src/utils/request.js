import request from "@lazy/utils/fetch";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { router } from "@/router";
// import * as popover from "./popover"; //消息提示

// console.log("request", process.env.NODE_ENV);
// const env = process.env.NODE_ENV || "development";
let baseURL = import.meta.env.VITE_API_BASE_URL;
let jsonURL = import.meta.env.VITE_JSON_BASE_URL;
// switch (env) {
//   case "development":
//     baseURL = "/api";
//     jsonURL = "/jsonserver";
//     break;
//   case "test":
//     baseURL = "http://api.server.com";
//     jsonURL = "http://localhost:3000";
//     break;
//   case "production":
//     baseURL = "//api.master.lazymeta.cn";
//     jsonURL = "http://localhost:3000";
//     break;
// }

const whiteList = ["/auth/login", "/auth/register", "/auth/verifyCode"];

const failFun = (reason) => {
  const userStore = useUserStore();
  const { clearUserInfo } = userStore;
  const { message } = utils;
  console.log("failFun", reason);
  // @1:状态码失败
  if (reason && reason.code === "STATUS ERROR") {
    switch (reason.status) {
      case 401:
        clearUserInfo();
        setTimeout(() => {
          message.warning("登录已过期，请重新登录");
          router.push({ name: "login" });
        }, 500);

        // console.log("fetch 401");
        break;
      // ...
    }
  }

  // @2:断网
  if (!navigator.onLine) {
    // ...
  }

  // @3:处理返回数据格式失败
  // ...
};

const apiRequest = (url, options) => {
  if (!whiteList.includes(url)) {
    const userStore = useUserStore();
    const { loadToken } = userStore;
    const { token } = storeToRefs(userStore);
    loadToken();
    // console.log(token.value);
    if (token.value == null) return;
    options = {
      ...options,
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    };
    // console.log('options',options);
  }
  if (!/^http(s?):\/\//i.test(url) && !/^\/\//i.test(url)) url = baseURL + url;
  // if(/^\/\//i.test(url)) url= `https:${url}`

  return request(url, options, { failFun });
};

const jsonRequest = (url, options) => {
  const userStore = useUserStore();
  const { loadToken } = userStore;
  const { token } = storeToRefs(userStore);
  loadToken();
  // console.log(token.value);
  if (token.value == null) return;
  options = {
    ...options,
    headers: {
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };
  if (!/^http(s?):\/\//i.test(url) && !/^\/\//i.test(url)) url = jsonURL + url;
  // if(/^\/\//i.test(url)) url= `https:${url}`
  return request(url, options);
};

export { apiRequest, jsonRequest };
