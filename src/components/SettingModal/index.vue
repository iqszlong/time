<template>
    <Dialog v-model:open="visibleModal" @update:open="onOpenChange" class="setting-modal">
        <DialogTrigger as-child>
            <Button variant="outline" size="icon">
                <Settings2 />
            </Button>
        </DialogTrigger>
        <DialogContent class="p-0 sm:max-w-5xl max-h-[86dvh] overflow-hidden"
            @interact-outside="event => event.preventDefault()">
            <DialogHeader class="px-4 pt-4 sr-only">
                <DialogTitle>设置</DialogTitle>
                <DialogDescription>
                    页面设置时间、背景图片。
                </DialogDescription>
            </DialogHeader>

            <SidebarProvider defaultOpen class="setting-side-bar items-start [--sidebar-width:10rem]!">
                <Sidebar collapsible="offcanvas">
                    <SidebarHeader class="flex flex-row gap-2 items-center">
                        <Settings2 size="16" />
                        <h1 class="font-bold">设置</h1>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem v-for="item in menuList" :key="item.name">
                                        <SidebarMenuButton class="cursor-pointer" :is-active="item.name === currentMenu"
                                            @click="handleClickMenu(item)">
                                            <span class="flex items-center gap-2 ">
                                                <component v-if="item.icon" :is="item.icon" class="size-4" />
                                                <span>{{ item.title }}</span>
                                            </span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <main class="flex flex-col flex-1">
                        <header class="flex h-12 shrink-0 items-center gap-2">
                            <div class="flex px-4 flex-row items-center gap-2">
                                <SidebarTrigger class="-ml-1" />
                                <h2 class="font-bold shrink-0">{{ currentItem.title }}</h2>

                                <template v-if="currentMenu == 'background'">
                                    <p class="text-sm text-muted-foreground invisible sm:visible">
                                        使用本地文件或远程文件链接，设置内容均保存在本地，不会上传到服务器。</p>
                                </template>
                            </div>
                        </header>
                        <section class="h-[calc(86dvh-64px-48px)] overflow-y-auto p-4">
                            <template v-if="currentMenu == 'time'">
                                <TimeSettings :tempConfig="tempConfig" />
                            </template>
                            <template v-if="currentMenu == 'background'">
                                <BackgroundSettings :tempConfig="tempConfig" v-on="backgroundEventHandlers" />

                                <AlertDialog v-model:open="deleteConfirm">

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>确定删除吗?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                删除当前背景，将无法恢复。是否继续？
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>取消</AlertDialogCancel>
                                            <AlertDialogAction @click="onDelete">确定删除
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog v-model:open="resetConfirm">

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>确定恢复默认吗?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                恢复默认配置，会覆盖当前的设置
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>取消</AlertDialogCancel>
                                            <AlertDialogAction @click="onReset">确定恢复</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </template>

                            <template v-if="currentMenu == 'setting'">
                                <GeneralSettings :tempConfig="tempConfig" />
                            </template>
                        </section>
                        <DialogFooter class="h-16 px-4 items-center flex-row">

                            <Button type="submit" @click="onSubmit">保存</Button>

                            <DialogClose as-child>
                                <Button variant="outline">关闭</Button>
                            </DialogClose>



                        </DialogFooter>
                    </main>

                </SidebarInset>
            </SidebarProvider>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { Settings2 } from 'lucide-vue-next';
import { useMenuStore } from '@/stores/menu';
import { useConfigStore } from '@/stores/config'
import { useBackgroundStore } from '@/stores/background'
import { toast } from 'vue-sonner'


const { dayjs } = utils
const configStore = useConfigStore();
const { updateTimeDisplay, updateConfig } = configStore
const { config, defaultData: defaultConfig, videoPlay } = storeToRefs(configStore)
const backgroundStore = useBackgroundStore()
const { updateAllBackgrounds, defaultData, getFileURL, addNewBackground, removeBackground } = backgroundStore
const { currentBackgroundId, currentBackground, backgrounds, total } = storeToRefs(backgroundStore)
const menuStore = useMenuStore()
const { setMenu } = menuStore
const { currentItem, currentMenu, menuList } = storeToRefs(menuStore)


let tempConfig = reactive({ timerConfig: {}, backgroundConfigs: [], currentBackground: {} })
const visibleModal = ref(false)
const resetConfirm = ref(false)
const deleteConfirm = ref(false)

onBeforeMount(async () => {

})

onMounted(async () => {
    // console.trace('onMounted');
})

const onOpenChange = async (open) => {
    if (open) {
        videoPlay.value = false
        await initTempConfig()

    } else {
        resetConfig()
        videoPlay.value = true
    }
}

