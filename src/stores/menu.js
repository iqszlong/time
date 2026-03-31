
export const useMenuStore = defineStore("menus", () => {
  const { proxy } = getCurrentInstance();
  const { iHome, iLink, iEdit } = proxy;
  const { getPost, serialize } = utils;
  const staticList = [
    {
      name: "background",
      id: 0,
      title: "背景",
      parent: "root",
      visible: "true",
    },{
      name: "time",
      id: 1,
      title: "通用",
      parent: "root",
      visible: "true",
    },
    
  ];
  const currentMenu = ref(staticList[0].name);
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
