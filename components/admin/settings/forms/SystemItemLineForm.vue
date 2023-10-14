<script setup lang="ts">
const props = defineProps<{
    name?: string | null;
    systemName: string | null;
}>();

const { hide } = useModal();

const emit = defineEmits(["cancel", "hide"]);

const defaultLine = computed(() => {
    return {
        commission: 3,
        discount: 0,
        fromAmount: 0,
        toAmount: 100,
        systemName: props.systemName,
    };
});

const onCancel = () => {
    emit("cancel");
};

const save = () => {
    hide();
};
</script>
<template>
    <div>
        <div class="p-3">
            <FieldArray
                :name="`${name}.lines`"
                v-slot="{ fields, push, remove }"
            >
                <b-button
                    class="mr-auto ms-auto mb-3"
                    variant="info"
                    @click="push(defaultLine)"
                >
                    {{ $t("Settings.addLine") }}
                    <IBiPlus />
                </b-button>

                <b-list-group>
                    <b-list-group-item
                        v-for="(line, index) in fields"
                        :key="line.key"
                    >
                        <Field
                            :name="`${name}.lines[${
                                index as string
                            }].commission`"
                            v-slot="{ field }"
                        >
                            <b-form-group
                                :invalid-feedback="
                                    $t('registration.PhoneFeedback')
                                "
                                :label="$t('Settings.commission') + ' %'"
                                :input-for="'line-comission-' + index"
                                class="input-container"
                                content-cols-lg="9"
                                label-align-sm="right"
                                label-cols-lg="3"
                            >
                                <input
                                    :inputId="'line-comission-' + index"
                                    class="form-input m-0"
                                    max="100"
                                    min="0"
                                    type="number"
                                    v-bind="field"
                                />
                            </b-form-group>
                        </Field>
                        <Field
                            :name="`${name}.lines[${index as string}].discount`"
                            v-slot="{ field }"
                        >
                            <b-form-group
                                :invalid-feedback="
                                    $t('registration.PhoneFeedback')
                                "
                                :label="$t('Settings.discount') + ' %'"
                                :label-for="'line-discount-' + line.key"
                                class="input-container"
                                content-cols-lg="9"
                                label-align-sm="right"
                                label-cols-lg="3"
                            >
                                <input
                                    :inputId="'line-discount-' + line.key"
                                    class="form-input m-0"
                                    type="number"
                                    v-bind="field"
                                />
                            </b-form-group>
                        </Field>

                        <b-form-group
                            :invalid-feedback="$t('registration.PhoneFeedback')"
                            :label="$t('Settings.distance')"
                            :label-for="'line-discount-' + line.key"
                            class="input-container"
                            content-cols-lg="9"
                            label-align-sm="right"
                            label-cols-lg="3"
                        >
                            <b-input-group class="d-flex flex-row flex-nowrap">
                                <Field
                                    :name="`${name}.lines[${
                                        index as string
                                    }].fromAmount`"
                                    v-slot="{ field }"
                                >
                                    <input
                                        :inputId="'line-fromAmount-' + line.key"
                                        :placeholder="
                                            $t('Settings.fromAmount') + ' %'
                                        "
                                        class="form-input m-0 mr-1 min-w-none w-full"
                                        type="number"
                                        width="30"
                                        v-bind="field"
                                    />
                                </Field>
                                <Field
                                    :name="`${name}.lines[${
                                        index as string
                                    }].toAmount`"
                                    v-slot="{ field }"
                                >
                                    <input
                                        :inputId="'line-toAmount-' + line.key"
                                        :placeholder="
                                            $t('Settings.toAmount') + ' %'
                                        "
                                        class="form-input m-0 mr-1 min-w-none w-full"
                                        type="number"
                                        v-bind="field"
                                    />
                                </Field>
                            </b-input-group>
                        </b-form-group>
                        <Field
                            :name="`${name}.lines[${
                                index as string
                            }].systemName`"
                            hidden
                        />
                        <b-row>
                            <b-col offset-md="3">
                                <b-button
                                    variant="danger"
                                    @click="remove(index)"
                                >
                                    {{ $t("Settings.remove") }}
                                    <IBiTrash />
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                </b-list-group>
            </FieldArray>
        </div>
        <div class="mt-3">
            <b-button
                class="cancel-btn"
                variant="outline-danger"
                @click="onCancel"
                >{{ $t("common.cancel") }}
            </b-button>

            <b-button block variant="primary" @click="save"
                >{{ $t("AccountManagement.Save") }}
            </b-button>
        </div>
    </div>
</template>
