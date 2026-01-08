<template>
    <div class="footer flex items-center justify-center">
        <p class="text-xs text-center opacity-50">&copy; 2018-{{ year }} Company inc.All Rights Reserved.</p>
    </div>
</template>

<script setup>
const { dayjs, mediaQuery } = utils
const year = dayjs().format('YYYY')
</script>

<style lang="scss" scoped></style>