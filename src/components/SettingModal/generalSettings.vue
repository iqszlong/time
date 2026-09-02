<template>
    <FieldSet>
        <FieldGroup>
            <Field>
                <FieldLabel for="useFileSystem">使用新文件系统（Beta）</FieldLabel>
                <div class="flex items-center gap-2">
                    <Switch id="useFileSystem" v-model="tempConfig.timerConfig.useFileSystem" />

                </div>
                <FieldDescription>
                    开启后，背景将使用新的文件系统，支持本地图片或视频文件。但需要相应的读取权限，如果未授权，将无法读取本地文件。
                    如果授权后任然无法读取文件，请关闭该功能。
                </FieldDescription>
            </Field>

            <template v-if="storageInfo">
                <FieldSeparator />

                <Field>
                    <FieldLabel for="storageUsage">文件用量</FieldLabel>
                    <div class="flex items-center gap-2">
                        <Progress :model-value="storageUsage" :min="0" :max="100" class="w-1/2" />
                        <div>
                            {{ storageUsage }}%
                        </div>
                    </div>
                    <FieldDescription>
                        已使用 {{ storageInfo.usage }} 字节，可使用 {{ storageInfo.quota }} 字节，
                    </FieldDescription>
                </Field>

            </template>

            <template v-if="!isLoading">
                <FieldSeparator />

                <Field>
                    <FieldLabel for="storageUsage">系统信息</FieldLabel>
                    <FieldDescription>
                        <div class="space-x-4">
                            <span>浏览器：{{ browser.name || '未知'}}</span>
                            <span>版本：{{ browser.version || '未知'}}</span>
                        </div>
                        <div>
                            操作系统：{{ os || '未知'}}
                        </div>
                    </FieldDescription>
                </Field>
            </template>

        </FieldGroup>
    </FieldSet>
</template>

<script setup>
import { useBrowser } from '@/composables/useBrowser'
import { toast } from 'vue-sonner'
const { browser, os, isLoading } = useBrowser()
const { highPrecisionMul, highPrecisionDiv } = utils
const props = defineProps({
    tempConfig: { type: Object, required: true },
})
const storageInfo = ref(null)
const storageUsage = ref(0)

const getStroageData = async () => {
    try {
        storageInfo.value = await navigator.storage.estimate()
        storageUsage.value = Math.round(highPrecisionMul(highPrecisionDiv(storageInfo.value.usage, storageInfo.value.quota), 100))
    } catch (error) {
        // console.error('获取存储信息失败:', error)
        toast.error('获取存储信息失败', {
            description: error.message,
            position: 'top-center'
        })
    }
}

onMounted(async () => {
    await getStroageData()
})
</script>

<style scoped></style>