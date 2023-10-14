<script setup lang="ts">
import { Form } from "vee-validate";
import * as Yup from "yup";

defineEmits<{
    (event: "submit", payload: any): void;
}>();
type ISchema = {
    fields: {
        placeholder?: string;
        name: string;
        rules?: any;
        autocomplete?: string;
        label?: string;
        children?: any;
    }[];
};
const props = defineProps<{
    schema: ISchema;
    formClass?: string;
}>();

const validationSchema = computed(() => {
    return Yup.object().shape(
        Object.fromEntries(
            props.schema.fields.map((item) => {
                return [item.name, item.rules];
            }),
        ),
    );
});
</script>
<template>
    <ClientOnly>
        <Form
            :validation-schema="validationSchema"
            @submit="$emit('submit', $event)"
        >
            <div :class="formClass">
                <div
                    v-for="{ name, label, children, ...attrs } in schema.fields"
                    :key="name"
                >
                    <UiFormInput :name="name" :label="label" v-bind="attrs" />
                </div>
                <slot name="pre-button"></slot>
            </div>
            <slot name="button">
                <button>Submit</button>
            </slot>
        </Form>
    </ClientOnly>
</template>
