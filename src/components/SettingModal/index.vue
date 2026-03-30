<template>
    <Dialog v-model:open="visible" @update:open="onOpenChange" class="setting-modal">
        <DialogTrigger as-child>
            <Button variant="outline" size="icon">
                <Settings2 />
            </Button>
        </DialogTrigger>
        <DialogContent class="p-0 sm:max-w-4xl max-h-[60vh] overflow-hidden">
            <DialogHeader class="px-4 pt-4 sr-only">
                <DialogTitle>设置</DialogTitle>
                <DialogDescription>
                    页面设置时间、背景图片。
                </DialogDescription>
            </DialogHeader>

            <SidebarProvider class="items-start">
                <Sidebar collapsible="none" class="hidden md:flex w-32">
                    <SidebarHeader>
                        <h1 class="font-bold">设置</h1>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem v-for="item in menuList" :key="item.name">
                                        <SidebarMenuButton class="cursor-pointer" :is-active="item.name === currentMenu" @click="handleClick(item)">
                                            <span class="flex items-center gap-2 " >
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
                <main class="flex flex-col flex-1">
                    <header
                        class="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div class="flex items-center gap-2 px-4 ">
                            <h2>{{ currentItem.title }}</h2>
                            <template v-if="currentMenu == 'time'">
                                <p class="text-sm text-muted-foreground">更改时间显示格式</p>
                            </template>
                            <template v-else>
                                <p class="text-sm text-muted-foreground">使用本地文件或远程文件链接，设置内容均保存在本地，不会上传到服务器。</p>
                            </template>
                        </div>
                    </header>
                    <section class="h-[calc(60vh-64px-48px)] overflow-y-auto p-4">
                        <FieldSet v-if="currentMenu == 'time'">

                            <div class="grid grid-flow-row gap-4">
                                <FieldGroup>
                                    <FieldSet>
                                        <FieldLegend class="font-bold sr-only">时间设置</FieldLegend>
                                        <Field>
                                            <FieldLabel for="display">时间格式</FieldLabel>
                                            <ToggleGroup id="display" v-model="tempConfig.timeDisplay" type="single">
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

                            <div class="grid grid-cols-[1fr_200px] gap-4">
                                <div class="grid grid-flow-row gap-4">
                                    <div>
                                        <div class="mb-2">当前背景</div>
                                        <div class="flex items-center gap-2">
                                            <Select v-model="currentBackgroundId" @update:modelValue="changeTempConfig">
                                                <SelectTrigger class="flex-1 w-full">
                                                    <SelectValue placeholder="Select a background"
                                                        class="block max-w-[200px] truncate" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <template v-for="item in backgrounds" :key="item.id">
                                                        <SelectItem :value="item.id">{{ item.filename }}
                                                        </SelectItem>
                                                    </template>
                                                </SelectContent>
                                            </Select>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger as-child>
                                                    <Button variant="outline" size="icon" >
                                                        <EllipsisVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem @click="handleNew"><Plus />添加新背景</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem @click="handleDelete" :disabled="total <= 1"><Trash />删除当前背景</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <Separator />

                                    <FieldGroup>
                                        <FieldSet>

                                            <Tabs v-model:modelValue="tabValue">
                                                <TabsList class="w-full">
                                                    <TabsTrigger value="local">
                                                        本地
                                                    </TabsTrigger>
                                                    <TabsTrigger value="url">
                                                        远程
                                                    </TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="local">
                                                    <template v-if="isFilePicker">
                                                        <Field>
                                                            <div class="flex gap-2">

                                                                <z-filesystem id="file" @open="handleFilesystem"
                                                                    :open-opt="JSON.stringify(fileTypeOpt)"
                                                                    style="width: 100%;">
                                                                    <Button variant="outline"
                                                                        class="w-full">选择文件</Button>
                                                                </z-filesystem>

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
                                                            @blur="handleUrl" :modelValue="urlValue" />
                                                        <FieldDescription class="text-xs">
                                                            文件格式：jpg、png、gif、jpeg、bmp、webp、mp4、webm、m4v
                                                        </FieldDescription>
                                                    </Field>
                                                </TabsContent>
                                            </Tabs>


                                            <Field>
                                                <FieldLabel for="fit">填充方式</FieldLabel>
                                                <Select id="fit" v-model="tempConfig.fit">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem v-for="item in fitOptions" :key="item.value"
                                                            :value="item.value">
                                                            {{ item.label }} ({{ item.value }})
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </Field>


                                            <div class="grid grid-cols-2 gap-4">
                                                <Field>
                                                    <FieldLabel for="position">水平位置</FieldLabel>
                                                    <Select id="position" v-model="tempConfig.hposition">
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
                                                    <Select id="position" v-model="tempConfig.vposition">
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
                                                    <Switch id="mask" v-model="tempConfig.maskEnabled" />
                                                    <span>{{ maskValue[0] }}</span>
                                                    <Slider :default-value="[0, 100]" v-model="maskValue" :min="0"
                                                        :max="100" :step="1" :disabled="!tempConfig.maskEnabled"
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
                                        <div class="preview-wrapper border-border border rounded-md overflow-hidden">
                                            <Preview :source="tempConfig"></Preview>
                                        </div>


                                    </div>
                                </div>


                            </div>


                        </FieldSet>
                    </section>
                    <DialogFooter class="h-16 px-4 items-center">
                        <DialogClose as-child>
                            <Button type="submit" @click="onSubmit">保存</Button>
                        </DialogClose>
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


            </SidebarProvider>
        </DialogContent>
    </Dialog>


