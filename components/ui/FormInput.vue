<script lang="ts" setup>
import { useRegionStore } from "~/store/regions";
import { useField } from "vee-validate";
import type { InputType } from "bootstrap-vue-next";
import { vMaska } from "maska";

const { t } = useI18n();

const props = defineProps({
    name: {
        type: String,
        required: true,
        default: "input",
    },
    value: {
        type: [String, Number],
        required: false,
        default: "",
    },
    type: {
        type: String,
        required: false,
        default: "text",
    },
    placeholder: {
        type: String,
        default: "",
    },
    maxLength: {
        type: [String, Number],
        default: "",
        required: false,
    },
    minLength: {
        type: [String, Number],
        default: "",
        required: false,
    },
    max: {
        type: [String, Number],
        default: "",
        required: false,
    },
    min: {
        type: [String, Number],
        default: "",
        required: false,
    },
    label: {
        type: String,
        default: "",
    },
    autocomplete: {
        required: false,
        type: [String, Boolean],
    },
    helperText: {
        type: String,
        required: false,
    },
    rules: {
        type: Object,
        required: false,
    },
    options: {
        type: Array,
        required: false,
        default: [],
    },
});
const regionStore = useRegionStore();
const name = toRef(props, "name");
const maskOptions = computed(() => {
    if (props.type === "tel") {
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
    } else if (props.type === "number" && props.maxLength) {
        let str = "";
        for (let i = 0; i < Number(props.maxLength); i++) {
            str += "#";
        }
        console.log('str', str)
        return {
            mask: str,
        };
    } else if (props.type === "url") {
        return {
            mask: "https://A.A",
            tokens: {
                A: {
                    pattern: /[a-zA-Z]/,
                    multiple: true,
                },
            },
        };
    }
    return {
        mask: Number,
    };
});

const { value, meta, handleBlur, handleChange, errorMessage } = useField(
    () => props.name,
    undefined,
    {
        initialValue: props.value,
    },
);

const onChange = (val: any) => {
    if (
        props.type === "tel" ||
        props.type === "number" ||
        props.type === "url"
    ) {
        value.value = val;
    }
};

const isValid = computed(() => {
    return meta.touched ? meta.valid : null;
});
</script>

<template>
    <b-form-group class="form-input-question" :label="label ?? ''">
        <b-form-input v-if="type === 'number' || type === 'tel'" :id="name as string" v-maska
            :autocomplete="Boolean(autocomplete) ? 'autocomplete' : undefined" :data-maska="maskOptions.mask"
            :model-value="value as string" :name="name as string" :placeholder="placeholder ?? ''" :state="isValid"
            :type="type as InputType" class="form-input" @blur="handleBlur" @input="onChange"
            @update:model-value="handleChange" />
        <b-form-textarea v-else-if="type === 'textarea'" :id="name as string" rows="3"
            :autocomplete="Boolean(autocomplete) ? 'autocomplete' : undefined" :model-value="value as string"
            :name="name as string" :placeholder="placeholder ?? ''" :state="isValid" :type="type as InputType"
            class="form-input" @blur="handleBlur" @update:model-value="handleChange" />
        <b-form-input v-else-if="type === 'url'" :id="name as string" v-maska
            :autocomplete="Boolean(autocomplete) ? 'autocomplete' : undefined" data-maska="https://A.A"
            data-maska-tokens="A:[a-zA-Z]:multiple" :model-value="value as string" :name="name as string"
            :placeholder="placeholder ?? ''" :state="isValid" type="text" class="form-input" @blur="handleBlur"
            @input="onChange" />
        <b-form-select v-else-if="type === 'select'" :id="name as string"
            :autocomplete="Boolean(autocomplete) ? 'autocomplete' : undefined" :placeholder="placeholder" :state="isValid"
            :model-value="value" @update:model-value="handleChange" class="form-input" @blur="handleBlur"
            :options="options" />
        <b-form-input v-else :id="name as string" :autocomplete="Boolean(autocomplete) ? 'autocomplete' : undefined"
            :max="max" :max-length="maxLength" :min="min" :min-length="minLength" :name="name as string"
            :placeholder="placeholder" :state="isValid" :type="type === 'number' ? 'text' : (type as InputType)"
            :model-value="value" @update:model-value="handleChange" class="form-input" @blur="handleBlur" />
        <template v-if="helperText">
            <IBiQuestionCircle :id="'tooltip-' + name" class="question-helper" />
            <b-tooltip :target="'tooltip-' + name" triggers="hover" variant="info">
                {{ helperText }}
            </b-tooltip>
        </template>
        <b-form-invalid-feedback id="input-live-feedback" class="form-input-invalid-feedback">
            {{ errorMessage }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<style lang="css" scoped>
.form-input-invalid-feedback {
    text-align: left;
}

.form-input-invalid-feedback:empty {
    display: none;
}

.question-helper {
    position: absolute;
    right: 11px;
    top: 36px;
    cursor: pointer;
    background-color: white;
}

.form-input-question {
    position: relative;
}

textarea.form-control {
    height: auto !important;
    max-height: unset;
}
</style>
