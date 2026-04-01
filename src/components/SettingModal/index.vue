<template>
    <Dialog v-model:open="visibleModal" @update:open="onOpenChange" class="setting-modal">
        <DialogTrigger as-child>
            <Button variant="outline" size="icon">
                <Settings2 />
            </Button>
        </DialogTrigger>
        <DialogOverlay class="setting-overlay">
            <DialogContent class="p-0 sm:max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader class="px-4 pt-4 sr-only">
                    <DialogTitle>设置</DialogTitle>
                    <DialogDescription>
                        页面设置时间、背景图片。
                    </DialogDescription>
                </DialogHeader>

                <SidebarProvider defaultOpen class="setting-side-bar items-start ![--sidebar-width:10rem]">
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
                                            <SidebarMenuButton class="cursor-pointer"
                                                :is-active="item.name === currentMenu" @click="handleClick(item)">
                                                <span class="flex items-center gap-2 ">
                                                    <!-- <component :is="item.icon" /> -->
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
                            <section class="h-[calc(80vh-64px-48px)] overflow-y-auto p-4">
                                <FieldSet v-if="currentMenu == 'time'">

                                    <div class="grid grid-flow-row gap-4">
                                        <FieldGroup>
                                            <FieldSet>
                                                <FieldLegend class="font-bold sr-only">时间设置</FieldLegend>
                                                <Field>
                                                    <FieldLabel for="display">时间格式</FieldLabel>
                                                    <ToggleGroup id="display"
                                                        v-model="tempConfig.timerConfig.timeDisplay" type="single">
                                                        <ToggleGroupItem value="12">
                                                            12小时
                                                        </ToggleGroupItem>
                                                        <ToggleGroupItem value="24">
                                                            24小时
                                                        </ToggleGroupItem>
                                                    </ToggleGroup>
                                                </Field>
                                            </FieldSet>
                                        </FieldGroup>

                                        <!-- <FieldSeparator /> -->
                                    </div>

                                </FieldSet>
                                <FieldSet v-if="currentMenu == 'background'">

                                    <div class="grid grid-cols-[400px_auto] gap-4">
                                        <div class="grid grid-flow-row gap-4">
                                            <div>
                                                <div class="mb-2">当前背景</div>
                                                <div class="flex  items-center gap-2">
                                             
                                                    <Select v-model="currentBackgroundId"
                                                        @update:modelValue="changeTempConfig">
                                                        <SelectTrigger class="w-[calc(400px-36px-8px)]">
                                                            <SelectValue placeholder="Select a background"
                                                                class="w-[80%] text-ellipsis whitespace-nowrap overflow-hidden" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <template v-for="item in tempConfig.backgroundConfigs"
                                                                :key="item.id">
                                                                <SelectItem :value="item.id">{{ item.filename }}
                                                                </SelectItem>
                                                            </template>
                                                        </SelectContent>
                                                    </Select>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger as-child>
                                                            <Button variant="outline" size="icon">
                                                                <EllipsisVertical />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem @click="handleNew">
                                                                <Plus />添加新背景
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem @click="() => deleteConfirm = true"
                                                                :disabled="total <= 1">
                                                                <Trash />删除当前背景
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                            <Separator />

                                            <FieldGroup>
                                                <FieldSet>

                                                    <Tabs v-model:modelValue="tempConfig.currentBackground.sourceType">
                                                        <TabsList class="w-full">
                                                            <TabsTrigger value="local">
                                                                本地文件
                                                            </TabsTrigger>
                                                            <TabsTrigger value="url">
                                                                远程链接
                                                            </TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="local">
                                                            <template v-if="isFilePicker">
                                                                <Field>
                                                                    <div class="flex gap-2">
                                                                        <div class="flex-1 w-[calc(400px-90px-8px)]">
                                                                            <z-filesystem id="file"
                                                                                @open="handleFilesystem"
                                                                                :openOpt="JSON.stringify(fileTypeOpt)"
                                                                                style="width: 100%; overflow: hidden;">

                                                                                <Button variant="outline" class="w-full">
                                                                                    <span
                                                                                        class="block w-[90%] text-ellipsis whitespace-nowrap overflow-hidden">
                                                                                        {{ selectedFileName ?? '选择文件' }}
                                                                                    </span>
                                                                                </Button>

                                                                            </z-filesystem>
                                                                        </div>
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger as-child>
                                                                                    <Button variant="outline"
                                                                                        @click="needPermission">授权访问</Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    使用本地文件时，显示不正常请点击此按钮授权访问。<br />
                                                                                    授权访问后，程序将能够访问您的文件系统，以获取背景图片。<br />
                                                                                    请确保您信任该程序，以避免潜在的安全风险。
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    </div>
                                                                    <FieldDescription class="text-xs">
                                                                        文件格式：jpg、png、gif、jpeg、bmp、webp、mp4、webm、m4v
                                                                    </FieldDescription>

                                                                </Field>
                                                            </template>
                                                            <template v-else>
                                                                <Field>
                                                                    <Input id="picture" type="file" accept="image/*"
                                                                        @change="handleFile" />
                                                                    <FieldDescription class="text-xs">
                                                                        文件格式：jpg、png、gif、jpeg、bmp、webp
                                                                    </FieldDescription>
                                                                </Field>
                                                            </template>
                                                        </TabsContent>
                                                        <TabsContent value="url">
                                                            <Field>
                                                                <Input id="url" type="text" placeholder="https://"
                                                                    @blur="handleUrl" @focus="(e) => e.target.select()"
                                                                    :modelValue="urlValue" />
                                                                <FieldDescription class="text-xs">
                                                                    文件格式：jpg、png、gif、jpeg、bmp、webp、mp4、webm、m4v
                                                                </FieldDescription>
                                                            </Field>
                                                        </TabsContent>
                                                    </Tabs>


                                                    <div class="grid grid-cols-2 gap-4">

                                                        <Field>
                                                            <FieldLabel for="order">显示层级</FieldLabel>
                                                            <Input id="order"
                                                                v-model="tempConfig.currentBackground.order"
                                                                type="number" placeholder="显示层级" />
                                                            <FieldDescription class="text-xs">
                                                                层级越大，显示越靠前
                                                            </FieldDescription>
                                                        </Field>

                                                        <Field>
                                                            <FieldLabel for="fit">填充方式</FieldLabel>
                                                            <Select id="fit" v-model="tempConfig.currentBackground.fit">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem v-for="item in fitOptions"
                                                                        :key="item.value" :value="item.value">
                                                                        {{ item.label }} ({{ item.value }})
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </Field>

                                                        <Field>
                                                            <FieldLabel for="position">水平位置</FieldLabel>
                                                            <Select id="position"
                                                                v-model="tempConfig.currentBackground.hposition">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem
                                                                        v-for="item in postionOptions.filter(item => item.type.includes('horizontal'))"
                                                                        :key="item.value" :value="item.value">
                                                                        {{ item.label }}
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </Field>
                                                        <Field>
                                                            <FieldLabel for="position">垂直位置</FieldLabel>
                                                            <Select id="position"
                                                                v-model="tempConfig.currentBackground.vposition">
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem
                                                                        v-for="item in postionOptions.filter(item => item.type.includes('vertical'))"
                                                                        :key="item.value" :value="item.value">
                                                                        {{ item.label }}
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </Field>
                                                    </div>


                                                    <Field>
                                                        <FieldLabel for="mask">背景遮挡</FieldLabel>
                                                        <div class="flex items-center space-x-2">
                                                            <Switch id="mask"
                                                                v-model="tempConfig.currentBackground.maskEnabled" />
                                                            <span>{{ maskValue[0] }}</span>
                                                            <Slider :default-value="[0, 100]" v-model="maskValue"
                                                                :min="0" :max="100" :step="1"
                                                                :disabled="!tempConfig.currentBackground.maskEnabled"
                                                                @update:modelValue="handleMaskValue" />
                                                            <span>{{ maskValue[1] }}</span>
                                                        </div>

                                                    </Field>
                                                </FieldSet>
                                            </FieldGroup>
                                        </div>
                                        <div>
                                            <div class="sticky top-0">

                                                <div class="mb-2">预览</div>
                                                <div
                                                    class="preview-wrapper border-border border rounded-md overflow-hidden">
                                                    <Preview :source="tempConfig.currentBackground"></Preview>
                                                </div>
                                                <div v-if="tempConfig.currentBackground.updateTime"
                                                    class="text-xs mt-1 text-muted-foreground">
                                                    更新日期: 
                                                    {{
                                                        dayjs(tempConfig.currentBackground.updateTime).format('YYYY-MM-DD HH:mm:ss')
                                                    }}
                                                </div>

                                            </div>
                                        </div>


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
                                                    <AlertDialogAction @click="handleDelete">确定删除
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>


                                    </div>


                                </FieldSet>
                            </section>
                            <DialogFooter class="h-16 px-4 items-center flex-row">

                                <Button type="submit" @click="onSubmit">保存</Button>

                                <DialogClose as-child>
                                    <Button variant="outline">取消</Button>
                                </DialogClose>

                                <AlertDialog v-model:open="resetConfirm">
                                    <AlertDialogTrigger as-child>
                                        <Button type="reset" variant="outline" :disabled="isDefault">恢复默认</Button>
                                    </AlertDialogTrigger>
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

                            </DialogFooter>
                        </main>

                    </SidebarInset>
                </SidebarProvider>
            </DialogContent>
        </DialogOverlay>
    </Dialog>
