<script setup lang="ts">
import { useI18n, useEvent, ref, useForm } from "#imports";
import { useRegionStore } from "~/store/regions";
import * as yup from "yup";

const { t } = useI18n();
const regionStore = useRegionStore();

const schema = yup.object().shape({
    name: yup.string().required(),
    defaultCurrency: yup.string().required(),
    isActive: yup.boolean().optional().default(false),
});
const { handleSubmit, isSubmitting, values } = useForm({
    validationSchema: schema,
    initialValues: {
        isActive: false,
        name: "",
        defaultCurrency: "",
    },
});

const createRegion = handleSubmit(async (values) => {
    await regionStore.create(values);
    useEvent("modal-close:create-region");
});
</script>

<template>
    <div>
        <form @submit.prevent="createRegion">
            <h2 class="create-region-title">
                {{ t("Settings.CreateRegion") }}
            </h2>
            <div class="p-4 w-100">
                <AdminSettingsFormsCreateRegion :region="values" />
            </div>
            <b-button
                class="modal-close"
                variant="outline-danger"
                @click="useEvent('modal-close:create-region')"
            >
                {{ t("common.cancel") }}
            </b-button>

            <b-button
                :disabled="isSubmitting"
                block
                class="general-button mt-3"
                type="submit"
                variant="danger"
            >
                <template v-if="isSubmitting"
                    >{{ t("Settings.Create") }}
                    <b-spinner variant="white ms-3" />
                </template>
                <template v-else>{{ t("Settings.Create") }}</template>
            </b-button>
        </form>
    </div>
</template>

<style scoped lang="css">
.create-region-title {
    text-align: center;
    padding: 5px;
    height: 60px;
    justify-content: center;
    display: flex;
    font-size: 1rem;
    align-items: center;
}
</style>
