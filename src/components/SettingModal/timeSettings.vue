<template>
    <FieldSet>
        <FieldGroup>
            <div class="flex gap-6 flex-wrap">
                <div class="flex-[1_1_250px]">
                    <Field>
                        <FieldLabel for="display">时间格式</FieldLabel>
                        <RadioGroup id="display" default-value="12" v-model="tempConfig.timerConfig.timeDisplay"
                            class="flex items-center gap-4">
                            <FieldLabel for="display12">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>12小时</FieldTitle>
                                    </FieldContent>
                                    <RadioGroupItem id="display12" value="12" />
                                </Field>
                            </FieldLabel>
                            <FieldLabel for="display24">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>24小时</FieldTitle>
                                    </FieldContent>
                                    <RadioGroupItem id="display24" value="24" />
                                </Field>

                            </FieldLabel>
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

                        <RadioGroup default-value="bottom-center" v-model="tempConfig.timerConfig.timePosition"
                            id="fontPostion" class="grid grid-cols-3 grid-rows-3 w-full gap-2">
                            <template v-for="position of positionStyle" :key="position.value">
                                <FieldLabel :for="position.value">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>{{ position['zh-CN'] }}</FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem :id="position.value" :value="position.value"
                                            :aria-label="position['zh-CN']" />
                                    </Field>
                                </FieldLabel>
                            </template>
                        </RadioGroup>

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
    fontSizeScale.value[0] = props.tempConfig.timerConfig.timeFontSizeScale ?? 0
}

const handleScaleValue = (values) => {
    emits('handleScaleValue', values)
}
</script>

<style scoped></style>