<template>
    <form ref="editClientForm" @submit="saveCustomer">
        <b-tabs
            nav-class="tabs-header"
            content-class="p-4 w-100"
            fill
            v-model="activeTab"
        >
            <b-tab
                title-item-class="top-up-tab"
                active-tab-class="active"
                :title="$t('EditClient.RegData')"
            >
                <AdminMainDataTab />
            </b-tab>
            <b-tab
                :title="$t('EditClient.CompanyData')"
                title-item-class="top-up-tab"
                active-tab-class="active"
            >
                <AdminCompanyDataTab />
            </b-tab>
            <b-tab
                :title="$t('EditClient.ResponsiblePersonData')"
                title-item-class="top-up-tab"
                active-tab-class="active"
            >
                <AdminLiderInfoTab />
            </b-tab>
            <b-tab
                :title="$t('EditClient.BankData')"
                title-item-class="top-up-tab"
                active-tab-class="active"
            >
                <AdminBankInfoTab />
            </b-tab>
            <b-tab
                :title="$t('EditClient.AccountData')"
                title-item-class="top-up-tab"
                active-tab-class="active"
            >
                <AdminCustomersTabsInfo />
            </b-tab>
        </b-tabs>
        <b-button @click="cancel" class="cancel-btn" variant="outline-danger">
            {{ $t("common.cancel") }}
        </b-button>
        <b-button
            style="width: 100%; height: 59px"
            :disabled="!meta.valid || isLoading"
            variant="danger"
            type="submit"
        >
            <template v-if="isLoading"
                >{{ $t("AccountManagement.Save") }}
                <b-spinner variant="light" class="ms-3" />
            </template>
            <template v-else>{{ $t("AccountManagement.Save") }}</template>
        </b-button>
    </form>
</template>
<script setup lang="ts">
import AdminMainDataTab from "./MainData.vue";
import AdminCompanyDataTab from "./CompanyData.vue";
import AdminLiderInfoTab from "./LiderInfo.vue";
import AdminBankInfoTab from "./BankInfo.vue";
import AdminCustomersTabsInfo from "./Info.vue";
import * as Yup from "yup";
import { useCustomerStore } from "@/store/customers";
import { storeToRefs } from "pinia";

const isLoading = ref<boolean>(false);
const { t } = useI18n();

const schema = Yup.object().shape({
    companyName: Yup.string().required(t("Validation.required")),
    companyTaxNumber: Yup.string().required(t("Validation.required")),
    contactName: Yup.string().optional(),
    contactEmail: Yup.string()
        .required(t("Validation.required"))
        .email(t("Validation.InvalidEmail")),
    companyEmail: Yup.string()
        .required(t("Validation.required"))
        .email(t("Validation.InvalidEmail")),
    contactPhoneNumber: Yup.string().required(t("Validation.required")),
    companyPhoneNumber: Yup.string().required(t("Validation.required")),
    companyAddress: Yup.string().required(t("Validation.required")),
    postalAddress: Yup.string().required(t("Validation.required")),
    responsiblePersonFullName: Yup.string().required(t("Validation.required")),
    responsiblePersonPosition: Yup.string().required(t("Validation.required")),
    signatureDocumentType: Yup.string().required(t("Validation.required")),
    BIC: Yup.string().required(t("Validation.required")),
    bankAddress: Yup.string().required(t("Validation.required")),
    accountNumber: Yup.string().required(t("Validation.required")),
    bankName: Yup.string().required(t("Validation.required")),
    planFixId: Yup.string().required(t("Validation.required")),
    isActive: Yup.bool().required(t("Validation.required")),
    isNew: Yup.bool().optional(),
});

const customerStore = useCustomerStore();
const customerForm = customerStore.customerForm;
const { activeCustomer, activeTab } = storeToRefs(customerStore);
const { handleSubmit, meta, setValues, resetForm } = useForm({
    validationSchema: schema,
    initialValues: customerForm.client,
});

const cancel = () => {
    useEvent("modal-close:edit-client");
};

watch(
    activeCustomer,
    () => {
        if (activeCustomer.value) {
            setValues({
                ...activeCustomer.value,
            });
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

const saveCustomer = handleSubmit(async (values) => {
    console.log("save Customer", values);
    if (values) {
        isLoading.value = true;

        const payload = {
            ...values,
            planFixId: Number(values.planFixId),
        };
        if (values?.dateOfBirth)
            payload.dateOfBirth = new Date(values.dateOfBirth);
        await customerStore.updateCustomer(payload);
        isLoading.value = false;
        useEvent("modal-close:edit-client");
        resetForm();
    }
});
</script>
<style lang="css">
@import "assets/css/settingsForm.css";
.add-document {
    width: 100%;
    border: 1px solid var(--info);
    color: var(--info);
    min-height: var(--inputHeight);
    line-height: 1.2;
    font-weight: 400;
    font-style: italic;
}

.tabs-header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100%;
}
.tabs-header .top-up-tab {
    padding: 0;
}
.tabs-header .top-up-tab button {
    height: 100%;
    border-radius: 0;
    border-top: 0;
    padding: 5px;
}
@media screen and (max-width: 768px) {
    .tabs-header {
        display: grid !important;
        overflow-x: auto;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    .tabs-header .top-up-tab {
        padding: 0 !important;
    }
    .tabs-header .top-up-tab button {
        border: 0 !important;
        padding: 10px;
    }
}

.cancel-btn {
    display: none;
}
@media screen and (max-width: 768px) {
    .cancel-btn {
        width: 100%;
        height: 60px;
        margin-bottom: 10px;
        display: block;
    }
}

.edit-btn {
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
    display: block;
}
</style>
