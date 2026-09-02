<template>
    <div class="flex flex-col-reverse sm:flex-row gap-2">

        <div class="flex-1">
            <FieldGroup>
                <Field>
                    <div class="flex items-center gap-2">
                        <FieldLabel for="currentBackgroundId">背景项</FieldLabel>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Button variant="outline" size="icon-sm" @click="handleNew">
                                        <Plus />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>新增背景</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div class="ml-auto flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger as-child>
                                        <Toggle variant="outline" aria-label="Toggle see" name="visible" size="sm"
                                            v-model="tempConfig.currentBackground.visible"
                                            :defaultValue="tempConfig.currentBackground.visible">
                                            <Eye class="size-4" v-if="tempConfig.currentBackground.visible" />
                                            <EyeOff class="size-4 opacity-50" v-else />
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>可见性</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>


                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <Button variant="outline" size="icon-sm">
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <DropdownMenuItem @click="handleReset">
                                        <RefreshCw />重置当前背景
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem @click="handleDelete" :disabled="total <= 1">
                                        <Trash />删除当前背景
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Select v-model="currentBackgroundId" @update:modelValue="changeTempConfig">
                        <SelectTrigger id="currentBackgroundId" class="w-full">
                            <SelectValue placeholder="Select a background" class="w-[80%] truncate" />
                        </SelectTrigger>
                        <SelectContent>
                            <template v-for="item in tempConfig.backgroundConfigs" :key="item.id">
                                <SelectItem :value="item.id">{{ item.filename }}
                                </SelectItem>
                            </template>
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel for="file">文件</FieldLabel>
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
                            <template v-if="tempConfig.timerConfig.useFileSystem">
                                <Field>
                                    <div class="flex gap-2">
                                        <div class="flex-1">
                                            <z-filesystem id="file" @open="handleFilesystem"
                                                :openOpt="JSON.stringify(fileTypeOpt)"
                                                style="width: 100%; overflow: hidden;">

                                                <Button variant="outline" class="w-full">
                                                    <span
                                                        class="block w-[90%] text-ellipsis whitespace-nowrap overflow-hidden">
                                                        {{ selectedFileName ??
                                                            '选择文件' }}
                                                    </span>
                                                </Button>

                                            </z-filesystem>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger as-child>
                                                    <Button variant="outline" @click="needPermission" class="flex-none">授权访问</Button>
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
                                    <Input id="picture" type="file"
                                        accept="image/jpeg,image/png,image/gif,image/bmp,image/webp"
                                        @change="handleFile" />
                                    <FieldDescription class="text-xs">
                                        文件格式：jpg、png、gif、jpeg、bmp、webp
                                    </FieldDescription>
                                </Field>
                            </template>
                        </TabsContent>
                        <TabsContent value="url">
                            <Field>
                                <Input id="url" type="text" placeholder="https://" @blur="handleUrl"
                                    @focus="(e) => e.target.select()" :modelValue="urlValue" />
                                <FieldDescription class="text-xs">
                                    文件格式：jpg、png、gif、jpeg、bmp、webp、mp4、webm、m4v
                                </FieldDescription>
                            </Field>
                        </TabsContent>
                    </Tabs>
                </Field>

                <Field>
                    <FieldLabel for="order">
                        显示层级
                        <span class="text-xs text-muted-foreground">越大越靠前，盖住低层级背景</span>
                    </FieldLabel>
                    <Input id="order" v-model="tempConfig.currentBackground.order"
                        @focus="($event) => $event.currentTarget.select()" type="number" placeholder="" />
                </Field>

                <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-7">


                    <Field>
                        <FieldLabel for="fit">填充方式</FieldLabel>
                        <Select v-model="tempConfig.currentBackground.fit">
                            <SelectTrigger id="fit">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="item in fitOptions" :key="item.value" :value="item.value">
                                    {{ item.label }} ({{ item.value }})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel for="viewSize">
                            视图缩放
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger as-child>
                                        <FlaskConical class="size-3" />
                                    </TooltipTrigger>
                                    <TooltipContent align="center">
                                        <p>实验功能，浏览器不完全支持，配合填充方式scale-down或contain,<br />
                                            参考css的object-view-box:inset(上 右 下 左)写法。
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <span class="text-xs text-muted-foreground">单位 % 或 px </span>
                        </FieldLabel>

                        <InputGroup>
                            <InputGroupInput id="viewSize" v-model="tempConfig.currentBackground.viewSize"
                                @focus="($event) => $event.currentTarget.select()" type="text" placeholder="" />
                            <InputGroupAddon align="inline-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <InputGroupButton variant="ghost" aria-label="More" size="icon-xs">
                                            <ChevronDown />
                                        </InputGroupButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>常用</DropdownMenuLabel>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '0'">
                                            不缩放</DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '-50% 0 0'">
                                            贴底缩小50%</DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '20% 0 0'">
                                            贴底放大20%(contain)</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Windows</DropdownMenuLabel>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '0 0 -40px'">
                                            空出底部栏</DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '0 0 -30px'">
                                            空出底部栏(小)</DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '-40px 0 0 '">
                                            空出顶部栏</DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '-30px 0 0'">
                                            空出顶部栏(小)</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Mac</DropdownMenuLabel>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '-48px 0 0 '">
                                            空出顶部栏</DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.viewSize = '-74px 0 0 '">
                                            空出顶部栏(刘海)</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>

                    <Field>
                        <FieldLabel for="hposition">
                            水平位置
                            <span class="text-xs text-muted-foreground">单位 % 或 px </span>
                        </FieldLabel>

                        <InputGroup>
                            <InputGroupInput id="hposition" v-model="tempConfig.currentBackground.hposition"
                                placeholder="" @focus="($event) => $event.currentTarget.select()" />
                            <InputGroupAddon align="inline-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <InputGroupButton variant="ghost" aria-label="More" size="icon-xs">
                                            <ChevronDown />
                                        </InputGroupButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            v-for="item in postionOptions.filter(item => item.type.includes('horizontal'))"
                                            :key="item.value"
                                            @click="tempConfig.currentBackground.hposition = item.value">
                                            {{ item.label }} ({{ item.value }})
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </InputGroupAddon>
                        </InputGroup>

                    </Field>
                    <Field>
                        <FieldLabel for="vposition">
                            垂直位置
                            <span class="text-xs text-muted-foreground">单位 % 或 px </span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput id="vposition" v-model="tempConfig.currentBackground.vposition"
                                placeholder="" @focus="($event) => $event.currentTarget.select()" />
                            <InputGroupAddon align="inline-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <InputGroupButton variant="ghost" aria-label="More" size="icon-xs">
                                            <ChevronDown />
                                        </InputGroupButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            v-for="item in postionOptions.filter(item => item.type.includes('vertical'))"
                                            :key="item.value"
                                            @click="tempConfig.currentBackground.vposition = item.value">
                                            {{ item.label }} ({{ item.value }})
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </InputGroupAddon>
                        </InputGroup>

                    </Field>


                    <Field>
                        <FieldLabel for="rotateX">
                            旋转
                            <span class="text-xs text-muted-foreground">单位 deg、turn 或
                                rad</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput id="rotate" v-model="tempConfig.currentBackground.rotate" type="text"
                                @focus="($event) => $event.currentTarget.select()" placeholder="" />
                            <InputGroupAddon align="inline-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <InputGroupButton variant="ghost" aria-label="More" size="icon-xs">
                                            <ChevronDown />
                                        </InputGroupButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="tempConfig.currentBackground.rotate = 'x 180deg'">
                                            上下翻转
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.rotate = 'y 180deg'">
                                            左右翻转
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="tempConfig.currentBackground.rotate = '0deg'">
                                            重置
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>




                </div>

                <FieldSeparator />


                <Field orientation="horizontal">
                    <FieldLabel for="mask" class="whitespace-nowrap">背景遮挡</FieldLabel>

                    <Switch id="mask" v-model="tempConfig.currentBackground.maskEnabled" />
                    <span :class="[{'text-muted-foreground':!tempConfig.currentBackground.maskEnabled}]">{{ maskValue[0] }}</span>
                    <Slider :default-value="[0, 100]" v-model="maskValue" :min="0" :max="100" :step="1"
                        :disabled="!tempConfig.currentBackground.maskEnabled" @update:modelValue="handleMaskValue" />
                    <span :class="[{'text-muted-foreground':!tempConfig.currentBackground.maskEnabled}]">{{ maskValue[1] }}</span>


                </Field>

                <FieldSeparator />

                <Field orientation="horizontal">
                    <FieldLabel for="volume" class="whitespace-nowrap">音量</FieldLabel>

                    <Button id="volume" variant="outline" size="icon-sm" @click="toggleMute">
                        <template v-if="tempConfig.currentBackground.muted">
                            <VolumeX />
                        </template>
                        <template v-else>
                            <Volume2 />
                        </template>
                    </Button>
                    <Slider v-model="volumeValue" :min="0" :max="1" :step="0.01"
                    :disabled="tempConfig.currentBackground.muted"
                        @update:modelValue="handleVolumeValue" />
                    <span :class="[{'text-muted-foreground': tempConfig.currentBackground.muted}]">{{ highPrecisionMul(volumeValue, 100) }}</span>

                </Field>

            </FieldGroup>


            <Separator class="my-4" />

            <div class="flex h-5 items-center gap-2">
                <div class="text-xs text-muted-foreground">
                    创建时间:
                    {{ zhDayTime(tempConfig.currentBackground.createTime) }}
                </div>
                <div v-if="tempConfig.currentBackground.updateTime" class="text-xs  text-muted-foreground">
                    更新时间:
                    {{ zhDayTime(tempConfig.currentBackground.updateTime) }}
                </div>
            </div>


        </div>
        <div class="flex-none sm:w-56">
            <div class="sm:sticky sm:top-0">

                <div class="mb-2">预览</div>
                <div class="preview-wrapper border-border border rounded-md overflow-hidden">
                    <Preview :source="tempConfig.currentBackground"></Preview>
                </div>


            </div>
        </div>


    </div>


