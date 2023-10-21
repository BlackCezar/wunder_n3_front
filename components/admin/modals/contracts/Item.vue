<template>
    <div class="admin-customer-contracts-item">
        <IBiFileEarmark />
        Договор {{ contractType }} от {{ startDate }}
        <div class="contract-buttons">
            <b-button
                @click="editContract"
                style="font-size: 16px; line-height: 1em"
                variant="outline-primary"
                :disabled="isLoading"
            >
                <template v-if="!isLoading">
                    <IBiPen />
                </template>
                <b-spinner small variant="dark" v-else />
            </b-button>
            <b-button @click="removeContract" variant="outline-danger">
                Удалить
                <IBiTrash />
            </b-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useContractStore } from "@/store/contracts";
import { ContractType } from "~/types/contract.interface";
import type { IContract } from "~/types/contract.interface";

const isLoading = ref(false);
const props = defineProps<{
    contract: IContract;
}>();

const { t, locale } = useI18n();
const contractStore = useContractStore();

const editContract = () => {
    isLoading.value = true;
    useEvent("modal:edit-contract", {
        contract: props.contract,
        cb: () => {
            isLoading.value = false;
        },
    });
};

const removeContract = async () => {
    await contractStore.delete(props.contract.id);
};

const contractType = computed(() => {
    return props.contract.contractType === ContractType.STANDARD
        ? t("AccountManagement.Standard")
        : t("AccountManagement.Custom");
});

const startDate = computed(() => {
    return new Date(props.contract.startDate).toLocaleDateString(locale.value);
});
</script>

<style scoped lang="css">
.admin-customer-contracts-item {
    display: flex;
    width: 100%;
    align-items: center;
}
@media screen and (max-width: 768px) {
    .admin-customer-contracts-item {
        display: grid;
        grid-template-columns: 16px auto auto;
        grid-gap: 10px;
    }
}
.admin-customer-contracts-item .contract-buttons {
    display: grid;
    grid-gap: var(--elementMargin);
    margin-left: auto;
    grid-template-columns: 1fr 1fr;
}
@media screen and (max-width: 768px) {
    .admin-customer-contracts-item .contract-buttons {
        grid-auto-flow: row;
    }
}
.admin-customer-contracts-item .contract-buttons .btn {
    font-size: 0;
}
.admin-customer-contracts-item .contract-buttons .btn svg {
    font-size: 1rem;
}
</style>
