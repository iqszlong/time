<template>
    <Loading v-if="loading"></Loading>
    <NMenu v-else class="side-menu" v-model:value="activeKey" keyField="project" labelField="title" :rootIndent="16"
        :indent="8" :options="menus" :defaultExpandAll="true" :watch-props="['defaultExpandedKeys']"
        :renderLabel="renderLabel" :renderIcon="renderIcon"  />
    <!--   :renderExtra="renderExtra"  @update:value="handleUpdateValue"  @update:expandedKeys="handleExkeys"-->
</template>


<script setup>
import { ref, h, computed, onMounted, watchEffect, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/menu';
import { NMenu } from 'naive-ui';
import MaskIcon from "@/components/MaskIcon/index.vue";


const emit = defineEmits(['selected'])

const cagStore = useMenuStore()
const { menuList, currentMenu, menuReload } = storeToRefs(cagStore);
const { getData } = cagStore;

const loading = ref(true)
const activeKey = currentMenu
const menus = ref([])

const route = useRoute()

onMounted(() => {
    init();
})

const init = () => {
    setData();
}

const setData = async () => {

    // await getData();
    const list = menuList.value;
    // console.log(list);
    处理数据(list);
    menus.value = [...list];
    loading.value = false;
}

const 处理数据 = (array) => {
    for (const item of array) {
        // console.log(item);
        item.show = item.visible == 'true';
        if (item.children && item.children.length > 0) {
            处理数据(item.children);
        } else {
            item.children = null;
        }
    }
    // console.log(array);
}


const renderLabel = (opt) => {
    // if (opt.type === 'home') {
    //     return h(
    //         RouterLink,
    //         {
    //             to: { name: opt.type },
    //             class: `nav-item`,
    //         },
    //         { default: () => `${opt.title}` }
    //     )
    // }
    return h(
        RouterLink,
        {
            to: {
                name: opt.type,
                params: {
                    // project: opt.project
                }
            },
            class: `nav-item`,
            onClick: (e) => {
                emit('selected', opt);
                e.preventDefault();
                e.stopPropagation();
            }
        },
        { default: () => `${opt.title}` }
    )

}
const renderIcon = (opt) => {
    return h(
        MaskIcon,
        { class: 'nav-icon overflow-hidden bg-[var(--text-color)] dark:bg-white', svgImg: opt.cover },
    )
}
// const renderExtra = (opt) => {
//     // console.log(opt);
//     // console.log(opt.title);
//     return h(
//         'span',
//         { class: 'cag-project' },
//         opt.project
//     )

// }

// const handleUpdateValue = (key, item) => {
//     // console.log(key, item);
//     currentItem(key)
// }

// const handleExkeys = (keys) => {
// emit('selected',keys);
// }

const currentItem = (key) => {
    // console.log(key,activeKey);

    currentMenu.value = key;
    // console.log(currentMenu);
}

watchEffect(() => {
    currentItem(route.name)
})

watch(menuReload, () => {
    loading.value = true;
    setData();
})
</script>


<style scoped></style>