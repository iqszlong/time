<template>
    <div class="footer flex items-center justify-center text-xs text-white/50 gap-2">

            <span v-if="isEmpty(VITE_SITE_COPYRIGHT)">&copy; 2018-{{ year }} Company inc.All Rights Reserved.</span>
            <span v-else>{{ VITE_SITE_COPYRIGHT }}</span>
            <a v-if="!isEmpty(VITE_SITE_ICP)" href="https://beian.miit.gov.cn/" target="_blank">
                {{ VITE_SITE_ICP }}
            </a>
    
    </div>
</template>

<script setup>
const { dayjs, mediaQuery, isEmpty } = utils
const year = dayjs().format('YYYY')
const { VITE_SITE_COPYRIGHT, VITE_SITE_ICP } = import.meta.env
</script>

<style lang="scss" scoped></style>