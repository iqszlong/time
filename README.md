# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).


# 上传文件

上传文件主要依赖后端API和云服务两种，后端API属于服务器本地服务，云服务目前接入了七牛云、腾讯云等。
在`src/utils/upload.js`中整合了两种上传方式，可以根据需要自行调整。
上传每次只能上传一个文件，上传后返回上传后的文件信息。

## 本地文件上传

函数`upload`:拿到文件后通过api调用后端上传文件，返回上传后的文件信息。
dev开发环境下会使用`/file`进行代理访问上传后的文件url

参数: `Object`,`successFun`
```js

Object: {
    file: file, //文件对象（二进制）必传
    type: file.type,//文件类型 必传
}
// 其他参数:为NaiveUI组件库的Upload组件参数 可不传

successFun(file,data)
// file:上传后的文件信息
// data:上传后请求返回的数据
```

返回值: false 或 {file,data}

## 七牛云文件上传

函数`qiniuUpload`:拿到文件后通过调用七牛云SKD生成key后api上传文件，返回上传后的文件信息。
参数: `Object`,`successFun`

```js
Object: {
    file: file, //文件对象（二进制）必传
    type: file.type,//文件类型 必传
}
// 其他参数:为NaiveUI组件库的Upload组件参数 可不传


successFun(file,data)
// file:上传后的文件信息
// data:上传后请求返回的数据
```
返回值: 无

# 多语言

语言目录`src/lang`，核心文件`i18n.js`。

`currentLang`为当前语言，`defaultLang`为找不到`currentLang`对应值后的基础语言,`langList`为语言列表，用作语言切换。

## 多语言开发和编译

+ 中文简体语言包 zh-CN.json
+ 英文语言包 en-US.json
更多语言包请参考`src/lang`目录，自行添加到`i18n.js`中

### 语言包编译

编译变量

+ .env.china 国内版本环境变量
+ .env.global 海外版本环境变量

编译命令

+ dev:china 国内版开发版
+ dev:global 海外版开发版
+ build:china 编译后目录在dist/china
+ build:global 编译后目录在dist/global


# 亮暗主题

默认跟随系统主题：当前系统主题为深色主题，页面则为深色。

## 指定单一主题

指定亮或暗色主题需调整几个位置

1. 修改 `src/App.vue` 文件中的 `theme` 改为 `lightTheme`或 `darkTheme`，指定NaiveUI的主题。
2. 修改 `src/assets/variable.css` 中的 `color-scheme` 改为 `only light` 或 `only dark`，指定默认控件主题。
3. 指定为`light`亮色主题时，需要将页面中`dark:`开头的样式全部删除。直接给指定样式即可。暗色同理，不需要单独写`dark:`的`tailwind`样式。
4. `css`等样式文件中`@media (prefers-color-scheme: dark)`指定的暗色主题，需要注释或删除。

### 指定为亮色主题的示例及代码片段

`App.vue`

```vue
<script setup>
    import { useOsTheme, darkTheme, lightTheme, zhCN, dateZhCN } from "naive-ui";

    const theme =lightTheme;
</script>
```

`variable.css`

```vue
:root {
    /*指定为亮色主题*/
    color-scheme: only light;
}
```

`page.vue`

```vue
<template>
    <div class="text-white dark:text-black">示例文本</div>
</template>

改为
<template>
    <div class="text-white">示例文本</div>
</template>
```

`main.css`

```css
@media (prefers-color-scheme: dark) {
    /*
    :root {
        color-scheme: only dark;
    }
    */
}
```


# 离线缓存（Service Worker / PWA）

基于 `vite-plugin-pwa` + Workbox（`generateSW` 策略）。默认关闭，由环境变量控制，只作用于 `production` 和 `opixer` 两条构建线。

## 开关

```bash
# .env
VITE_ENABLE_PWA = false
```

要开启就在对应环境文件里覆盖：

```bash
# .env.production / .env.opixer
VITE_ENABLE_PWA = true
```

- 关闭时不生成 `sw.js`，页面也不注册任何 Service Worker，产物里只会多一个约 1KB 的空注册模块。
- 开启时产物根目录会多出 `sw.js` 和 `workbox-*.js`。
- 变量必须带 `VITE_` 前缀，否则 `loadEnv` 取不到，客户端 `import.meta.env` 也读不到。
- 插件常挂在 `plugins` 里，靠 `disable: !pwaEnabled` 切换。不要改成条件 push 插件，`virtual:pwa-register` 会解析失败导致构建中断。

## 缓存了什么

预缓存（precache）只收 `js / css / html / svg / png / ico / webp / jpg / jpeg`。

