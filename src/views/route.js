import layout from "@/layout/mainLayout.vue";

export default {
  path: "/",
  component: layout,
  children: [
    {
      path: "",
      name: "home",
      component: () => import("@/views/index.vue"),
    },
    
  ],
};
