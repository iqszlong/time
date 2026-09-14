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
                <FieldLabel for="fontStyle">时间字体样式</FieldLabel>
                <Select id="fontStyle" v-model="tempConfig.timerConfig.timeFontFamily">
                    <SelectTrigger id="currentBackgroundId" class="w-full">
                        <SelectValue placeholder="Select a style" class="w-[80%] truncate" />
                    </SelectTrigger>
                    <SelectContent>
                        <template v-for="font of fontFamilys" :key="font.label">
                            <SelectItem :value="font.label">{{ font['zh-CN'] }}
                            </SelectItem>
                        </template>
                    </SelectContent>
                </Select>
            </Field>

        </FieldGroup>
    </FieldSet>
</template>

<script setup>
import { fontFamilys } from '@/services/mapping/config'
const props = defineProps({
    tempConfig: {
        type: Object,
        required: true
    }
})
</script>

<style scoped></style>