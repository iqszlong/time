<template>
    <div class="user-layout w-full h-full">
        <div class="wrapper-container grid grid-cols-[200px,1fr] gap-4">
            <aside class="user-menu">
                <NMenu :options="userSettingMenu" v-model:value="activeKey" keyField="name" labelField="title"
                    :rootIndent="16" :indent="8" :defaultExpandAll="true" :watch-props="['defaultExpandedKeys']"
                    :renderLabel="renderLabel" />
            </aside>
            <RouterView></RouterView>
        </div>

    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user';
import utils from '@/utils';

const { isUndefined } = utils
const route = useRoute()
const userStore = useUserStore()
const { userCurrentItem, userSettingMenu } = storeToRefs(userStore)
const activeKey = computed(() => userCurrentItem.value)



const renderLabel = (opt) => {
    return h(
        RouterLink,
        {
            to: {
                ...opt.link
            },
            class: `user-nav-item`,
            onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        { default: () => `${opt.title}` }
    )
}

watchEffect(() => {
    const item = userSettingMenu.value.find(item => item.link.name === route.name)
    // console.log(item);
    if (isUndefined(item)) return
    userCurrentItem.value = item.name
    // console.log(userCurrentItem.value, activeKey);


})

</script>

<style lang="scss" scoped></style>