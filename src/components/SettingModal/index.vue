<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button variant="outline" size="icon">
                <Settings2 />
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>设置</DialogTitle>
                <DialogDescription>
                    页面设置时间、背景图片。可使用本地图片或远程图片链接，设置内容均保存在本地，不会上传到服务器。
                </DialogDescription>
            </DialogHeader>

            <FieldSet class="max-h-[60vh] overflow-y-auto">

                <div class="grid grid-cols-2 gap-6">
                    <div class="grid grid-flow-row gap-4">
                        <FieldLegend>时间设置</FieldLegend>
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

                        <Separator />

                        <FieldLegend>背景设置</FieldLegend>
                        <!-- <FieldDescription>
                            
                        </FieldDescription> -->
                        <FieldGroup>
                            <Tabs v-model:modelValue="tabValue">
                                <TabsList>
                                    <TabsTrigger value="upload">
                                        本地
                                    </TabsTrigger>
                                    <TabsTrigger value="url">
                                        远程
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="upload">
                                    <Field>
                                        <Input id="picture" type="file" accept="image/*" @change="handleFile" />
                                        <FieldDescription class="text-xs">
                                            文件格式：jpg、png、gif、jpeg、bmp、webp
                                        </FieldDescription>
                                    </Field>
                                </TabsContent>
                                <TabsContent value="url">
                                    <Field>
                                        <Input id="url" type="text" placeholder="https://" @change="handleUrl"
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
                                        <SelectItem v-for="item in fitOptions" :key="item.value" :value="item.value">
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
                                    <Switch id="mask" v-model="tempConfig.mask.enabled" />
                                    <span>{{ maskValue[0] }}</span>
                                    <Slider :default-value="[0, 100]" v-model="maskValue" :min="0" :max="100" :step="1"
                                        :disabled="!tempConfig.mask.enabled" @update:modelValue="handleMaskValue" />
                                    <span>{{ maskValue[1] }}</span>
                                </div>

                            </Field>
                        </FieldGroup>
                    </div>
                    <div>
                        <div class="sticky top-0">
                            <h3>预览</h3>
                            <div class="preview-wrapper border-border border rounded-md overflow-hidden">
                                <z-bg class="mask [--mask-rgb:255,255,255] dark:[--mask-rgb:0,0,0]"
                                    :class="[{ 'mask-disabled': !tempConfig.mask.enabled }]" :style="{
                                        '--mask-from': tempConfig.mask.from + '%',
                                        '--mask-to': tempConfig.mask.to + '%',
                                        '--content-fit': tempConfig.fit
                                    }">
                                    <template v-if="isImg(tempConfig.sourcePath)">
                                        <img :src="tempConfig.sourcePath" class="w-full h-full"
                                            :style="{ 'object-fit': tempConfig.fit, 'object-position': `${tempConfig.hposition} ${tempConfig.vposition}` }" />
                                    </template>
                                    <template v-if="isAssetTypeAnVideo(fileExt(tempConfig.sourcePath))">
                                        <video :src="tempConfig.sourcePath" loop muted
                                            class="w-full h-full pointer-events-none"
                                            :style="{ 'object-fit': tempConfig.fit, 'object-position': `${tempConfig.hposition} ${tempConfig.vposition}` }"
                                            @loadeddata="autoplay"></video>
                                    </template>
                                </z-bg>
                            </div>
                        </div>
                    </div>
                </div>


            </FieldSet>


            <DialogFooter>
                <DialogClose as-child>
                    <Button type="submit" @click="onSubmit">保存</Button>
                </DialogClose>
                <DialogClose as-child>
                    <Button type="reset" @click="onReset" variant="outline">重置</Button>
                </DialogClose>
            </DialogFooter>

        </DialogContent>
    </Dialog>
</template>

<script setup>
import { Settings2 } from 'lucide-vue-next';
import { useConfigStore } from '@/stores/config'
import { fit, position } from '@/services/mapping/config'
const configStore = useConfigStore();
const { setConfig, resetConfig } = configStore
const { config } = storeToRefs(configStore)
const { clone, fileExt, isAssetTypeAnImage, isAssetTypeAnVideo, pathReplace } = utils

const tempConfig = reactive(JSON.parse(JSON.stringify(config.value)))
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
const urlValue = computed(() => {
    return tempConfig.sourcePath.startsWith('http') ? tempConfig.sourcePath : ''
})
const maskValue = ref([0])


onBeforeMount(() => {
})

onMounted(() => {
    // tempConfig = JSON.parse(JSON.stringify(config.value))
    // console.log('tempConfig', tempConfig);

    tabValue.value = tempConfig.sourcePath.startsWith('http') ? 'url' : 'upload'
    maskValue.value = [tempConfig.mask.from, tempConfig.mask.to]

    // console.log(tempConfig.sourcePath);

})

const onSubmit = () => {
    // console.trace(tempConfig);
    // 如果url是编码过的，则解码
    if (tempConfig.sourcePath.startsWith('http') && tempConfig.sourcePath.includes('%')) {
        tempConfig.sourcePath = decodeURI(tempConfig.sourcePath)
    }
    setConfig(JSON.parse(JSON.stringify(tempConfig)))
}

const onReset = () => {
    resetConfig()
    tempConfig = JSON.parse(JSON.stringify(config.value))
}

const handleFile = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        tempConfig.sourcePath = reader.result
    }
}

const handleUrl = (e) => {
    tempConfig.sourcePath = e.target.value
}


const isImg = (path) => {
    if (path.startsWith('data') && path.includes('image')) return true;
    if (fileExt(path).includes('bing')) return true;
    return isAssetTypeAnImage(fileExt(path))
}


const autoplay = (e) => {
    const videoDom = e.target;
    videoDom.play();
}




const handleMaskValue = (values) => {
    // console.log(values);
    tempConfig.mask.from = values[0]
    tempConfig.mask.to = values[1]
}

</script>

<style scoped>
.preview-wrapper {
    aspect-ratio: 16 / 9;
}

.mask {
    --width: 100%;
    --height: 100%;
    --bg: radial-gradient(ellipse at center, rgba(var(--mask-rgb), 0) var(--mask-from, 0%), rgba(var(--mask-rgb), 1) var(--mask-to, 100%));
    --content-fit: var(--content-fit, 'cover');
}

.mask-disabled {
    --bg: none;
}
</style>