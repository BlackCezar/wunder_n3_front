<template>
    <form class="admin-contract-modal" @submit.prevent="saveContract">
        <b-tabs content-class="p-4 w-100" fill nav-class="tabs-header">
            <b-tab
                :title="
                    contract.id
                        ? $t('EditClient.EditContract')
                        : $t('EditClient.NewContract')
                "
                active-tab-class="active"
                title-item-class="top-up-tab"
            >
                <ContractTab :contract-type="values.contractType" />
            </b-tab>
            <b-tab
                :title="$t('Documents.Documents')"
                active-tab-class="active"
                title-item-class="top-up-tab"
            >
                <DocumentsTab
                    :contract="contract"
                    :contract-type="values.contractType"
                />
            </b-tab>
            <b-tab
                :title="$t('EditClient.Settings')"
                active-tab-class="active"
                title-item-class="top-up-tab"
            >
                <SettingsTab :contract-type="values.contractType" />
            </b-tab>
            <b-tab
                :title="$t('EditClient.Systems')"
                active-tab-class="active"
                title-item-class="top-up-tab"
            >
                <SystemsTab
                    :contract="contract"
                    :contract-type="values.contractType"
                />
            </b-tab>
        </b-tabs>
        <b-button
            class="modal-close"
            variant="outline-danger"
            @click="useEvent('modal-close:edit-contract')"
        >
            {{ $t("common.cancel") }}
        </b-button>
        <b-button
            :disabled="isSubmitting"
            class="modal-btn"
            type="submit"
            variant="danger"
            @click="saveContract"
        >
            {{
                contract.id
                    ? $t("AccountManagement.Save")
                    : $t("EditClient.AddContract")
            }}
            <b-spinner v-if="isSubmitting" class="ms-3" variant="info" />
        </b-button>
    </form>
</template>

<script lang="ts" setup>
import { ContractType } from "~/types/contract.interface";
import type { IContract } from "~/types/contract.interface";
import * as Yup from "yup";
import ContractTab from "./tabs/ContractTab.vue";
import DocumentsTab from "./tabs/DocumentsTab.vue";
import SettingsTab from "./tabs/SettingsTab.vue";
import { useContractStore } from "@/store/contracts";
import SystemsTab from "./tabs/SystemsTab.vue";
import { PayType } from "@/types/region.interface";
import moment from "moment";

const props = defineProps<{
    contract: IContract;
}>();

const { t } = useI18n();

const contractStore = useContractStore();

const schema = Yup.object().shape({
    contractType: Yup.string().required(t("Validation.required")),
    isActive: Yup.bool().required(t("Validation.required")),
    contractNumber: Yup.string().optional(),
    contractService: Yup.string().optional(),
    startDate: Yup.date().required(t("Validation.required")),
    expireDate: Yup.date().optional().nullable(),
    settings: Yup.object().shape({
        ratesAdds: Yup.number().optional(),
        freeHours: Yup.number().optional(),
        freeTimes: Yup.number().optional(),
        hourCost: Yup.number().optional(),
        vat: Yup.number().optional(),
        projectId: Yup.number().required(t("Validation.required")),
        isEDNActive: Yup.bool()
            .required(t("Validation.required"))
            .default(false),
        allowTransfer: Yup.bool()
            .required(t("Validation.required"))
            .default(true),
        payType: Yup.string()
            .required(t("Validation.required"))
            .default(PayType.PREPAY),
    }),
    systemSettings: Yup.array().of(
        Yup.object().shape({
            systemName: Yup.string(),
            id: Yup.number(),
            regionId: Yup.number(),
            currency: Yup.string(),
            minSum: Yup.string(),
            lines: Yup.array().of(
                Yup.object().shape({
                    commission: Yup.number(),
                    discount: Yup.number(),
                    fromAmount: Yup.number().required(),
                    toAmount: Yup.number().required(),
                    systemName: Yup.string().required(),
                }),
            ),
        }),
    ),
});

const {
    isSubmitting,
    handleSubmit,
    resetForm,
    errors,
    setValues,
    values,
    setFieldValue,
} = useForm<IContract>({
    validationSchema: schema,
    initialValues: {
        settings: {
            payType: PayType.PREPAY,
            allowTransfer: true,
            isEDNActive: false,
        },
        systemSettings: [],
        contractType: ContractType.STANDARD,
        isActive: false,
        contractService: "Зачисление средств",
        startDate: "",
        expireDate: "",
    },
});

watch(
    () => props.contract,
    () => {
        setValues(props.contract);
        if (props.contract.startDate) {
            console.log("moment payload", props.contract.startDate);
            const date = moment(props.contract.startDate).format("YYYY-MM-DD");
            setFieldValue("startDate", date);
        }
        if (props.contract.expireDate) {
            console.log("moment payload expireDate", props.contract.expireDate);
            const date = moment(props.contract.expireDate).format("YYYY-MM-DD");
            setFieldValue("expireDate", date);
        }
    },
    {
        immediate: true,
    },
);

const saveContract = handleSubmit(async (values) => {
    console.log("click");
    if (values) {
        const payload: any = {
            ...values,
            startDate: new Date(values.startDate),
            settings: {
                ...values.settings,
                freeHours: Number(values.settings.freeHours),
                freeTimes: Number(values.settings.freeTimes),
                ratesAdds: Number(values.settings.ratesAdds),
                vat: Number(values.settings.vat),
                projectId: Number(values.settings.projectId),
            },
            systemSettings: props.contract.systemSettings,
        };
        if (payload.expireDate === "") delete payload.expireDate;
        else if (payload.expireDate)
            payload.expireDate = new Date(values.expireDate);
        console.log("save contract payload", payload);
        if (payload.id) {
            await contractStore.update(payload);
        } else await contractStore.create(payload);
        useEvent("modal-close:edit-contract");
        resetForm();
    }
});
</script>

<style lang="css">
.admin-contract-modal .form-input {
    margin-top: 0;
}

@media screen and (max-width: 768px) {
    .admin-contract-modal .documents-row {
        flex-direction: column;
    }
    .admin-contract-modal .documents-row > .col-9 {
        max-width: unset;
    }
    .admin-contract-modal .documents-row .row:last-child .col-5 {
        max-width: unset;
        flex: 1;
        padding-right: calc(1rem + 15px);
        padding-left: 20px;
    }
    .admin-contract-modal .documents-row .row.mt-2.mb-2 {
        width: 100%;
        margin: 0;
        display: grid;
        grid-template-columns: auto 1fr 1fr;
    }
    .admin-contract-modal .system-settings-container {
        grid-template-columns: 1fr;
    }
    .admin-contract-modal
        .system-settings-container
        .system-setting
        .custom-switch {
        display: grid;
        padding-left: 3rem;
    }
    .admin-contract-modal .system-settings-container .system-settings-amount {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: auto auto;
    }
}

.btn-outline-light svg,
.action-icon svg {
    min-width: 16px;
    min-height: 16px;
}

.AdminContractfromDate {
    margin-bottom: var(--elementMargin);
}

#edit-contract-modal {
    padding-left: 0 !important;
}

.modal-btn {
    width: 100%;
    height: 59px;
}
.modal-btn .btn-content {
    display: flex;
    align-items: center;
}
</style>