</template>

<script setup>
import { FileImage, Link, Settings2, Plus, Trash, Edit, EllipsisVertical } from 'lucide-vue-next';
import { useMenuStore } from '@/stores/menu';
import { useConfigStore } from '@/stores/config'
import { fit, position } from '@/services/mapping/config'
import { useBackgroundStore } from '@/stores/background'
import { toast } from 'vue-sonner'

const { dayjs } = utils
const configStore = useConfigStore();
const { updateTimeDisplay } = configStore
const { config, videoPlay } = storeToRefs(configStore)
const backgroundStore = useBackgroundStore()
const { updateBackground, updateAllBackgrounds, defaultData, verifyPermission, getFileURL, resetBackground, loadBackgroundById, addNewBackground, removeBackground } = backgroundStore
const { currentBackgroundId, currentBackground, backgrounds, isFilePicker, isDefault, total } = storeToRefs(backgroundStore)
const menuStore = useMenuStore()
const { setMenu } = menuStore
const { currentItem, currentMenu, menuList } = storeToRefs(menuStore)


let tempConfig = reactive({ timerConfig: {}, backgroundConfigs: [], currentBackground: {} })
const visibleModal = ref(false)
const resetConfirm = ref(false)
const deleteConfirm = ref(false)
const urlValue = ref('')
const maskValue = ref([0])
const selectedFileName = ref(null)

