<template>
    <div class="admin-customer-contracts">
        <div class="top-up-tab active m-auto">
            {{ $t("EditClient.ContractConditions") }}
        </div>
        <div class="p-4 w-100">
            <div v-if="isLoading" class="d-flex justify-content-center">
                <b-spinner />
            </div>
            <template v-else>
                <h3 v-if="customerList?.length === 0">
                    {{ $t("EditClient.NoContracts") }}
                </h3>
                <AdminContractsList v-else :contracts="customerList" />
            </template>
        </div>

        <b-button
            class="modal-close"
            @click="useEvent('modal-close:edit-contracts')"
            variant="outline-danger"
        >
            {{ $t("common.cancel") }}
        </b-button>
        <b-button
            style="width: 100%; height: 59px"
            variant="danger"
            @click="showNewContractModal"
        >
            {{ $t("EditClient.AddNewContract") }}
        </b-button>
        <b-modal
            hide-header
            hide-footer
            id="edit-contract-modal"
            ref="edit-contract-modal"
            v-model="editContractModal"
        >
            <AdminContractsModal
                v-if="editContractModal && activeContract"
                :contract="activeContract"
            />
        </b-modal>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import AdminContractsList from "./List.vue";
import AdminContractsModal from "./Modal.vue";
import { useContractStore } from "~/store/contracts";
import { useRegionStore } from "~/store/regions";
import { ContractType } from "~/types/contract.interface";
import { useCustomerStore } from "~/store/customers";
import { useAuthStore } from "~/store/auth";

const contractStore = useContractStore();
const regionStore = useRegionStore();
const { contractId, customerList, activeContract } = storeToRefs(contractStore);
const { globalSystemSettings, globalSettings } = storeToRefs(regionStore);

const wrappedSystems = computed(() => globalSystemSettings.value.slice());
const editContractModal = ref<boolean>(false);
const { user } = useAuthStore();
const customerStore = useCustomerStore();
const { customerForm } = storeToRefs(customerStore);
const isLoading = ref<boolean>(true);

onMounted(async () => {
    if (customerForm.value.id) {
        const list = await customerStore.getCustomerContracts(
            customerForm.value.id,
        );
        contractStore.setCustomerList(list);
        isLoading.value = false;
    }
});

const settings = computed(() => {
    if (user && Array.isArray(user.settings) && user.settings?.length) {
        return user.settings.find((s) => !s.customerId);
    }
    return globalSettings;
});

useListen("modal:edit-contract", async ({ contract, cb }) => {
    const details = await contractStore.getDetails(contract.id);
    contractStore.setActiveContract(details);
    console.log("!!!!");
    editContractModal.value = true;
    if (cb) cb();
});
useListen("modal-close:edit-contract", () => {
    editContractModal.value = false;
});

const showNewContractModal = () => {
    editContractModal.value = true;
    contractStore.setActiveContract({
        id: 0,
        contractType: ContractType.STANDARD,
        isActive: true,
        documents: [],
        customerId: customerForm.value.id || undefined,
        expireDate: "",
        startDate: " ",
        contractService: "Зачисление средств",
        settings: { ...settings.value },
        systemSettings: wrappedSystems.value,
    });
};
</script>

<style scoped lang="css">
@media screen and (max-width: 768px) {
    .admin-customer-contracts .top-up-tab {
        padding: 10px;
    }
    .admin-customer-contracts .p-4 {
        padding: 15px !important;
    }
}
</style>
