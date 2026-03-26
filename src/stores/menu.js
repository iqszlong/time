import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";
import utils from "@/utils";

export const useMenuStore = defineStore("menus", () => {
  const { proxy } = getCurrentInstance();
  const { iHome, iLink, iEdit } = proxy;
  const { getPost, serialize } = utils;
  const staticList = [
    {
      name: "time",
      id: 0,
      title: "时间",
      parent: "root",
      visible: "true",
    },
    {
      name: "background",
      id: 0,
      title: "背景",
      parent: "root",
      visible: "true",
    },
  ];
  const currentMenu = ref("time");
  const menuList = ref([...staticList]);
  const loading = ref(false);

  const currentItem = computed(() => {
    return menuList.value.find((item) => item.name === currentMenu.value);
  })

  const setMenu = (val) => {
    currentMenu.value = val;
  }

  return { currentItem, currentMenu, menuList, loading, setMenu };
});