const fileTypeOpt = {
    types: [
        {
            description: "Images",
            accept: {
                "image/jpeg": [".jpg"],
                "image/png": [".png"],
                "image/gif": [".gif"],
                "image/bmp": [".bmp"],
                "image/webp": [".webp"],
            },
        },
        {
            description: "Videos",
            accept: {
                "video/mp4": [".mp4"],
                "video/x-matroska": [".mkv"],
                "video/mp4v-es": [".m4v"],
                "video/webm": [".webm"],
            },
        },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
}



const fitOptions = computed(() => {
    return Object.keys(fit).map(key => {
        return {
            label: fit[key]['zh-CN'],
            value: fit[key].value
        }
    })
})
const postionOptions = computed(() => {
    return Object.keys(position).map(key => {
        return {
            label: position[key]['zh-CN'],
            value: position[key].value,
            type: position[key].type
        }
    })
})




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
        selectedFileName.value = null
        tempConfig.timerConfig = {}
        tempConfig.currentBackground = {}
        tempConfig.backgroundConfigs = []
        videoPlay.value = true
    }
}

const initTempConfig = async () => {
    Object.assign(tempConfig.timerConfig, { ...config.value })
    Object.assign(tempConfig.backgroundConfigs, [...backgrounds.value])
    updateTempCurrentConfig(currentBackground.value)
}

