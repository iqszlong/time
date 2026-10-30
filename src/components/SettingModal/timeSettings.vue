<template>
    <FieldSet>
        <FieldGroup>
            <div class="flex gap-6 flex-wrap">
                <div class="flex-[1_1_250px]">
                    <Field>
                        <FieldLabel for="display">时间格式</FieldLabel>
                        <RadioGroup id="display" v-model="tempConfig.timerConfig.timeDisplay"
                            class="flex items-center gap-4">
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
                </div>
                <div class="flex-[1_1_250px]">
                    <Field>
                        <FieldLabel for="fontSizeScale" class="whitespace-nowrap">
                            时间字号缩放
                            <Badge variant="outline">{{ formatterNumber.format(fontSizeScale[0]) }}
                                <span>像素</span>
                            </Badge>
                        </FieldLabel>
                        <Slider id="fontSizeScale" v-model="fontSizeScale" :max="50" :min="-30" :step="1"
                            @update:modelValue="handleScaleValue" />

                    </Field>
                </div>





            </div>
            <div class="flex gap-6 flex-wrap">
                <div class="flex-[1_1_250px]">
                    <Field>
                        <FieldLabel for="fontStyle">时间字体</FieldLabel>
                        <Select id="fontStyle" v-model="tempConfig.timerConfig.timeFontFamily">
                            <SelectTrigger class="w-full">
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
                </div>
                <div class="flex-[1_1_250px]">
                    <Field>
                        <FieldLabel for="fontEffect">时间字体效果</FieldLabel>
                        <Select id="fontEffect" v-model="tempConfig.timerConfig.timeFontEffect">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Select a style" class="w-[80%] truncate" />
                            </SelectTrigger>
                            <SelectContent>
                                <template v-for="effect of fontEffects" :key="effect.label">
                                    <SelectItem :value="effect.value">
                                        {{ effect['zh-CN'] }}
                                    </SelectItem>
                                </template>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </div>



            <div class="flex gap-6 flex-wrap">
                <div class="flex-[1_1_250px]">
                    <Field>
                        <FieldLabel for="fontPostion">显示位置</FieldLabel>
                        <Card class="py-1">
                            <CardContent class="px-1">
                                <ToggleGroup type="single" v-model="tempConfig.timerConfig.timePosition"
                                    id="fontPostion" class="grid grid-cols-3 grid-rows-3 w-full gap-2">
                                    <template v-for="position of positionStyle" :key="position.value">
                                        <ToggleGroupItem :value="position.value" :aria-label="position['zh-CN']">
                                            {{ position['zh-CN'] }}</ToggleGroupItem>
                                    </template>
                                </ToggleGroup>
                            </CardContent>
                        </Card>
                    </Field>
                </div>

                <div class="flex-[1_1_250px]"></div>
            </div>
        </FieldGroup>
    </FieldSet>
</template>

<script setup>
import { fontFamilys, fontEffects, positionStyle } from '@/services/mapping/config'
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

const init = () => {
    fontSizeScale.value[0] = props.tempConfig.timerConfig.timeFontSizeScale
}

const handleScaleValue = (values) => {
    emits('handleScaleValue', values)
}
</script>

<style scoped></style>