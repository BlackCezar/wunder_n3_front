<script setup lang="ts">
import { useCustomerStore } from "~/store/customers";
import { storeToRefs } from "pinia";
import { computed, watchEffect } from "#imports";
import { useAuthStore } from "~/store/auth";
import { useAccountStore } from "~/store/accounts";
import { useRegionStore } from "~/store/regions";
import { SystemName } from "~/types/region.interface";
import { ContractType } from "~/types/contract.interface";

const customerStore = useCustomerStore();
const authStore = useAuthStore();
const auth = useAuthStore();
const { t } = useI18n();
const { forms } = storeToRefs(customerStore);
const regionStore = useRegionStore();
const accountStore = useAccountStore();
const { data: user } = await useAsyncData("me", () => auth.getProfile());
const customer = computed(() => user.value?.customer);

watchEffect(() => {
    if (customer.value?.id) {
        accountStore.getCustomerAccounts(customer.value?.id);
    }
});

const { isLoading, accounts } = storeToRefs(accountStore);
const { getActiveContract: contract, getSettings } = storeToRefs(authStore);
const { systems } = storeToRefs(regionStore);

const isDisabled = computed(() => {
    return contract.value && customer.isActive && customer.planFixId;
});

const isTopUpDisabled = computed(() => {
    return !(customer.isActive && accounts.value?.length);
});

const isTransferDisabled = computed<boolean>(() => {
    if (contract.value?.contractType === ContractType.STANDARD) {
        return getSettings.value?.allowTransfer ?? true;
    } else if (getSettings.value?.allowTransfer) {
        return getSettings.value.allowTransfer;
    }
    return true;
});
const hasNoAnyAccounts = computed(() => !accounts.value?.length);
const accountsMap = computed(() => {
    let list = {};
    for (let system of systems.value) {
        list[system.name] = [];
    }
    for (let account of accounts.value) {
        if (Array.isArray(list[account.system.name])) {
            list[account.system.name].push(account);
        } else list[account.system.name] = account;
    }
    return list;
});
const systemSettings = computed(() => {
    if (contract.value?.contractType === ContractType.STANDARD) {
        return regionStore.globalSystemSettings;
    } else return contract.value?.systemSettings;
});

const createAccount = () => {
    useEvent("modal:add-account");
};
</script>

<template>
    <div>
        <div class="page-header-3">
            {{ t("Navigation.AccountManagement").toUpperCase() }}
        </div>
        <div class="accounts-buttons-container">
            <b-button
                variant="danger"
                class="general-button accounts-button"
                :disabled="isDisabled"
                @click="createAccount"
            >
                + {{ t("AccountManagement.CreateAccount") }}
            </b-button>
            <b-button
                variant="primary"
                class="general-button accounts-button"
                :disabled="isTopUpDisabled"
            >
                {{ t("AccountManagement.TopUpAccount") }}
            </b-button>
            <b-button
                variant="primary"
                class="general-button accounts-button"
                :disabled="isTransferDisabled"
            >
                {{ t("AccountManagement.Transfer") }}
            </b-button>
        </div>
        <div v-if="isLoading">
            <div class="text-center">
                <b-spinner
                    variant="danger"
                    class="ms-3"
                    label="Spinning"
                ></b-spinner>
            </div>
        </div>
        <div class="accounts-tables-container" v-else-if="!hasNoAnyAccounts">
            <template
                v-for="systemName in Object.keys(accountsMap)"
                :key="'account-table-' + systemName"
            >
                <AccountsTable
                    v-if="accountsMap[systemName].length && contract"
                    :system="systemName as SystemName"
                    :accounts="accountsMap[systemName]"
                    :customer-id="contract.customerId"
                    :contract-type="contract && contract.contractType"
                    :allow-transfer="!isTransferDisabled || false"
                    :is-active="contract && contract.isActive"
                />
            </template>
        </div>
        <div v-else>
            <h3 class="no-accounts">
                {{ $t("AccountManagement.NoAccounts") }}
            </h3>
        </div>
        <AccountsModalCreate
            v-if="systemSettings?.length"
            :accounts="accounts ? accounts : []"
            :systemSettings="systemSettings"
            :systems="systems"
        />
    </div>
</template>

<style lang="css">
@import "assets/css/accounts.css";
</style>
