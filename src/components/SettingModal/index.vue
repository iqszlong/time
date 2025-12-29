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
            </DialogHeader>

            <div class="grid grid-cols-2 gap-6">
                <div class="grid grid-flow-row gap-4">
                    <Tabs default-value="upload">
                        <TabsList>
                            <TabsTrigger value="upload">
                                本地上传（仅图片）
                            </TabsTrigger>
                            <TabsTrigger value="url">
                                远程地址
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload">
                            <Field>
                                <Input id="picture" type="file" accept="image/*" @change="handleFile" />
                                <FieldDescription>
                                    文件格式：jpg、png、gif、jpeg、bmp、webp
                                </FieldDescription>
                            </Field>
                        </TabsContent>
                        <TabsContent value="url">
                            <Field>
                                <Input id="url" type="text" placeholder="https://" />
                                <FieldDescription>
                                    文件格式：jpg、png、gif、jpeg、bmp、webp、mp4、webm、m4v
                                </FieldDescription>
                            </Field>
                        </TabsContent>
                    </Tabs>

                    <Separator />

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
                </div>
                <div>
                    <h3>壁纸预览</h3>
                    <div class="preview-wrapper border-border border rounded-md overflow-hidden">
                        <img :src="tempConfig.sourcePath" class="img-blur-bg w-full h-full "
                            :style="{ 'object-fit': tempConfig.fit, 'object-position': `${tempConfig.hposition} ${tempConfig.vposition}` }" />
                    </div>
                </div>
            </div>


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
const tempConfig = ref(null)
const { clone } = utils
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
    tempConfig.value = clone(config.value)
})

const onSubmit = () => {
    // console.log(tempConfig.value);
    setConfig(tempConfig.value)
}

const onReset = () => {
    resetConfig()
    tempConfig.value = clone(config.value)
}

const handleFile = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        tempConfig.value.sourcePath = reader.result
    }
}


</script>

<style scoped>
.preview-wrapper {
    aspect-ratio: 16 / 9;
}
</style>