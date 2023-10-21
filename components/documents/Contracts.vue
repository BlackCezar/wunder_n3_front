<script setup lang="ts">
import DocumentsTableWrapper from "./TableWrapper.vue";
import {
    ContractType,
    type IContract,
    type IContractFilters,
} from "~/types/contract.interface";
import { useContractStore } from "~/store/contracts";
import { storeToRefs } from "pinia";
import { useRegionStore } from "~/store/regions";
import { PayType } from "~/types/region.interface";
import { useAuthStore } from "~/store/auth";
import { watchThrottled } from "@vueuse/shared";

const contractStore = useContractStore();
const { isLoading } = storeToRefs(contractStore);
const regionStore = useRegionStore();
const { globalSettings } = storeToRefs(regionStore);

const props = defineProps<{
    contracts: IContract[];
    filters: IContractFilters;
}>();

const { t } = useI18n();
const authStore = useAuthStore();

const mappedItems = computed(() => {
    if (props.contracts && props.contracts.length) {
        return props.contracts.map((contract) => {
            let documentLink = globalSettings.value?.publicContract ?? "#";
            if (
                contract.contractType !== ContractType.STANDARD &&
                contract.documents?.length
            ) {
                const doc =
                    contract.documents.length > 0
                        ? contract.documents[0]
                        : null;
                if (doc) {
                    documentLink = `/api/documents/public/contracts/${doc.link}`;
                    console.log(documentLink);
                }
            }
            let activeSystems = {
                contractType: contract.contractType,
                systems: contract.systemSettings.filter((sys) => sys.isActive),
            };
            return {
                transfer: activeSystems,
                contractTypeSimple: contract.contractType,
                contractDate: {
                    startDate: contract.startDate
                        ? new Date(contract.startDate).toLocaleDateString()
                        : "",
                    expireDate: contract.expireDate
                        ? new Date(contract.expireDate).toLocaleDateString()
                        : "",
                },
                contractService: contract.contractService,
                contractStatus: contract.isActive,
                paymentTerms:
                    contract.settings.payType === PayType.PREPAY
                        ? t("Settings.prepay")
                        : t("Settings.PostPay"),
                downloadDocuments: contract.documents,
                documentLink: documentLink,
            };
        });
    }
    return [];
});
const loadContracts = async () => {
    await contractStore.getCustomerContracts(
        authStore.user?.customer?.id,
        props.filters,
    );
};

onMounted(loadContracts);
watchThrottled(props.filters, loadContracts, {
    throttle: 300,
});

const fields = markRaw([
    {
        key: "transfer",
        label: t("Documents.Transfer"),
        sortable: true,
        tdClass: "document-transfer",
    },
    {
        key: "contractTypeSimple",
        label: t("Documents.DocumentType"),
        sortable: true,
        tdClass: "document-type",
    },
    {
        key: "contractDate",
        label: t("Documents.DocumentDate"),
        sortable: true,
        tdClass: "document-date",
    },
    {
        key: "contractService",
        label: t("Documents.ContractService"),
        sortable: true,
        tdClass: "contract-service",
    },
    {
        key: "contractStatus",
        label: t("Documents.ContractStatus"),
        sortable: true,
        tdClass: "contract-status",
    },
    {
        key: "paymentTerms",
        label: t("Documents.PaymentTerms"),
        sortable: true,
        tdClass: "payment-terms",
    },
    {
        key: "documentLink",
        label: "",
        sortable: false,
        tdClass: "document-download",
    },
]);
</script>

<template>
    <div class="contracts">
        <div class="contracts-table">
            <DocumentsTableWrapper
                :is-loading="isLoading"
                :items="mappedItems"
                :fields="fields"
            />
        </div>
    </div>
</template>

<style scoped lang="css"></style>
