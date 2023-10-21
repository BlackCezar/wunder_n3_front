<script lang="ts" setup>
import type {
    IRegionEdit,
    IRegionSystemSettings,
} from "~/types/region.interface";
import { PayType } from "~/types/region.interface";
import SettingsTab from "~/components/admin/settings/tabs/SettingsTab.vue";
import SignTab from "~/components/admin/settings/tabs/SignTab.vue";
import ContactsTab from "~/components/admin/settings/tabs/ContactsTab.vue";
import SystemsTab from "~/components/admin/settings/tabs/SystemsTab.vue";
import * as yup from "yup";
import { useEvent } from "~/composables/useEventBus";
import { useRegionStore } from "~/store/regions";
import { useForm } from "#imports";
import { useLogger } from "vue-logger-plugin";

const props = defineProps<{
    region: IRegionEdit;
}>();

const activeTab = ref<string>("settings");
const regionStore = useRegionStore();
const { hide } = useModal();
const logger = useLogger();

const schema = yup.object({
    isActive: yup.boolean().optional(),
    currency: yup.string().required(),
    name: yup.string().required(),
    sign: yup.string().required(),
    settings: yup.array().of(
        yup.object({
            emailFrom: yup.string().required(),
            planFixManagerId: yup.string().required(),
            financialManagerId: yup.string().required(),
            projectId: yup.number().required(),
            paymentWaitingHours: yup.number().required(),
            freeHours: yup.number().required(),
            ratesAdds: yup.number().required(),
            freeTimes: yup.number().required(),
            hourCost: yup.number().required(),
            vat: yup.number().required(),
            telegramLink: yup.string().url().required(),
            whatappPhone: yup.string().optional(),
            whatappText: yup.string().optional(),
            telPhone: yup.string().optional(),
            personalAgree: yup.string().required(),
            publicContract: yup.string().required(),
            isEDNActive: yup.boolean().optional(),
            allowTransfer: yup.boolean().optional(),
            payType: yup.string().required(),
        }),
    ),
    systemSettings: yup
        .array()
        .of(
            yup.object({
                systemName: yup.string(),
                id: yup.number(),
                regionId: yup.number(),
                currency: yup.string(),
                minSum: yup.string(),
                lines: yup
                    .array()
                    .of(
                        yup.object({
                            commission: yup.number(),
                            discount: yup.number(),
                            fromAmount: yup.number().required(),
                            toAmount: yup.number().required(),
                            systemName: yup.string().required(),
                        }),
                    )
                    .optional(),
            }),
        )
        .optional(),
});

const {
    handleSubmit,
    values,
    resetForm,
    isSubmitting,
    defineComponentBinds,
    resetField,
    errors,
    meta,
} = useForm<IRegionEdit>({
    validationSchema: schema,
    initialValues: {
        isActive: false,
        currency: "",
        name: "",
        sign: "",
        settings: [
            {
                emailFrom: "",
                planFixManagerId: "0",
                financialManagerId: "0",
                projectId: 0,
                paymentWaitingHours: 1,
                freeHours: 1,
                ratesAdds: 1,
                freeTimes: 1,
                hourCost: 1,
                vat: 5,
                telegramLink: "",
                whatappPhone: "",
                whatappText: "",
                telPhone: "",
                personalAgree: "",
                publicContract: "",
                isEDNActive: false,
                allowTransfer: false,
                payType: PayType.PREPAY,
                balanceUpdateDelay: 0,
            },
        ],
        systemSettings: [],
    },
    keepValuesOnUnmount: true,
});

watch(
    () => props.region,
    () => {
        if (values.systemSettings.length === 0)
            resetForm({
                values: props.region,
            });
    },
    {
        immediate: true,
        deep: true,
    },
);

const settingsField = defineComponentBinds("settings");

const removeRemoveItems = async (values) => {
    for (const systemSetting of values.systemSettings) {
        const oldLines = meta.value.initialValues?.systemSettings?.find(
            (item) => item?.id === systemSetting.id,
        ) as IRegionSystemSettings | undefined;

        if (!oldLines?.lines?.length) continue;
        console.dir(oldLines.lines.length);

        for (const oldLine of oldLines.lines) {
            if (
                oldLine.id &&
                !systemSetting.lines.find((item) => item.id === oldLine.id)
            )
                regionStore.removeSystemLine({
                    systemSettingsId: systemSetting.id,
                    lineId: oldLine.id,
                });
        }
    }
};

const submitSettingsUpdate = handleSubmit(async (values) => {
    await removeRemoveItems(values);
    await regionStore.update(values);
    hide();
});
</script>

<template>
    <div class="settings-modal">
        <b-form @submit.prevent="submitSettingsUpdate">
            <b-tabs content-class="p-4 w-100" fill nav-class="tabs-header">
                <b-tab
                    :active="activeTab === 'settings'"
                    :title="$t('Settings.SettingsTab')"
                    active-tab-class="active"
                    title-item-class="top-up-tab"
                >
                    <SettingsTab :settings="settingsField" />
                </b-tab>
                <b-tab
                    :active="activeTab === 'systems'"
                    :title="$t('Settings.SystemsTab')"
                    active-tab-class="active"
                    title-item-class="top-up-tab"
                >
                    <SystemsTab
                        :list="values.systemSettings"
                        :reset-lines="resetField"
                    />
                </b-tab>
                <b-tab
                    :active="activeTab === 'contacts'"
                    :title="$t('Settings.ContactsTab')"
                    active-tab-class="active"
                    title-item-class="top-up-tab"
                >
                    <ContactsTab />
                </b-tab>
                <b-tab
                    :active="activeTab === 'sign'"
                    :title="$t('Settings.SignTab')"
                    active-tab-class="active"
                    title-item-class="top-up-tab"
                >
                    <SignTab
                        v-if="region"
                        :region-id="region.id"
                        :sign="region.sign"
                        :sign-value="values.sign"
                    />
                </b-tab>
            </b-tabs>
            <span>
                {{ errors }}
            </span>
            <b-button
                class="modal-close"
                variant="outline-danger"
                @click="useEvent('modal-close:edit-region')"
            >
                {{ $t("common.cancel") }}
            </b-button>

            <b-button
                :disabled="isSubmitting"
                block
                class="general-button mt-3"
                type="submit"
                variant="danger"
            >
                <template v-if="isSubmitting"
                    >{{ $t("Settings.Save") }}
                    <b-spinner variant="light" class="ms-3" />
                </template>
                <template v-else>{{ $t("Settings.Save") }}</template>
            </b-button>
        </b-form>
    </div>
</template>

<style lang="css">
#edit-region-modal .modal-content {
    border: 0;
}

.settings-modal {
    overflow: hidden;
    border-radius: 8px;
}

.tabs-header {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
}
.tabs-header .top-up-tab {
    margin-top: 0;
}
.tabs-header .top-up-tab button {
    height: 100%;
    border-radius: 0;
    border-top: 0;
    padding: 5px;
}

.custom-row label {
    text-align: right;
    width: 100%;
    display: inline-block;
}

.settings-rows {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 24px;
}
.settings-rows .custom-row {
    display: flex;
    flex-direction: row-reverse;
}
@media (max-width: 992px) {
    .settings-rows {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 768px) {
    .settings-rows > div {
        padding-left: 0;
    }
    .settings-rows > div label {
        width: 50%;
        padding-right: 13px;
        text-align: right;
    }
    .settings-rows > div label::after,
    .settings-rows > div label::before {
        left: calc(100% + 15px);
    }
}
</style>
