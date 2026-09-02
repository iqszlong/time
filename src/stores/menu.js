import { Images,Cog,Clock4 } from 'lucide-vue-next';
export const useMenuStore = defineStore("menus", () => {
  const { proxy } = getCurrentInstance();
  const { getPost, serialize } = utils;
  const staticList = [
    {
      name: "background",
      id: 0,
      title: "背景",
      parent: "root",
      visible: "true",
      icon: Images
    }, {
      name: "time",
      id: 1,
      title: "时间",
      parent: "root",
      visible: "true",
      icon: Clock4
    }, {
      name: "setting",
      id: 2,
      title: "通用",
      parent: "root",
      visible: "true",
      icon: Cog
    }

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