明确排除 `fonts/**` 和 `**/*.zip`：字体有 11MB，进 precache 会让首次安装多下载一大截，改由运行时缓存按需存。单文件上限 3MB（`maximumFileSizeToCacheInBytes`）。

导航回退为 `/index.html`，`/api/`、`/file/`、`/jsonserver/` 在拒绝名单里。

运行时缓存三组，缓存名都带 mode 后缀，避免多份构建在同一域名下互相覆盖：

| 规则 | 策略 | 缓存名 |
| --- | --- | --- |
| `/fonts/**` | CacheFirst，一年 | `time-fonts-${mode}` |
| `fonts.bunny.net` | StaleWhileRevalidate，30 天 | `time-webfonts-${mode}` |
| 图片请求 | StaleWhileRevalidate，14 天 | `time-images-${mode}` |

## 更新策略

`registerType: 'prompt'`，新版本装好后不会自己抢控制权。注册代码在 `src/main.js`：

- `immediate: false`，等首屏渲染完再注册，不和页面抢带宽。
- `onNeedRefresh` 触发时弹一个 sonner 提示，点「更新」才 `updateSW(true)` 刷新页面。
- `onRegisteredSW` 里挂了每小时一次的 `registration.update()`，页面常开也能发现新版本。

## 部署要求（Cloudflare Workers 静态资产）

`public/_headers` 会随构建复制到产物根目录，Cloudflare 把它当元文件解析，不对外提供：

```txt
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache

/workbox-*.js
  Cache-Control: public, max-age=31536000, immutable
```

- `/assets/*` 能长缓存，是因为构建产物文件名带内容哈希，内容一变文件名就变。对外引用它的是 `index.html`，而 `index.html` 保持 `max-age=0, must-revalidate`。
- `sw.js` 名字不变，必须每次回源校验，否则客户端会卡在旧版本。
- `public/` 下原样拷贝的资源（`logo.svg`、`avatar.jpg`、`spark-md5.min.js`、`fonts/**`）名字不变，不要给它们加长缓存。
- 规则是叠加而不是覆盖：同一请求命中多条时头会拼接，`Cache-Control` 会产生冲突指令。所以这里只写精确前缀，不加 `/*` 兜底；真要加，先用 `! Cache-Control` 清掉前面加的。
- `_headers` 的内容随部署上传，改完必须重新部署才生效。
- 如果哪天给 Worker 配上脚本、`run_worker_first` 或 SSR，`_headers` 就不作用于 Worker 代码生成的响应，需要在代码里自己加头。纯静态资产的 Worker 没有这个限制。

## 验证

```bash
curl -I https://time.iqszlong.dpdns.org/sw.js          # cache-control: no-cache
curl -I https://time.iqszlong.dpdns.org/assets/xxx.js   # public, max-age=31536000, immutable
curl -I https://time.iqszlong.dpdns.org/                # public, max-age=0, must-revalidate
```

浏览器控制台：

```js
const reg = await navigator.serviceWorker.getRegistration()
console.log(reg?.active?.state, reg?.active?.scriptURL)  // activated, .../sw.js
console.log(!!navigator.serviceWorker.controller)         // 刷新一次后应为 true
console.log(await caches.keys())                          // workbox-precache-v2-<origin>
```

`pnpm dev` 下不会有 Service Worker：`devOptions.enabled` 是关闭的，注册守卫也要求 `PROD`。本地验证用 `pnpm build && pnpm preview`，opixer 用 `pnpm build:opixer && pnpm preview:opixer`。

## 注意事项

- **不要加 video / audio 的缓存规则。** `<video>` 请求带 `Range` 头，被 SW 整段缓存会破坏 seek 和播放行为。默认不拦截才是对的。
- **不要缓存带 Authorization 的接口响应。** Cache Storage 同源全员可读，同机换账号会串数据。`/api` 保持在 `navigateFallbackDenylist` 里。
- **关掉开关不会卸掉用户机器上已经装好的 SW。** 改回 `false` 之后新构建不再有 `sw.js`，但老用户浏览器里注册的 SW 仍然活着，继续返回缓存。要真正下线，得临时把 `selfDestroying` 设为 `true` 发一版，它会自动注销并清空缓存，之后再切回关闭。
- **同域多份构建要小心 scope。** 缓存名带 mode 不会串，但 scope 是路径级的：如果以后 `production` 和 `opixer` 挂在同一个域名的不同子路径下，根路径的 SW 会接管子路径的导航，需要显式设 `scope` 或补 `navigateFallbackDenylist`。
- **排障顺序**：先确认是不是忘了重新部署（`_headers` 和 `sw.js` 都以线上为准）；再在 DevTools 的 Application → Service Workers 里 Unregister，并清掉 Cache Storage；最后才怀疑规则写错。

