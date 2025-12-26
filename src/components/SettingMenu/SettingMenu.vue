<template>
    <div class="flex items-center gap-2">

        <LangSelect></LangSelect>
        <z-screenfull>
            <MaskIcon slot="exit" class="w-5 h-5 bg-[var(--text-color)] dark:bg-white" :svg-img="iMinimize"></MaskIcon>
            <MaskIcon slot="full" class="w-5 h-5 bg-[var(--text-color)] dark:bg-white" :svg-img="iMaximize"></MaskIcon>
        </z-screenfull>

        <template v-if="isEmpty(userInfo)">
            <NPopover style="padding: 0" :show-arrow="false">
                <template #trigger>
                    <button>
                        <MaskIcon class="w-5 h-5 bg-[var(--text-color)] dark:bg-white" :svg-img="iUser"></MaskIcon>
                    </button>
                </template>
                <div class="pop-list grid grid-cols-1 gap-2">
                    <RouterLink :to="{ name: 'login' }" class="pop-item">账号登录</RouterLink>
                    <RouterLink :to="{ name: 'register' }" class="pop-item">立即注册</RouterLink>
                </div>
            </NPopover>
        </template>
        <template v-else>
            <div class="user h-full relative group/user z-10">
                <z-img class="h-9 w-9 rounded-full overflow-hidden"
                    :src="isNull(userInfo.avatar) ? defaultAvatar : userInfo.avatar"
                    :alt="userInfo.mobile" width="100%"></z-img>
                <div
                    class="group-hover/user:visible invisible absolute right-0 top-full bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-lg rounded-lg px-3 pt-1 pb-1">
                    <div class="p-2 flex flex-col gap-2">
                        <p class="">
                            <span class="text-base font-semibold">{{ userInfo.nickname }}</span>
                        </p>
                        <p class="text-xs truncate">{{ userInfo.email }}</p>
                        <p class="text-xs truncate">{{ userInfo.mobile }}</p>
                    </div>
                    <NDivider class="!my-2"></NDivider>
                    <template v-for="(item, index) in userSettingMenu" :key="index">
                        <RouterLink v-if="item.type == 'router'"
                            class="link block p-2 hover:bg-black/5 dark:hover:bg-white/5" :to="item.link">{{ item.title }}
                        </RouterLink>
                        <a v-if="item.type == 'link'" class="link block p-2 hover:bg-black/5 dark:hover:bg-white/5"
                            :href="item.link">{{
                                item.title }}</a>
                    </template>
                    <NDivider class="!my-2"></NDivider>
                    <div class="p-2">
                        <button @click="toLogOut" class="btn w-full py-2 px-3 text-white rounded-md">
                            退出登录
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>


<script setup>
import { useDialog } from 'naive-ui'
// import { useConfigStore } from '@/stores/config'
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia'
import utils from '@/utils';
const dialog = useDialog()
const userStore = useUserStore()
const { isNull, isEmpty } = utils
// const configStore = useConfigStore()
// const { config } = storeToRefs(configStore)
// const { setConfig, resetConfig } = configStore
// const isFit = computed(() => config.value.fit == 'cover')
// console.log(isFit);
const { token, userInfo, isLogin, userSettingMenu } = storeToRefs(userStore)
const { loadToken, getUserInfo, logOut } = userStore
// console.log(userInfo.value);

const router = useRouter()




onMounted(() => {
    loadToken()
    if (isNull(token.value)) return
    getUserInfo()
})

const toLogOut = () => {
    dialog.info({
        title: '提示',
        content: '确定要退出登录吗？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        closeOnEsc: false,
        onPositiveClick: () => {
            logOut()
        },
        onNegativeClick: () => { }
    })
}

</script >

<style scoped></style>