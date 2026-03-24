import { storeToRefs } from 'pinia'
import { useBackgroundStore } from '@/stores/background'

import utils from '@/utils'
export function createBaseGuard(router) {
  const needLoginList = ['usercenter']
  const { message, debounce } = utils
  const backgroundStore = useBackgroundStore()
  const { initBackground } = backgroundStore


  // 防抖函数
  const debouncedFn = debounce(async (fn) => {
    fn && await fn()
  }, 500)

  router.beforeEach(async (to, from) => {
    // 初始化站点信息
    await initBackground()
    if (needLoginList.includes(to.name) && !isLogin.value && to.name !== 'login') {
      debouncedFn(async () => {
        // 需要登录，跳转到login页面
        message.warning('请先登录')
        // 用encodeURIComponent()对url进行编码，防止url参数中包含特殊字符,使用时用decodeURIComponent()解码
        router.push({ name: 'login', query: { redirect: encodeURIComponent(to.fullPath) } })
      })

      return false
    }
    return true
  })

  router.afterEach((to, from, failure) => { })

  router.onError(() => {

  })
}