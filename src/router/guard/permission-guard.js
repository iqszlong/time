// 没有 Token 也可访问的白名单页面
const WHITE_LIST = ["home", "login", "404", "register"];
const TOKEN_KEY = "token";

// 根据有无 Token 判断能否访问页面
export function createPermissionGuard(router) {
  // 路由前置守卫: 根据有没有 Token 判断前往哪个页面
  router.beforeEach(async (to) => {
    const token = localStorage.getItem(TOKEN_KEY);
    // 没有 Token 的情况
    if (!token) {
      // 前往白名单中的页面可以放行 或 meta属性allowRoute:true时放行
      if (WHITE_LIST.includes(to.name) || to.meta.allowRoute) return true;
      // 重定向到登录页, 并且携带 redirect 参数, 登录后自动重定向到原本的目标页面
      return { name: "login", query: { ...to.query, redirect: to.name } };
    }
    // 有 Token 的情况
    if (to.name === "login") return { name: "home" };

    // TODO: 刷新 Token
    // await refreshAccessToken()

    return true;
  });
}
