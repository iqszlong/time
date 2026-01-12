<template>
    <div class="footer flex items-center justify-center text-xs text-white/50 gap-3">

        <span v-if="isEmpty(VITE_SITE_COPYRIGHT)">&copy; 2018-{{ year }} Company inc.All Rights Reserved.</span>
        <span v-else>{{ VITE_SITE_COPYRIGHT }}</span>
        <a v-if="!isEmpty(VITE_SITE_ICP)" href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            {{ VITE_SITE_ICP }}
        </a>
        <a v-if="!isEmpty(VITE_SITE_CAP)" :href="`https://beian.mps.gov.cn/#/query/webSearch?code=${VITE_SITE_CAP_NO}`"
            rel="noreferrer" target="_blank" class="flex items-center justify-center gap-1">
            <img :src="cap" class="h-3 pointer-events-none"/>
            {{ VITE_SITE_CAP }}
        </a>
    </div>
</template>

<script setup>
import icons from '@/utils/icons'
const { dayjs, mediaQuery, isEmpty} = utils
const cap = icons.cap
const year = dayjs().format('YYYY')
const { VITE_SITE_COPYRIGHT, VITE_SITE_ICP, VITE_SITE_CAP, VITE_SITE_CAP_NO } = import.meta.env

</script>

<style scoped>

</style>