</template>

<script setup>
import { Plus, Trash, EllipsisVertical, Volume2, VolumeX, RefreshCw, ChevronDown, FlaskConical, Eye, EyeOff } from 'lucide-vue-next';
import { fit, position } from '@/services/mapping/config'
import { useBackgroundStore } from '@/stores/background'
import { toast } from 'vue-sonner'
const backgroundStore = useBackgroundStore()
const { updateAllBackgrounds, defaultData, verifyPermission, getFileURL, addNewBackground, removeBackground } = backgroundStore
const { currentBackgroundId, total } = storeToRefs(backgroundStore)
const { zhDayTime, highPrecisionMul } = utils
const props = defineProps({
    tempConfig: { type: Object, required: true },
})
const emits = defineEmits(['changeTempConfig', 'handleNew', 'handleFile', 'handleFilesystem', 'handleUrl', 'handleMaskValue', 'handleVolumeValue','toggleMute', 'handleReset', 'handleDelete'])

const urlValue = ref('')
const maskValue = ref([0, 1])
const volumeValue = ref([0])
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

onMounted(() => {
    // console.log('backgroundSettings mounted');
    init()
})

onUnmounted(() => {
    // console.log('backgroundSettings Unmounted');
    selectedFileName.value = null
})


const init = () => {
    const{ tempConfig } = props
    maskValue.value = [tempConfig.currentBackground.maskFrom, tempConfig.currentBackground.maskTo]
    volumeValue.value = [tempConfig.currentBackground.volume]
    if (tempConfig.currentBackground.sourceType === 'url') {
        urlValue.value = tempConfig.currentBackground.sourcePath
    }
}



const handleNew = () => {
    emits('handleNew')
}
const handleFile = (e) => {
    emits('handleFile', e)
}
const handleFilesystem = (e) => {
    const { handle } = e.detail[0];
    // console.log(handle);
    selectedFileName.value = handle.name
    emits('handleFilesystem', e)

}
const handleUrl = (e) => {
    emits('handleUrl', e)
}
const handleMaskValue = (values) => {
    emits('handleMaskValue', values)
}

const handleVolumeValue = (value) => {
    emits('handleVolumeValue', value)
}

const toggleMute = () => {
    emits('toggleMute')
}
const handleReset = () => {
    emits('handleReset')
}
const handleDelete = () => {
    emits('handleDelete')
}

const changeTempConfig = (id) => {
    emits('changeTempConfig', id)
}


const needPermission = async () => {
    const { tempConfig } = props
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


</script>

<style scoped>
.preview-wrapper {
    aspect-ratio: 16 / 9;
}
</style>