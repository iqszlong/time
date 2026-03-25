<template>
    <Dialog v-model:open="visible" @update:open="onOpenChange">
        <DialogTrigger as-child>
            <Button variant="outline" size="icon">
                <Settings2 />
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>设置</DialogTitle>
                <DialogDescription>
                    页面设置时间、背景图片。
                </DialogDescription>
            </DialogHeader>

            <FieldSet class="max-h-[60vh] overflow-y-auto">

                <div class="grid grid-cols-2 gap-6">
                    <div class="grid grid-flow-row">
                        <!-- <FieldLegend class="font-bold">时间设置</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel for="display">时间格式</FieldLabel>
                                <ToggleGroup id="display" v-model="tempConfig.time.display" type="single">
                                    <ToggleGroupItem value="12">
                                        12小时
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="24">
                                        24小时
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </Field>
                        </FieldGroup>

                        <Separator /> -->




                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend class="font-bold">背景设置</FieldLegend>
                                <FieldDescription>
                                    可使用本地文件或远程文件链接，设置内容均保存在本地，不会上传到服务器。
                                </FieldDescription>
                                <Tabs v-model:modelValue="tabValue">
                                    <TabsList>
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
                                                <z-filesystem @open="handleFilesystem"
                                                    :open-opt="JSON.stringify(fileTypeOpt)">
                                                    <Button variant="outline" block>选择文件</Button>
                                                </z-filesystem>
                                                <FieldDescription class="text-xs">
                                                    文件格式：jpg、png、gif、jpeg、bmp、webp、mp4、webm、m4v
                                                </FieldDescription>

                                            </Field>

                                        </template>
                                        <template v-else>
                                            <Field>
                                                <Input id="picture" type="file" accept="image/*" @change="handleFile" />
                                                <FieldDescription class="text-xs">
                                                    文件格式：jpg、png、gif、jpeg、bmp、webp
                                                </FieldDescription>
                                            </Field>
                                        </template>
                                    </TabsContent>
                                    <TabsContent value="url">
                                        <Field>
                                            <Input id="url" type="text" placeholder="https://" @blur="handleUrl"
                                                :modelValue="urlValue" />
                                            <FieldDescription class="text-xs">
                                                文件格式：jpg、png、gif、jpeg、bmp、webp、mp4、webm、m4v
                                            </FieldDescription>
                                        </Field>
                                    </TabsContent>
                                </Tabs>

                                <!-- <Separator /> -->

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
                                        <FieldLabel for="position">水平填充位置</FieldLabel>
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
                                        <FieldLabel for="position">垂直填充位置</FieldLabel>
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

                                <!-- <Separator /> -->

                                <Field>
                                    <FieldLabel for="mask">背景遮挡</FieldLabel>
                                    <div class="flex items-center space-x-2">
                                        <Switch id="mask" v-model="tempConfig.maskEnabled" />
                                        <span>{{ maskValue[0] }}</span>
                                        <Slider :default-value="[0, 100]" v-model="maskValue" :min="0" :max="100"
                                            :step="1" :disabled="!tempConfig.maskEnabled"
                                            @update:modelValue="handleMaskValue" />
                                        <span>{{ maskValue[1] }}</span>
                                    </div>

                                </Field>
                            </FieldSet>
                        </FieldGroup>
                    </div>
                    <div>
                        <div class="sticky top-0">
                            <h3>预览</h3>
                            <div class="preview-wrapper border-border border rounded-md overflow-hidden">
                                <Preview :source="tempConfig"></Preview>
                            </div>
                        </div>
                    </div>
                </div>


            </FieldSet>


            <DialogFooter>
                <DialogClose as-child>
                    <Button type="submit" @click="onSubmit">保存</Button>
                </DialogClose>
                <!-- <DialogClose as-child>
                    <Button variant="outline">取消</Button>
                </DialogClose> -->
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

        </DialogContent>
    </Dialog>


</template>

<script setup>
import { AlertCircleIcon, Settings2 } from 'lucide-vue-next';
import { useConfigStore } from '@/stores/config'
import { fit, position } from '@/services/mapping/config'
import { useBackgroundStore } from '@/stores/background'
import { toast } from 'vue-sonner'
const backgroundStore = useBackgroundStore();
const { updateBackground, defaultData, verifyPermission, getFileURL, resetBackground } = backgroundStore
const { currentBackground, isFilePicker, isDefault } = storeToRefs(backgroundStore)

let tempConfig = reactive({ ...defaultData, sourcePath: null })
const visible = ref(false)
const resetConfirm = ref(false)

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
    excludeAcceptAllOption: false,
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

const initTempConfig = async () => {
    // tempConfig = JSON.parse(JSON.stringify(config.value))
    // console.log(currentBackground.value);
    Object.assign(tempConfig, currentBackground.value)
    // console.log(tempConfig);
    // console.log(tempConfig.sourcePath);
    tabValue.value = tempConfig.sourceType
    maskValue.value = [tempConfig.maskFrom, tempConfig.maskTo]
    if (tempConfig.sourceType === 'url') {
        urlValue.value = tempConfig.sourcePath
    }
    // console.log(tempConfig.sourcePath);
}

const onSubmit = () => {
    // console.trace(tempConfig);
    // 如果url是编码过的，则解码
    if (tabValue.value === 'url' && tempConfig.source.includes('%')) {
        tempConfig.source = decodeURI(tempConfig.source)
    }
    tempConfig.sourceType = tabValue.value
    const data = { ...tempConfig }
    delete data.sourcePath
    // console.log(data);
    // return
    updateBackground(data)
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

const needPermission = async () => {
    if (currentBackground.value.sourceType == 'url') return
    const userPermission = await verifyPermission(currentBackground.value?.source, false)
    if (userPermission) {
        toast.success('已授权成功', { position: 'top-center' })
        // location.reload();
    }
}

</script>

<style scoped>
.preview-wrapper {
    aspect-ratio: 16 / 9;
}
</style>