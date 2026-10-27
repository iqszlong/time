<template>
    <FieldSet>
        <FieldGroup>
            <Field>
                <FieldLabel for="display">时间格式</FieldLabel>
                <RadioGroup id="display" v-model="tempConfig.timerConfig.timeDisplay" class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <RadioGroupItem id="display12" value="12" />
                        <Label for="display12">12小时</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioGroupItem id="display24" value="24" />
                        <Label for="display24">24小时</Label>
                    </div>
                </RadioGroup>
            </Field>

            <Field>
                <FieldLabel for="fontStyle">时间字体</FieldLabel>
                <Select id="fontStyle" v-model="tempConfig.timerConfig.timeFontFamily">
                    <SelectTrigger id="currentBackgroundId" class="w-full">
                        <SelectValue placeholder="Select a style" class="w-[80%] truncate" />
                    </SelectTrigger>
                    <SelectContent>
                        <template v-for="font of fontFamilys" :key="font.label">
                            <SelectItem :value="font.label">
                                <span :style="{ fontFamily: font.value }">{{ font['zh-CN'] }}</span>
                            </SelectItem>
                        </template>
                    </SelectContent>
                </Select>
            </Field>

            <Field orientation="horizontal">
                <FieldLabel for="fontSizeScale" class="whitespace-nowrap">时间字号缩放</FieldLabel>
                <Slider id="fontSizeScale" v-model="fontSizeScale" :max="50" :min="-30" :step="1" @update:modelValue="handleScaleValue"/>
                <div class="whitespace-nowrap text-sm">{{ formatterNumber.format(fontSizeScale[0]) }} <span>像素</span></div>
            </Field>

            <Field>
                <FieldLabel for="fontPostion">显示位置</FieldLabel>
                <Card class="py-1" :style="{ width: 'clamp(200px,50%,400px)' }">
                    <CardContent class="px-1">
                        <ToggleGroup type="single" required v-model="tempConfig.timerConfig.timePosition"
                            id="fontPostion" class="grid grid-cols-3 grid-rows-3 w-full gap-2">
                            <template v-for="position of positionStyle" :key="position.value">
                                <ToggleGroupItem :value="position.value" :aria-label="position['zh-CN']">
                                    {{ position['zh-CN'] }}</ToggleGroupItem>
                            </template>
                        </ToggleGroup>
                    </CardContent>
                </Card>
            </Field>
        </FieldGroup>
    </FieldSet>
</template>

<script setup>
import { fontFamilys, positionStyle } from '@/services/mapping/config'
const { formatterNumber } = utils
const props = defineProps({
    tempConfig: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['handleScaleValue'])
const fontSizeScale = ref([0])

onMounted(() => {
    init()
})

const init=()=>{
    fontSizeScale.value[0] = props.tempConfig.timerConfig.timeFontSizeScale
}

const handleScaleValue = (values)=>{
    emits('handleScaleValue',values)
}
</script>

<style scoped></style>