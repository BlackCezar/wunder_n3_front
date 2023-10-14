<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccountStore } from "@/store/accounts";
import { useCustomerStore } from "@/store/customers";
import { useRegionStore } from "@/store/regions";
import * as Yup from "yup";
import DynamicForm from "@/components/forms/DynamicForm.vue";
import { SystemName } from "@/types/region.interface";

const accountStore = useAccountStore();
const customerStore = useCustomerStore();
const regionStore = useRegionStore();
const { systems } = storeToRefs(regionStore);
const { form } = storeToRefs(accountStore);
const { list } = storeToRefs(customerStore);
const isLoading = ref<boolean>(false);
const { t } = useI18n();

const accountSystemName = computed<SystemName>(() => {
    const system = systems.value.find(
        (s) => s.id === form.value.account?.systemId,
    );
    return system ? (system.name as SystemName) : ("" as SystemName);
});

const isShowInput = (name: string, system: SystemName) => {
    switch (system) {
        case SystemName.GoogleAds:
            return [
                "externalAgency",
                "externalClientId",
                "externalAccountId",
                "externalRegion",
            ].includes(name);
        case SystemName.YandexDirect:
            return [
                "externalClientId",
                "externalAccountId",
                "externalRegion",
                "accountLogin",
                "accountPassword",
            ].includes(name);
        case SystemName.Twitter:
            return false;
        case SystemName.Telegram:
            return false;
        case SystemName.AppleSearch:
            return false;
        case SystemName.YandexNavigator:
            return [
                "externalClientId",
                "externalAccountId",
                "externalRegion",
                "accountLogin",
                "accountPassword",
            ].includes(name);
        case SystemName.TikTok:
            return ["externalClientId", "externalRegion"].includes(name);
        case SystemName.Facebook:
            return ["externalClientId", "externalRegion"].includes(name);
        case SystemName.MyTarget:
            return ["externalClientId", "externalRegion"].includes(name);
        case SystemName.DV360:
            return false;
        case SystemName.VK:
            return false;
        case SystemName.OK:
            return false;
        case SystemName.LinkedIn:
            return false;
        case SystemName.YandexView:
            return [
                "externalClientId",
                "externalAccountId",
                "externalRegion",
                "accountLogin",
                "accountPassword",
            ].includes(name);
    }
};

const getSystemPlaceholder = (name: string, system: SystemName) => {
    if (name === "externalAccountId") {
        if (system === SystemName.GoogleAds) {
            return t("AccountManagement.AccountGoogleExternalId");
        } else if (
            [
                SystemName.YandexDirect,
                SystemName.YandexNavigator,
                SystemName.YandexView,
            ].includes(system)
        ) {
            return t("AccountManagement.AccountExternalYDId");
        } else {
            return t("AccountManagement.AccountExternalId");
        }
    } else if (name === "externalClientId") {
        if (
            [
                SystemName.YandexDirect,
                SystemName.YandexNavigator,
                SystemName.YandexView,
            ].includes(system)
        ) {
            return t("AccountManagement.AccountExternalYDCustomerId");
        } else if (system === SystemName.Facebook) {
            return t("AccountManagement.AccountExternalMetaCustomerId");
        } else if (system === SystemName.MyTarget) {
            return t("AccountManagement.AccountExternalMTCustomerId");
        } else {
            return t("AccountManagement.AccountExternalCustomerId");
        }
    } else if (name === "externalAgency") {
        return t("AccountManagement.AccountExternalAgency");
    } else if (name === "externalRegion") {
        return t("AccountManagement.AccountRegion");
    }
};
const { setValues, handleSubmit } = useForm();