const updateTempCurrentConfig = (background) => {
    Object.assign(tempConfig.currentBackground, { ...background })
    // console.log(tempConfig);
    maskValue.value = [tempConfig.currentBackground.maskFrom, tempConfig.currentBackground.maskTo]
    if (tempConfig.currentBackground.sourceType === 'url') {
        urlValue.value = tempConfig.currentBackground.sourcePath
    }
}

const onSubmit = async () => {
    updateTempBackgrounds()
    // console.log(tempConfig);
    const backgroundsData = []
    for (const background of tempConfig.backgroundConfigs) {
        backgroundsData.push({ ...background })
    }
    // console.log(backgroundsData);
    // return
    try {
        await updateAllBackgrounds(backgroundsData)
        // for (const background of backgroundsData) {
        //     // console.log(background);
        //     await updateBackground(background)
        // }
        await updateTimeDisplay(config.value.id, tempConfig.timerConfig.timeDisplay)
        toast.success('更新成功', {
            position: 'top-center'
        })
        visibleModal.value = false
        if (!visiblePlay.value) videoPlay.value = true
    } catch (error) {
        console.error('更新失败:', error)
        toast.error('更新失败', {
            description: error.message,
            position: 'top-center'
        })
    }
}

const onReset = () => {
    updateTempCurrentConfig(defaultData)
    console.log(tempConfig.currentBackground)
    updateTempBackgrounds()
    // resetBackground()
    // visibleModal.value = false
}

const handleFile = (e) => {
    const [file] = e.target.files
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        tempConfig.currentBackground.filename = file.name
        tempConfig.currentBackground.source = reader.result
        tempConfig.currentBackground.sourcePath = reader.result
    }
}

const handleFilesystem = async (e) => {
    const { handle } = e.detail[0];
    // console.log(handle);
    selectedFileName.value = handle.name
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

const handleNew = async () => {
    const successId = await addNewBackground()
    if (successId) {
        currentBackgroundId.value = successId
        toast.success('添加新背景成功', {
            position: 'top-center'
        })
        await initTempConfig()
    }
}

const handleDelete = async () => {
    const success = await removeBackground(tempConfig.currentBackground.id)
    if (success) {
        currentBackgroundId.value = backgrounds.value[0]?.id
        toast.success('删除当前背景成功', {
            position: 'top-center'
        })
        await initTempConfig()
    }
}

const handleClick = (item) => {
    setMenu(item.name)
}



const needPermission = async () => {
    if (tempConfig.currentBackground.sourceType == 'url') return
    const userPermission = await verifyPermission(tempConfig.currentBackground.source, false);
    if (userPermission) {
        toast.success('已授权成功，稍后将自动刷新页面', {
            position: 'top-center', onAutoClose: () => {
                location.reload();
            }
        })
    }
}

const updateTempBackgrounds = () => {
    // 更新临时列表
    const index = tempConfig.backgroundConfigs.findIndex(item => item.id == tempConfig.currentBackground.id)
    tempConfig.backgroundConfigs[index] = tempConfig.currentBackground
}

const changeTempConfig = async (id) => {
    // console.log(id);
    if (!id || tempConfig.currentBackground.id == id) return
    updateTempBackgrounds()
    // 切换当前背景
    currentBackgroundId.value = id
    // 读取新当前背景配置
    updateTempCurrentConfig(currentBackground.value)
}

</script>

<style scoped>
.setting-overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    overflow-y: auto;
}

.preview-wrapper {
    aspect-ratio: 16 / 9;
}
</style>