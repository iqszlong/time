import { createRouter, createWebHistory } from "vue-router";
import { setupRouterGuard } from './guard'

export const basicRoutes = [
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/common/NotFound.vue"),
    isHidden: true,
    meta: {
      title: "错误页",
    },
  },  
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes,
});

// 加载 views 下每个模块的 routes.js 文件
const routeModules = import.meta.glob('@/views/**/route.js', { eager: true })
const asyncRoutes = []
Object.keys(routeModules).forEach((key) => {
  asyncRoutes.push(routeModules[key].default)
})

// 加载 views 下每个模块的 index.vue 文件
// const vueModules = import.meta.glob('@/views/modules/**/index.vue')

const getRouter = async () => {
    return new Promise((resolve,reject)=>{
      resolve(asyncRoutes)
    })
}

// 动态加载路由
const addDynamicRoutes = async () => {
  //请求
  const requestRouter = await getRouter()
  //添加
  requestRouter.forEach(route => router.addRoute(route))
  
};

export async function setupRouter(app) {
  await addDynamicRoutes(); // 每次刷新时都添加动态路由
  setupRouterGuard(router)
  app.use(router);
}
