<script setup lang="ts">
import { useUrlSearchParams } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useInvoiceStore } from "~/store/invoices";
import type { IContract, IContractFilters } from "~/types/contract.interface";
import type { AlignmentJustifyContent } from "bootstrap-vue-next";
import { InvoiceDocumentType } from "~/types/invoice.interface";

const props = defineProps<{
    contracts: IContract[];
    filters: IContractFilters;
}>();

const { t } = useI18n();
const invoiceStore = useInvoiceStore();
const params = useUrlSearchParams("history", {
    initialValue: {
        page: 1,
    },
});
const { isLoading, acts, totalActs } = storeToRefs(invoiceStore);
const loadActs = async () => {
    await invoiceStore.getCustomerActs({
        skip: (params.page - 1) * 10,
        query: props.filters.search,
        fromDate: props.filters.fromDate,
        endDate: props.filters.endDate,
        contract: props.filters.contractId
            ? Number(props.filters.contractId)
            : undefined,
    });
};

const items = computed(() =>
    acts.value.map((act) => {
        const contract = props.contracts.find((c) => c.id === act.contractId);
        if (!contract) return {};

        let amount = act.lines.reduce(
            (acc, next) =>
                (acc += next.accounts.reduce((a, ac) => (a += ac.sum), 0)),
            0,
        );
        amount += (amount * contract.settings.vat) / 100;

        let document = act.invoiceDocument.find(
            (item) => item.type === InvoiceDocumentType.SIGNED_ACT,
        );
        if (!document)
            document = act.invoiceDocument.find(
                (item) => item.type === InvoiceDocumentType.ACT,
            );
        return {
            hasOriginal: act.hasOriginal,
            transfer: {
                contractType: "COMPLEX",
                systems: act.lines.map((billLine) => {
                    return {
                        systemName: billLine.systemName,
                    };
                }),
            },
            documentName: t("AccountManagement.ActNumber", {
                number: act.invoiceNumber,
            }),
            documentBase: `Счет №${act.invoiceNumber}`,
            documentDate: act.createdAt
                ? new Date(act.createdAt).toLocaleDateString("ru-RU")
                : "-",
            amountVat: amount.toLocaleString("ru-RU", {
                style: "currency",
                currency: "BYN",
            }),
            downloadAct: `/download?type=${document?.type.toLowerCase()}s&name=${document?.link}`,
            type: "act",
            billClosed: act.status === "cancelled" || act.status === "void",
        };
    }),
);
const fields = computed(() => [
    {
        key: "documentName",
        label: t("Documents.Document"),
        sortable: true,
        tdClass: "document-transfer",
    },
    {
        key: "documentDate",
        label: t("Documents.DocumentDate"),
        sortable: true,
        tdClass: "document-date",
    },
    {
        key: "documentBase",
        label: t("Documents.DocumentBase"),
        sortable: true,
        tdClass: "document-base",
    },
    {
        key: "hasOriginal",
        label: t("Documents.HasOriginal"),
        sortable: true,
        tdClass: "document-has-original",
    },
    {
        key: "amountVat",
        label: t("Documents.AmountVat"),
        sortable: true,
        tdClass: "amount-vat",
    },
    {
        key: "downloadAct",
        label: "",
        sortable: false,
        tdClass: "document-download",
    },
]);

onMounted(() => {
    loadActs();
});
watch(
    () => props.filters,
    () => {
        loadActs();
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<template>
    <div class="finances">
        <div class="finances-table">
            <DocumentsTableWrapper
                :is-loading="isLoading"
                :items="items"
                :fields="fields"
            />
        </div>
        <b-pagination
            class="mt-3"
            :align="'center' as AlignmentJustifyContent"
            :model-value="Number(params.page)"
            @update:model-value="params.page = $event"
            v-if="acts && acts.length"
            :total-rows="totalActs"
            :per-page="10"
            aria-controls="acts-table"
        />
    </div>
</template>

<style scoped lang="css"></style>
