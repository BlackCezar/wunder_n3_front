<script setup lang="ts">
import { computed } from "#imports";

const props = withDefaults(
    defineProps<{
        name: string;
        groupClass?: string;
        inputClass?: string;
        label: string;
        placeholder?: string;
        options?: any[];
        toPlaceholder?: string;
        toName: string;
    }>(),
    {
        type: "text",
        placeholder: "",
        inputClass: "",
        groupClass: "",
    }
);

const field = reactive(useField(() => props.name, undefined));
const fieldTo = reactive(useField(() => props.toName, undefined));

const isValid = computed(() => {
    return field.meta.touched ? field.meta.valid : null;
});

const isValidTo = computed(() => {
    return fieldTo.meta.touched ? fieldTo.meta.valid : null;
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
            <b-form-input
                :placeholder="placeholder"
                :id="name"
                :name="name"
                :state="isValid"
                @blur="field.handleBlur"
                v-model="(field.value as string)"
                class="form-input mb-4"
                :class="inputClass"
                type="date"
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
            <b-form-input
                :placeholder="toPlaceholder"
                :id="toName"
                :name="toName"
                :state="isValidTo"
                @blur="fieldTo.handleBlur"
                v-model="(fieldTo.value as string)"
                class="form-input m-0"
                :class="inputClass"
                type="date"
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