</template>

<script setup>
import { FileImage, Link, Settings2, Plus, Trash, Edit, EllipsisVertical } from 'lucide-vue-next';
import { useMenuStore } from '@/stores/menu';
import { useConfigStore } from '@/stores/config'
import { fit, position } from '@/services/mapping/config'
import { useBackgroundStore } from '@/stores/background'
import { toast } from 'vue-sonner'
const configStore = useConfigStore();
const { updateTimeDisplay } = configStore
const { config } = storeToRefs(configStore)
const backgroundStore = useBackgroundStore()
const { updateBackground, defaultData, verifyPermission, getFileURL, resetBackground, loadBackgroundById, addNewBackground, removeBackground } = backgroundStore
const { currentBackground, backgrounds, isFilePicker, isDefault, total } = storeToRefs(backgroundStore)
const menuStore = useMenuStore()
const { setMenu } = menuStore
const { currentItem, currentMenu, menuList } = storeToRefs(menuStore)

let tempConfig = reactive({ ...defaultData, sourcePath: null })
const visible = ref(false)
const resetConfirm = ref(false)
const currentBackgroundId = ref('')

const fileTypeOpt = {
    types: [
        {
            description: "Images",
            accept: {
                "image/*": [".jpg", ".png", ".gif", ".jpeg", ".bmp", ".webp"],
            },
        },
        {
            description: "Videos",
            accept: {
                "video/*": [".mp4", ".mkv", ".m4v", ".webm"],
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

const tabValue = ref('upload')
const urlValue = ref('')
const maskValue = ref([0])


onBeforeMount(async () => {

})

onMounted(async () => {
    // console.trace('onMounted');



})

const onOpenChange = async (open) => {
    if (open) {
        await initTempConfig()
    }
}

const initTempConfig = async (background) => {
    // console.log(currentBackground.value);
    Object.assign(tempConfig, {...config.value})
    Object.assign(tempConfig, {...(background ?? backgrounds.value[0])})
    // console.log(tempConfig);
    currentBackgroundId.value = tempConfig.id
    // console.log(tempConfig.sourcePath);
    tabValue.value = tempConfig.sourceType
    maskValue.value = [tempConfig.maskFrom, tempConfig.maskTo]
    if (tempConfig.sourceType === 'url') {
        urlValue.value = tempConfig.sourcePath
    }
}

const onSubmit = () => {
    // console.trace(tempConfig);
    // 如果url是编码过的，则解码
    if (tabValue.value === 'url' && tempConfig.source.includes('%')) {
        tempConfig.source = decodeURI(tempConfig.source)
    }
    tempConfig.sourceType = tabValue.value
    const data = { ...tempConfig }
    // delete data.sourcePath
    delete data.timeDisplay
    delete data.naiveTheme
    delete data.language
    delete data.location
    // console.log(data);
    // return
    updateBackground(data)
    updateTimeDisplay(config.value.id, tempConfig.timeDisplay)
}

const onReset = () => {
    // resetConfig()
    Object.assign(tempConfig, { ...defaultData, sourcePath: defaultData.source })
    resetBackground()
    visible.value = false
}

const handleFile = (e) => {
    const [file] = e.target.files
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        tempConfig.filename = file.name
        tempConfig.source = reader.result
        tempConfig.sourcePath = reader.result
    }
}

const handleFilesystem = async (e) => {
    const { handle } = e.detail[0];
    // console.log(handle);
    tempConfig.filename = handle.name
    tempConfig.source = handle;
    tempConfig.sourcePath = await getFileURL(handle)    
    // console.log(tempConfig);

}

const handleUrl = (e) => {
    const value = e.target.value.split('?')[0]
    if (!value) return
    tempConfig.filename = value.split('/').pop()
    tempConfig.source = value
    tempConfig.sourcePath = value
    // console.log(tempConfig);
}


const handleMaskValue = (values) => {
    // console.log(values);
    tempConfig.maskFrom = values[0]
    tempConfig.maskTo = values[1]
}

const handleNew = async () => {
    const successId = await addNewBackground()
    if (successId) {
        // console.log(successId);
        currentBackgroundId.value = successId
        const data = backgrounds.value.find(item => item.id == successId)
        // console.log(data);
        currentBackground.value = data
        toast.success('添加新背景成功', {
            position: 'top-center'
        })
        await initTempConfig(data)
    }
}

const handleDelete = async () => {
    const success = await removeBackground(tempConfig.id)
    if (success) {
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
    const background = backgrounds.value.find(item => item.id == currentBackgroundId.value)
    if (!background) return
    if (background.sourceType == 'url') return
    const userPermission = await verifyPermission(background.source, false);
    if (userPermission) {
        toast.success('已授权成功，稍后将自动刷新页面', {
            position: 'top-center', onAutoClose: () => {
                location.reload();
            }
        })
    }
}

const changeTempConfig = async (id) => {
    // console.log(id,tempConfig.id)
    currentBackgroundId.value = id
    if (!id || tempConfig.id == id) return
    const data = backgrounds.value.find(item => item.id == id)
    console.log(data);
    currentBackground.value = data
    // data.sourcePath = await getFileURL(data.source)
    await initTempConfig(data)
}

</script>

<style scoped>
.preview-wrapper {
    aspect-ratio: 16 / 9;
}
</style>