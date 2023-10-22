<script setup lang="ts">
import type { InputType } from "bootstrap-vue-next";
import { computed } from "#imports";
import { vMaska } from "maska";
import { useRegionStore } from "@/store/regions";

const regionStore = useRegionStore();

const props = defineProps<{
    name: string;
    type: InputType | "checkbox" | "select" | "period";
    groupClass?: string;
    inputClass?: string;
    label: string;
    placeholder?: string;
    options?: any[];
    disabled?: boolean;
    step?: string | number;
    readonly?: boolean;
}>();

const maskOptions = computed(() => {
    if (regionStore.regionName === "BY")
        return {
            mask: "+{375}(##)-###-##-##",
        };
    if (regionStore.regionName === "KZ")
        return {
            mask: "+{7}(###)-###-##-##",
        };
    return {
        mask: "+{998}-##-#######",
    };
});
const field = reactive(useField(() => props.name, undefined));
const onChange = (val) => {
    if (props.type === "tel" || props.type === "number") {
        field.value = val;
    }
};

const isValid = computed(() => {
    return field.meta.touched ? field.meta.valid : null;
});
</script>
<template>
    <ClientOnly>
        <b-form-group
            class="input-container"
            :class="groupClass"
            label-cols-lg="3"
            content-cols-lg="9"
            :label="label"
            label-align-sm="right"
            :label-for="name"
            :invalid-feedback="field.errorMessage"
        >
            <b-form-select
                v-if="type === 'select'"
                :name="name"
                :state="isValid"
                @blur="field.handleBlur"
                class="form-input m-0"
                :class="inputClass"
                :disabled="disabled"
                :id="name"
                v-model="field.value"
                :options="options"
            />
            <b-form-input
                v-else-if="type === 'tel'"
                :placeholder="placeholder"
                :id="name"
                :name="name"
                :disabled="disabled"
                :state="isValid"
                v-maska
                :data-maska="maskOptions.mask"
                @blur="field.handleBlur"
                :model-value="field.value as string"
                @input="onChange"
                class="form-input m-0"
                :class="inputClass"
                :type="type"
            />
            <b-form-input
                v-else-if="type === 'number'"
                :placeholder="placeholder"
                :id="name"
                :name="name"
                :state="isValid"
                :step="step"
                :disabled="disabled"
                @blur="field.handleBlur"
                v-model.number="field.value as string"
                class="form-input m-0"
                :class="inputClass"
                type="number"
                :readonly="readonly"
            />
            <b-form-checkbox
                v-else-if="type === 'checkbox'"
                :placeholder="placeholder"
                :id="name"
                :name="name"
                :state="isValid"
                @blur="field.handleBlur"
                v-model="field.value"
                :disabled="disabled"
                class="form-input m-0"
                :class="inputClass"
                :readonly="readonly"
            />
            <b-form-input
                v-else
                :placeholder="placeholder"
                :id="name"
                :name="name"
                :state="isValid"
                @blur="field.handleBlur"
                v-model="field.value as string"
                class="form-input m-0"
                :disabled="disabled"
                :class="inputClass"
                :type="type"
                :locale="$i18n.locale"
                :date-format-options="{
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }"
                today-variant="info"
                selected-variant="info"
                nav-button-variant="info"
            />
        </b-form-group>
    </ClientOnly>
</template>
