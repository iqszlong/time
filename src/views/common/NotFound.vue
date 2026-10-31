<template>
    <z-layout type="center">
    <Empty>
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <Ghost />
            </EmptyMedia>
            <EmptyTitle>404 - Not Found</EmptyTitle>
            <EmptyDescription>
                Nothing here...
            </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
            <div class="flex gap-2">
                <Button @click="router.push('/')">
                    <House />
                    回首页
                </Button>
                <Button variant="outline" @click="router.back()">
                    <Undo2 />
                    返回上一页
                </Button>
            </div>
        </EmptyContent>
    </Empty>
    </z-layout>
</template>

<script setup>
import { Ghost,House,Undo2 } from 'lucide-vue-next';
const router = useRouter();

</script>

<style scoped></style>