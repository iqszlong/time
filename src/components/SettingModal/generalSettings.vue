<template>
    <FieldSet>
        <FieldGroup>

            <Field>
                <FieldLabel for="backup">备份/还原</FieldLabel>
                <div class="flex items-center gap-2">
                    <Button @click="onBackup" variant="outline">备份</Button>
                    <div class="flex-none">
                        <InputGroup>
                            <InputGroupInput id="restore" type="file" class="hidden"
                                accept="application/json,application/json5" @change="onRestore" />
                            <InputGroupAddon>
                                <Label for="restore" class="text-foreground pr-3">还原</Label>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                </div>
            </Field>

            <FieldSeparator />

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

            <template v-if="!browserLoading">
                <FieldSeparator />

                <Field>
                    <FieldLabel for="systemInfo">系统信息</FieldLabel>
                    <FieldDescription>
                        <div class="space-x-4">
                            <span>浏览器：{{ browser.name || '未知' }}</span>
                            <span>版本：{{ browser.version || '未知' }}</span>
                        </div>
                        <div>
                            操作系统：{{ os || '未知' }}
                        </div>
                    </FieldDescription>
                </Field>
            </template>


            <FieldSeparator />


            <Field>
                <FieldLabel for="clearCache">清空数据</FieldLabel>
                <div class="flex items-center gap-2">
                    <Button @click="handleClear" variant="destructive">清空</Button>
                </div>
                <AlertDialog v-model:open="clearConfirm">
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确定清空吗?</AlertDialogTitle>
                            <AlertDialogDescription>
                                清空数据将无法恢复。是否继续？
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction ref="clearBtn">长按清空</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Field>


        </FieldGroup>
    </FieldSet>
</template>

<script setup>
import JSON5 from 'json5'
import { toast } from 'vue-sonner'
import { onLongPress } from '@vueuse/core'
import { useBrowser } from '@/composables/useBrowser'
import backgroundService from '@/services/background'
import configService from '@/services/config'
import { useConfigStore } from '@/stores/config'
import { useBackgroundStore } from '@/stores/background'

const configStore = useConfigStore();
const { refresh: refreshConfig, clearAll: clearConfig, initConfig } = configStore
const backgroundStore = useBackgroundStore()
const { refresh: refreshBackground, clearAll: clearBackground, initBackground } = backgroundStore
const { browser, os, isLoading: browserLoading } = useBrowser()
const { dayjs, highPrecisionMul, highPrecisionDiv } = utils

const props = defineProps({
    tempConfig: { type: Object, required: true },
})
const emits = defineEmits(['reloadTempConfig'])

const storageInfo = ref(null)
const storageUsage = ref(0)
const clearConfirm = ref(false)
const clearBtn = useTemplateRef('clearBtn')

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

const handleClear = () => clearConfirm.value = true

onLongPress(clearBtn, async () => {
    clearConfirm.value = false
    await clearConfig()
    await clearBackground()
    await initConfig()
    await initBackground()
    toast.success('清空成功', {
        position: 'top-center'
    })
}, { distanceThreshold: false, modifiers: { prevent: true } })

const getBackupData = async () => {
    //获取配置和背景数据
    const confd = await configService.getAll({ page: 0, size: 100 })
    const backgd = await backgroundService.getAll({ page: 0, size: 100 })
    for (const item of backgd) {
        item.source = JSON5.stringify(item.source)
    }
    const data = {
        config: confd,
        background: backgd
    }
    return data
}

const onBackup = async () => {
    try {
        const data = await getBackupData()
        const blob = new Blob([JSON5.stringify(data)], { type: 'application/json;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const dayStr = `${dayjs().format('YYYY-MM-DD')}-${dayjs().unix()}`
        const a = document.createElement('a')
        a.href = url
        a.download = `time-backup ${dayStr}.json`
        a.click()
        setTimeout(() => {
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }, 100)
    } catch (error) {
        toast.error('备份失败', {
            description: error.message,
            position: 'top-center'
        })
    }
}


const onRestore = async (e) => {
    const file = e.target.files[0]
    if (!file) {
        return
    }
    try {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = async (e) => {
            const data = JSON5.parse(e.target.result)
            await configService.saveAll(data.config ?? [])
            await backgroundService.saveAll(data.background ?? [])
            await refreshConfig()
            await refreshBackground()
            emits('reloadTempConfig')
            toast.success('恢复成功', {
                position: 'top-center'
            })
        }
    } catch (error) {
        toast.error('恢复失败', {
            description: error.message,
            position: 'top-center'
        })
    }
}
</script>

<style scoped></style>