<script lang="ts" setup>
import { computed, toRef } from "vue";
import { Field, useField } from "vee-validate";

const props = defineProps<{
    name: string;
}>();
const field = useField(props.name);
const isValid = computed(() => {
    return field.meta.touched ? field.meta.valid : null;
});
</script>

<template>
    <Field
        v-slot="{ field, errorMessage }"
        :name="name"
        type="checkbox"
        :value="true"
    >
        <b-form-group class="checkbox-wrapper">
            <b-form-checkbox
                :id="name"
                class="form-checkbox"
                :state="isValid"
                :value="true"
                :name="name"
                v-bind="field"
            >
                <slot />
            </b-form-checkbox>
            <b-form-invalid-feedback
                :state="isValid"
                class="form-input-invalid-feedback"
            >
                {{ errorMessage }}
            </b-form-invalid-feedback>
        </b-form-group>
    </Field>
</template>

<style lang="css">
.checkbox-wrapper .form-check {
    display: grid;
    align-items: start;
    padding-left: 0;
    margin-top: 22px;
    gap: 12px;
    grid-template-columns: 24px 1fr;
}
.checkbox-wrapper .form-check .form-check-input {
    display: block;
    margin-left: 0 !important;
    float: none;
    margin-top: 0;
    border-radius: 0;
    border: 1px solid #171717 !important;
}
.checkbox-wrapper .form-check .form-check-label {
    text-align: left;
}

.checkbox-wrapper .form-input-invalid-feedback {
    text-align: left;
}
</style>
