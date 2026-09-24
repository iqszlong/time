<template>
    <FieldSet>
        <FieldGroup>

            <Field>
                <FieldLabel for="backup">数据备份/还原</FieldLabel>
                <FieldDescription>
                    备份当前数据，或从备份文件中恢复数据。<b>部分实验功能可能会恢复失败，请注意。</b>
                </FieldDescription>
                <div class="flex items-center gap-2">
                    <Button @click="onBackup" variant="outline">备份</Button>
                    <div class="flex-none">

                        <input ref="restoreInput" type="file" hidden accept="application/json,application/json5"
                            @change="onRestore" />

                        <Button @click="handleRestore" variant="outline">还原</Button>

                        <AlertDialog v-model:open="restoreConfirm">
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>还原警告</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        还原数据将会覆盖现有数据，是否继续？
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <Button @click="restoreInput.click(); restoreConfirm = false;">确认继续</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                </div>
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
                        已使用 {{ usageUnit }}，预计可使用 {{ quotaUnit }}
                    </FieldDescription>
                </Field>

            </template>

            <template v-if="!browserLoading">
                <FieldSeparator />

                <Field>
                    <FieldLabel for="systemInfo">系统信息</FieldLabel>
                    <FieldDescription>
                        <div class="space-x-4">
                            <span>浏览器：{{ browser.name || '未知' }} {{ browser.version || '' }}</span>
                            <span>
                                操作系统：{{ os || '未知' }}
                            </span>
                        </div>
                        <div>
                            <span>
                                引擎：{{ engine.name || '未知' }} {{ engine.version || '' }}
                            </span>
                        </div>
                    </FieldDescription>
                </Field>
            </template>


            <FieldSeparator />


            <Field>
                <FieldLabel for="clearCache">数据清空</FieldLabel>
                <div class="flex items-center gap-2">
                    <Button @click="handleClear" variant="destructive">清空</Button>
                </div>
                <AlertDialog v-model:open="clearConfirm">
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确定清空吗?</AlertDialogTitle>
                            <AlertDialogDescription>
                                清空数据将无法恢复，是否继续？
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <Button ref="clearBtn" variant="destructive">长按清空</Button>
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

import { storgeUnit } from '@/services/mapping/config'

const configStore = useConfigStore();
const { refresh: refreshConfig, clearAll: clearConfig, initConfig } = configStore
const backgroundStore = useBackgroundStore()
const { refresh: refreshBackground, clearAll: clearBackground, initBackground } = backgroundStore
const { browser, os, engine, isLoading: browserLoading } = useBrowser()
const { dayjs, highPrecisionMul, highPrecisionDiv } = utils

const props = defineProps({
    tempConfig: { type: Object, required: true },
})
const emits = defineEmits(['reloadTempConfig'])

const storageInfo = ref(null)
const storageUsage = ref(0)
const clearConfirm = ref(false)
const clearBtn = useTemplateRef('clearBtn')
const restoreConfirm = ref(false)
const restoreInput = ref(null)

const usageUnit = computed(() => {
    return storageInfo.value?.usage >= storgeUnit.GB ? transformNum(storageInfo.value?.usage, 'GB') : storageInfo.value?.usage >= storgeUnit.MB ? transformNum(storageInfo.value?.usage, 'MB') : transformNum(storageInfo.value?.usage, 'KB')
})

const quotaUnit = computed(() => {
    return storageInfo.value?.quota >= storgeUnit.GB ? transformNum(storageInfo.value?.quota, 'GB') : storageInfo.value?.quota >= storgeUnit.MB ? transformNum(storageInfo.value?.quota, 'MB') : transformNum(storageInfo.value?.quota, 'KB')
})

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
const handleRestore = () => restoreConfirm.value = true

onLongPress(clearBtn, async () => {
    clearConfirm.value = false
    await clearConfig()
    await clearBackground()
    await initConfig()
    await initBackground()
    emits('reloadTempConfig')
    toast.success('清空成功', {
        position: 'top-center'
    })
}, { distanceThreshold: false, modifiers: { prevent: true } })

const transformNum = (num, unit = 'B') => {
    if (!num) return '未知'
    let numTmp = 0
    if (Object.keys(storgeUnit).includes(unit)) {
        numTmp = highPrecisionDiv(num, storgeUnit[unit])
    } else {
        numTmp = num
    }

    // console.log(num,unit,numTmp);
    return `${Math.round(numTmp * 100) / 100}${unit}`

}

const getBackupData = async () => {
    //获取配置和背景数据
    const confd = await configService.getAll({ page: 0, size: 100 })
    const backgd = await backgroundService.getAll({ page: 0, size: 100 })
    for (const item of backgd) {
        if (item.sourceType == 'local') item.source = JSON5.stringify(item.source)
    }
    return {
        configs: confd,
        backgrounds: backgd
    }
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


const onRestore = async () => {
    const file = restoreInput.value.files[0]
    if (!file) {
        return
    }//判断文件名是否time-backup开头
    else if (!file.name.startsWith('time-backup')) {
        toast.error('文件名错误', {
            description: '文件名必须以time-backup开头',
            position: 'top-center'
        })
        return
    }

    try {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = async (e) => {
            const data = transformData(e.target.result)
            await clearConfig()
            await clearBackground()
            await configService.saveAll(data.configs ?? [])
            await backgroundService.saveAll(data.backgrounds ?? [])
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

const transformData = (result) => {
    try {
        return JSON5.parse(result)
    } catch (error) {
        toast.error('恢复失败，文件内容错误', {
            description: error.message,
            position: 'top-center'
        })
    }
}
</script>

<style scoped></style>