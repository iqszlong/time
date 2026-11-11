/**
 * 宿主文件句柄交换
 *
 * 背景：File System Access 的授权是 handle 级的。页面刷新后权限回到 prompt，
 * 而 requestPermission() 必须由用户手势触发；壁纸模式下没有人点，
 * WebView2 又没有浏览器那套权限气泡 UI，所以每次加载都读不到本地文件。
 *
 * 解法：由宿主弹文件对话框拿到绝对路径（页面拿不到路径，这是浏览器的刻意设计），
 * 宿主按路径造好已授权的句柄推给页面。宿主造的句柄在创建时就带 ReadOnly 权限，
 * 不需要 requestPermission，也不需要任何用户手势。
 *
 * 注意方向只有单向：宿主 → 页面。反向传 FileSystemHandle 拿不到对象，
 * WebView2 的 additionalObjects 实际只认 File 类型。
 *
 * 环境判断不能只看 window.chrome.webview：Lively Wallpaper 这类第三方 WebView2
 * 容器也提供同一个对象，但它不认我们的消息，于是“选择文件”点了没反应。
 * 所以改由宿主在文档创建时注入 window.__HANA_HOST__ 标识
 * （C# 侧 AddScriptToExecuteOnDocumentCreated），标识对得上才算自己的宿主。
 *
 * 时序：监听必须早于宿主的推送（宿主在 NavigationCompleted 时发），
 * 所以 main.js 第一行就 import 本模块，其他地方的引用共用同一个模块实例。
 */

/** 宿主标识的名字，必须与宿主 C# 里注入的字符串一致 */
const HOST_SIGN = 'hana-wallpaper-host'

/** 宿主标识挂在 window 上的属性名 */
const HOST_FLAG = '__HANA_HOST__'

const webview = window.chrome?.webview

/** 读宿主在文档创建时注入的标识；没有或不认识就返回 null。 */
function readHostFlag() {
  try {
    const flag = window[HOST_FLAG]
    return flag && flag.name === HOST_SIGN ? flag : null
  } catch {
    return null
  }
}

/** 宿主标识，同步可读（注入早于页面脚本执行） */
const hostFlag = readHostFlag()

/**
 * 是不是我们自己的宿主。
 * 首屏靠标识；万一宿主版本比页面旧、没注入标识，收到它推的句柄时再补认一次
 * （Lively 之类不会发这种消息，所以这个兜底不会误判）。
 */
let confirmed = Boolean(hostFlag)

/** 确认宿主时通知一次，给需要切换 UI 的地方用 */
const availableCallbacks = new Set()

function confirmHost(source) {
  if (confirmed) return
  confirmed = true
  availableCallbacks.forEach((callback) => callback({ source, flag: hostFlag }))
}

/** 背景项 id → 宿主重建的已授权 FileSystemFileHandle */
const handles = new Map()

/** 订阅宿主推送的回调 */
const pushCallbacks = new Set()

webview?.addEventListener('message', (event) => {
  const data = event.data
  if (!data || data.type !== 'fs-handles' || !event.additionalObjects) return

  // 能收到这条消息，说明对面就是自己的宿主
  confirmHost('push')

  const ids = data.ids || []
  ids.forEach((id, index) => {
    const handle = event.additionalObjects[index]
    if (!handle) return

    const key = String(id)
    handles.set(key, handle)
    pushCallbacks.forEach((callback) => callback({ id: key, handle }))
  })
})

export const hostFS = {
  /**
   * 当前环境是不是我们自己的宿主。
   * 浏览器里、Lively Wallpaper 里都是 false，所有逻辑自动退回 picker。
   */
  get available() {
    return confirmed
  },

  /** 宿主标识内容（name / protocol / 能力位），不是自己的宿主时为 null。 */
  get info() {
    return hostFlag
  },

  /** 订阅“确认是宿主”这件事，返回取消函数。已经确认时立刻回调一次。 */
  onAvailable(callback) {
    if (confirmed) {
      callback({ source: 'sync', flag: hostFlag })
      return () => {}
    }

    availableCallbacks.add(callback)
    return () => availableCallbacks.delete(callback)
  },

  /** 取某个背景项对应的已授权句柄，没有就返回 undefined。 */
  get(id) {
    return handles.get(String(id))
  },

  /** 宿主是否已经推过句柄（用来决定要不要等）。 */
  get ready() {
    return handles.size > 0
  },

  /**
   * 请宿主弹文件对话框。选完的路径由宿主记下来，句柄通过 onPush 回来。
   * @param {string|number} id 背景项 id
   * @returns {boolean} 是否已发出请求（不是自己的宿主时返回 false，调用方应退回 picker）
   */
  pick(id) {
    if (!confirmed || !webview || id == null) return false

    webview.postMessage({ type: 'fs-pick', id: String(id) })
    return true
  },

  /**
   * 订阅宿主推来的句柄，返回取消函数。
   * 页面加载时宿主会推一次已知的全部背景，用户新选文件时会再推一次。
   */
  onPush(callback) {
    pushCallbacks.add(callback)
    return () => pushCallbacks.delete(callback)
  },

  /**
   * 等宿主把已授权的句柄推回来。已经有数据、或者不是宿主时立刻返回。
   * @param {number} timeout 最长等待毫秒数，超时也继续走，不阻塞页面
   */
  wait(timeout = 600) {
    if (!confirmed || handles.size > 0) return Promise.resolve()

    return new Promise((resolve) => {
      let settled = false
      const finish = () => {
        if (settled) return
        settled = true
        off()
        resolve()
      }
      const off = this.onPush(finish)
      setTimeout(finish, timeout)
    })
  }
}

export default hostFS