const saveAccount = handleSubmit(async (values) => {
    isLoading.value = true;
    if (form.value.account && form.value.id) {
        if (form.value.isActivate) {
            await accountStore.activate(form.value.id, {
                ...values,
                balance: 0,
            });
        } else
            await accountStore.update({
                id: form.value.id,
                ...values,
            });
        accountStore.resetForm();
        useEvent("modal-close:edit-account");
        isLoading.value = false;
    }
});
const customer = computed(() => {
    return list.value.find((c) => c.id === form.value.customerId);
});

const formSchema = ref<{
    fields: any[];
}>({
    fields: [],
});

watchEffect(() => {
    formSchema.value.fields = [];
    if (isShowInput("externalAgency", accountSystemName.value))
        formSchema.value.fields.push({
            as: "BFormInput",
            name: "externalAgency",
            rules: Yup.string().optional(),
            placeholder: getSystemPlaceholder(
                "externalAgency",
                accountSystemName.value,
            ),
        });

    if (isShowInput("externalClientId", accountSystemName.value))
        formSchema.value.fields.push({
            as: "BFormInput",
            name: "externalClientId",
            rules: Yup.string().optional(),
            placeholder: getSystemPlaceholder(
                "externalClientId",
                accountSystemName.value,
            ),
        });

    if (isShowInput("externalAccountId", accountSystemName.value))
        formSchema.value.fields.push({
            as: "BFormInput",
            name: "externalAccountId",
            rules: Yup.string().optional(),
            placeholder: getSystemPlaceholder(
                "externalAccountId",
                accountSystemName.value,
            ),
        });

    if (isShowInput("externalRegion", accountSystemName.value))
        formSchema.value.fields.push({
            as: "BFormInput",
            name: "externalRegion",
            rules: Yup.string().optional(),
            placeholder: getSystemPlaceholder(
                "externalRegion",
                accountSystemName.value,
            ),
        });

    if (isShowInput("accountPassword", accountSystemName.value))
        formSchema.value.fields.push({
            as: "BFormInput",
            name: "accountPassword",
            rules: Yup.string().optional(),
            placeholder: getSystemPlaceholder(
                "accountPassword",
                accountSystemName.value,
            ),
        });

    if (isShowInput("accountLogin", accountSystemName.value))
        formSchema.value.fields.push({
            as: "BFormInput",
            name: "accountLogin",
            rules: Yup.string().optional(),
            placeholder: getSystemPlaceholder(
                "accountLogin",
                accountSystemName.value,
            ),
        });

    if (isShowInput("balance", accountSystemName.value))
        formSchema.value.fields.push({
            as: "BFormInput",
            name: "balance",
            rules: Yup.number().optional(),
            placeholder: getSystemPlaceholder(
                "balance",
                accountSystemName.value,
            ),
        });
});
onMounted(() => {
    if (form.value?.account) {
        setValues(form.value.account);
    }
});
</script>
<template>
    <div v-if="form.account">
        <div
            class="top-up-tab active m-auto create-account-title"
            v-if="customer"
        >
            <div class="create-account-name">
                {{ customer.companyName }}
            </div>
            <div>
                <img
                    class="create-account-img"
                    :src="systemsToImg.get(accountSystemName)"
                    alt="activateAccountName"
                />
            </div>
        </div>
        <form @submit.prevent="saveAccount" class="px-4 pb-4 pt-0">
            <div
                v-for="{ name, label, children, ...attrs } in formSchema.fields"
                :key="name"
            >
                <UiFormInput :name="name" :label="label" v-bind="attrs" />
            </div>
        </form>
        <b-button
            :disabled="isLoading"
            style="width: 100%; height: 59px"
            variant="danger"
            @click="saveAccount"
        >
            <template v-if="isLoading">
                {{
                    form.isActivate
                        ? $t("AccountManagement.Activate")
                        : $t("AccountManagement.Save")
                }}
                <b-spinner class="white ml-3" />
            </template>
            <template v-else>
                {{
                    form.isActivate
                        ? $t("AccountManagement.Activate")
                        : $t("AccountManagement.Save")
                }}
            </template>
        </b-button>
    </div>
</template>
