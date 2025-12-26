import { ref, computed, getCurrentInstance } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import utils from "@/utils";
import api from "@/api";

export const useUserStore = defineStore("user", () => {
  const { isNull, message } = utils;
  const router = useRouter();

  const TOKEN_KEY = "token";
  const USER_KEY = "account";
  const token = ref(null);
  const userInfo = ref({});

  const userSettingMenu = ref([
    {
      name: "setting",
      title: "个人设置",
      link: { name: "userSetting" },
      type: "router",
    },
    {
      name: "pwd",
      title: "修改密码",
      link: { name: "userPwd" },
      type: "router",
    },
  ]);

  const userCurrentItem = ref('setting')

  const isLogin = computed(() => !isNull(token.value));

  const loadToken = () => {
    const storageToken = localStorage.getItem(TOKEN_KEY);
    if (!isNull(storageToken)) {
      token.value = storageToken;
    }
  };

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  const setUserInfo = (info) => {
    for (const key in info) {
      userInfo.value[key] = info[key];
    }
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo.value));
  };

  const clearUserInfo = () => {
    userInfo.value = {};
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const getUserInfo = () => {
    const storageUser = localStorage.getItem(USER_KEY);
    if (!isNull(storageUser)) {
      userInfo.value = JSON.parse(storageUser);
      return;
    }
    getApiUserInfo();
  };

  const getApiUserInfo = () => {
    api
      .getUInfo()
      .then((res) => {
        // console.log(res)
        setUserInfo(res.data);
      })
      .catch((error) => {
        console.log(error);
        message.error(`获取用户信息失败 ${error.status}`);
      });
  };

  const logOut = () => {
    api
      .logout()
      .then(() => {
        clearUserInfo();
        message.success("退出成功");
        setTimeout(() => {
          router.push({ path: "/", replace: true });
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        message.error(`获取用户信息失败 ${error.status}`);
      });
  };

  return {
    isLogin,
    token,
    userSettingMenu,
    userCurrentItem,
    userInfo,
    loadToken,
    setToken,
    setUserInfo,
    getUserInfo,
    getApiUserInfo,
    logOut,
    clearUserInfo,
  };
});
