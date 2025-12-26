<template>
    <Transition :name="tName" mode="out-in">
        <slot :key="key"></slot>
    </Transition>
</template>

<script setup>
const { dayjs } = utils
const key = ref(dayjs.valueOf())
const router = useRouter()
const props = defineProps({
    tName:{
        type:String,
        default:'page'
    }
})

watch(
  () => router.currentRoute.value.fullPath,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      console.log('router change', newPath)
      key.value = dayjs().valueOf()  // 只在真正切换时更新 key
    }
  }
)

</script>

<style scoped></style>