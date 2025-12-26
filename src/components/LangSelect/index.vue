<template>
    <NDropdown :options="langOptions" @select="changeLocale">
       <NButton quaternary size="small">语言</NButton>
    </NDropdown>
</template>

<script setup>
import { langList } from "@/lang/i18n";
import MaskIcon from "@/components/MaskIcon/index.vue";
import { Check  } from 'lucide-vue-next';

const { locale } = useI18n({ useScope: 'global' })

const langOptions = langList().map(item => {
    return {
        label: item.label, key: item.value, icon() {
            if (item.value == locale.value)
                return h(MaskIcon, { class: 'w-4 h-4 bg-[var(--primary-color)]', svgImg: Check })
            else {
                return null
            }
        }
    }
})


// 语言切换
const changeLocale = (lang) => {
    locale.value = lang;
};
</script>

<style lang="scss" scoped></style>