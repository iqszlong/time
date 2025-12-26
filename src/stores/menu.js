import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getCurrentInstance } from "vue";
import utils from "@/utils";

export const useMenuStore = defineStore("menus", () => {
  const { proxy } = getCurrentInstance();
  const { iHome, iLink ,iEdit} = proxy;
  const { getPost, serialize } = utils;
  const staticList = [
    {
      type: "home",
      id: 0,
      title: "首页",
      parent: "root",
      visible: "true",
      project: "home",
      cover: iHome,
    },
    {
      type: "single",
      id: 1,
      title: "单页",
      parent: "root",
      visible: "true",
      project: "single",
      cover: iLink,
    },
    {
      type: "editor",
      id: 2,
      title: "编辑器",
      parent: "root",
      visible: "true",
      project: "editor",
      cover: iEdit,
    },
    {
      type: "mdeditor",
      id: 21,
      title: "markdown编辑器",
      parent: "root",
      visible: "true",
      project: "mdeditor",
      cover: iEdit,
    },
    {
      type: "shot",
      id: 3,
      title: "生成截图",
      parent: "root",
      visible: "true",
      project: "shot",
      cover: iEdit,
    },
    {
      type: "upload",
      id: 4,
      title: "上传",
      parent: "root",
      visible: "true",
      project: "upload",
      cover: iLink,
    },
    {
      type: "qiniu",
      id: 5,
      title: "七牛云上传",
      parent: "root",
      visible: "true",
      project: "qiniu",
      cover: iLink,
    },
    {
      type: "avatarcrop",
      id: 6,
      title: "头像裁剪",
      parent: "root",
      visible: "true",
      project: "avatarcrop",
      cover: iLink,
    },
    {
      project: "divider-1",
      type: "divider",
      visible: "true",
      props: {
        style: {
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },
  ];
  const currentMenu = ref("home");
  const menuList = ref([...staticList]);
  const menuReload = ref(false);

  async function getData() {
    if (menuList.value.length) menuList.value = [...staticList];
    await getTree("root");
  }

  async function getTree(parent) {
    const res = await getPost(`/cag?${serialize({ parent })}`);
    // console.log(res);
    const allRequset = [];
    for (const item of res) {
      // console.log(item);
      allRequset.push(`/cag?${serialize({ parent: item.project })}`);
      getChild(item.parent, { ...item, children: [] });
    }
    const child = await Promise.all(allRequset.map((url) => getPost(url)));

    for (const items of child) {
      if (items.length) {
        for (const item of items) {
          getChild(item.parent, { ...item, children: [] });
          await getTree(item.project);
        }
      }
    }
  }

  function getChild(parent = "root", item) {
    if (parent == "root") {
      menuList.value.push(item);
    } else {
      const opts = menuList.value.filter((el) => el.project == parent);
      if (opts.length) {
        for (const opt of opts) {
          opt.children.push(item);
        }
      }
    }
  }

  return { currentMenu, menuList, getData, menuReload };
});
