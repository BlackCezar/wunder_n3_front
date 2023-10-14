<script setup lang="ts">
import { computed, reactive, useField } from "#imports";
import { useForm } from "vee-validate";

const props = withDefaults(
    defineProps<{
        name: string;
        groupClass?: string;
        inputClass?: string;
        label: string;
        placeholder?: string;
        disabled?: boolean;
        accept?: string;
        browseText?: string;
        dropPlaceholder?: string;
        noDropPlaceholder?: string;
    }>(),
    {
        placeholder: "",
        inputClass: "",
        disabled: false,
        groupClass: "",
    },
);

const field = reactive(useField(() => props.name, undefined));
const { defineInputBinds } = useForm();
const isValid = computed(() => {
    return field.meta.touched ? field.meta.valid : null;
});

const nestedField = defineInputBinds(props.name);
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
            <b-form-file
                :placeholder="placeholder"
                :id="name"
                :name="name"
                :state="isValid"
                @blur="field.handleBlur"
                v-model="field.value as string"
                class="form-input m-0"
                :disabled="disabled"
                :class="inputClass"
                :accept="accept"
                :browse-text="browseText"
                :drop-placeholder="dropPlaceholder"
                :no-drop-placeholder="noDropPlaceholder"
                v-bind="nestedField"
            />
        </b-form-group>
    </ClientOnly>
</template>
