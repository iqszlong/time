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
