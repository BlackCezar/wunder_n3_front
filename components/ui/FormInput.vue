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
        return {
            mask: str,
        };
    }
    return {
        mask: Number,
    };
});

const { value, meta, handleBlur, errorMessage } = useField(
    () => props.name,
    undefined,
    {
        initialValue: props.value,
    },
);

const onChange = (val) => {
    if (props.type === "tel" || props.type === "number") {
        value.value = val;
    }
};

const isValid = computed(() => {
    return meta.touched ? meta.valid : null;
});
</script>

<template>
    <b-form-group class="form-input-question" :label="label ?? ''">
        <b-form-input
            v-if="type === 'number' || type === 'tel'"
            :id="name as string"
            v-maska
            :autocomplete="Boolean(autocomplete) ? 'autocomplete' : undefined"
            :data-maska="maskOptions.mask"
            :model-value="value as string"
            :name="name as string"
            :placeholder="placeholder ?? ''"
            :state="isValid"
            :type="type as InputType"
            class="form-input"
            type="number"
            @blur="handleBlur"
            @input="onChange"
        />
        <b-form-input
            v-else
            :id="name as string"
            :autocomplete="Boolean(autocomplete) ? 'autocomplete' : undefined"
            :max="max"
            :max-length="maxLength"
            :min="min"
            :min-length="minLength"
            :name="name as string"
            :placeholder="placeholder"
            :state="isValid"
            :type="type === 'number' ? 'text' : (type as InputType)"
            v-model="value as string"
            class="form-input"
            @blur="handleBlur"
            @input="onChange"
        />
        <template v-if="helperText">
            <IBiQuestionCircle
                :id="'tooltip-' + name"
                class="question-helper"
            />
            <b-tooltip
                :target="'tooltip-' + name"
                triggers="hover"
                variant="info"
            >
                {{ helperText }}
            </b-tooltip>
        </template>
        <b-form-invalid-feedback
            id="input-live-feedback"
            class="form-input-invalid-feedback"
        >
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
</style>
