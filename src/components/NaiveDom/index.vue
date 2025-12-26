<template>
    <n-config-provider :theme="theme" :theme-overrides="customTheme" :locale="localLang" :date-locale="localLang"
        abstract inline-theme-disabled>
        <n-modal-provider>
            <n-dialog-provider>
                <n-message-provider>
                    <n-notification-provider>
                        <slot></slot>
                    </n-notification-provider>
                </n-message-provider>
            </n-dialog-provider>
        </n-modal-provider>
    </n-config-provider>
</template>

<script setup>
import { useConfigStore } from "@/stores/config";
import { darkTheme, lightTheme, zhCN, zhTW, enUS } from "naive-ui";
const configStore = useConfigStore()
const { config } = storeToRefs(configStore)
const theme = computed(() => config.value.naiveTheme == 'dark' ? darkTheme : lightTheme)
const customTheme = {
    common: {
        "primaryColor": "rgba(59, 130, 246, 1)",
        "primaryColorHover": "rgba(96, 165, 250, 1)",
        "primaryColorPressed": "rgba(29, 78, 216, 1)",
        "primaryColorSuppl": "rgba(30, 64, 175, 1)",
    }
}
const localLang = computed(() => {
    switch (config.value.language) {
        case "ZH_CN":
            return zhCN
        case "ZH_TW":
            return zhTW
        case "EN":
            return enUS
        default:
            return zhCN
    }
})
</script>

<style></style>