const resetConfig = () => {
    tempConfig.timerConfig = {}
    tempConfig.currentBackground = {}
    tempConfig.backgroundConfigs = []
}

const initTempConfig = async () => {
    Object.assign(tempConfig.timerConfig, { ...config.value })
    Object.assign(tempConfig.backgroundConfigs, [...backgrounds.value])
    updateTempCurrentConfig(currentBackground.value)
}

const updateTempCurrentConfig = (background) => {
    Object.assign(tempConfig.currentBackground, { ...background })
    // console.log(tempConfig);
}


const onSubmit = async () => {
    updateTempBackgrounds(true)
    // console.log(tempConfig);
    const backgroundsData = []
    for (const background of tempConfig.backgroundConfigs) {
        backgroundsData.push({ ...background })
    }
    // console.log(backgroundsData);
    // return
    try {
        await updateAllBackgrounds(backgroundsData)
        await updateConfig({ ...tempConfig.timerConfig })
        toast.success('更新成功', {
            position: 'top-center'
        })
    } catch (error) {
        console.error('更新失败:', error)
        toast.error('更新失败', {
            description: error.message,
            position: 'top-center'
        })
    }
}

const onReset = () => {
    tempConfig.timerConfig = { ...defaultConfig }
    updateTempCurrentConfig(defaultData)
    updateTempBackgrounds()
}

const handleFile = (e) => {
    const [file] = e.target.files
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        tempConfig.currentBackground.filename = file.name
        tempConfig.currentBackground.source = file
        tempConfig.currentBackground.sourcePath = reader.result
    }
}

const handleFilesystem = async (e) => {
    const { handle } = e.detail[0];
    // console.log(handle);
    // selectedFileName.value = handle.name
    tempConfig.currentBackground.filename = handle.name
    tempConfig.currentBackground.source = handle;
    tempConfig.currentBackground.sourcePath = await getFileURL(handle)
    // console.log(tempConfig);

}

const handleUrl = (e) => {
    const value = e.target.value.split('?')[0]
    if (!value) return
    // 如果url是编码过的，则解码
    if (value.includes('%')) {
        value = decodeURI(value)
    }
    tempConfig.currentBackground.filename = value.split('/').pop()
    tempConfig.currentBackground.source = value
    tempConfig.currentBackground.sourcePath = value
    // console.log(tempConfig);
}


const handleMaskValue = (values) => {
    // console.log(values);
    tempConfig.currentBackground.maskFrom = values[0]
    tempConfig.currentBackground.maskTo = values[1]
}

const handleVolumeValue = (value) => {
    // console.log(value);
    tempConfig.currentBackground.volume = value[0]
}

const toggleMute = () => {
    tempConfig.currentBackground.muted = !tempConfig.currentBackground.muted
}


const handleNew = async () => {
    const successId = await addNewBackground()
    if (successId) {
        currentBackgroundId.value = successId
        toast.success('添加新背景成功', {
            position: 'top-center'
        })
        resetConfig()
        await initTempConfig()
    }
}

const onDelete = async () => {
    const success = await removeBackground(currentBackgroundId.value)
    if (success) {
        console.log(success, backgrounds.value);
        currentBackgroundId.value = backgrounds.value[0]?.id

        toast.success('删除当前背景成功', {
            position: 'top-center'
        })
        resetConfig()
        await initTempConfig()
    }
}

const handleClickMenu = (item) => {
    setMenu(item.name)
}


const updateTempBackgrounds = (needUpdate = false) => {
    // 更新临时列表
    const index = tempConfig.backgroundConfigs.findIndex(item => item.id == tempConfig.currentBackground.id)
    tempConfig.backgroundConfigs[index] = { ...tempConfig.currentBackground }
    if (needUpdate) {
        tempConfig.backgroundConfigs[index].updateTime = dayjs().toDate()
    }
    // console.log(index, tempConfig.backgroundConfigs[index]);
}


const changeTempConfig = async (id) => {
    // console.log(id);
    if (!id || tempConfig.currentBackground.id == id) return
    updateTempBackgrounds()
    // 切换当前背景
    currentBackgroundId.value = id
    const item = tempConfig.backgroundConfigs.find(item => item.id == id)
    // 读取新当前背景配置
    updateTempCurrentConfig(item || currentBackground.value)
}

const backgroundEventHandlers = {
    changeTempConfig,
    handleNew,
    handleFile,
    handleFilesystem,
    handleUrl,
    handleMaskValue,
    handleVolumeValue,
    toggleMute,
    handleReset: () => resetConfirm.value = true,
    handleDelete: () => deleteConfirm.value = true,

}

</script>

<style scoped>

</style>