<script setup lang="ts">
import TopUpForm from "../forms/TopUpForm.vue";
import { ISystemSettings, SystemName } from "~/types/region.interface";
import { ContractType } from "~/types/contract.interface";
import { useAccountStore } from "~/store/accounts";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";

const isOpen = ref(false);
const accountId = ref<number>(0);
const selectedSystemName = ref<SystemName | null>(null);
const enabledSystems = ref<ISystemSettings[]>([])
const autoStore = useAuthStore();
const { getSystemSettings, contractType } = storeToRefs(autoStore);
const accountsStore = useAccountStore();
const { accounts } = storeToRefs(accountsStore);

watchEffect(() => {
    if (getSystemSettings.value && accounts.value?.length) {
        if (contractType.value === ContractType.STANDARD) {

        }
        enabledSystems.value = getSystemSettings.value.filter((item) =>
            accounts.value.find((account) => account.systemId === item.id),
        )
    }
})

useListen("modal:popup-account", (ev) => {
    if (ev) {
        selectedSystemName.value = ev.system;
        accountId.value = ev.accountId;
    } else if (enabledSystems.value.length) {
        selectedSystemName.value = enabledSystems.value[0].systemName
    }
    isOpen.value = true;
});

const resetData = () => {
    accountId.value = 0;
    selectedSystemName.value = SystemName.GoogleAds;
};
</script>
<template>
    <div>
        <b-modal hide-header v-model="isOpen" hide-footer id="top-up-modal" @close="resetData">
            <TopUpForm v-if="selectedSystemName" :enabled-systems="enabledSystems" :account-id="accountId"
                :system-name="selectedSystemName" />
        </b-modal>
    </div>
</template>
