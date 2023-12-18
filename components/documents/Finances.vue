<script setup lang="ts">
import type { IContract, IContractFilters } from "~/types/contract.interface";
import { useContractStore } from "~/store/contracts";
import { storeToRefs } from "pinia";
import { useRegionStore } from "~/store/regions";
import { useInvoiceStore } from "~/store/invoices";
import {
    type IInvoice,
    type IInvoiceCachedSystemSettings,
    type IInvoiceLine,
    InvoiceDocumentType,
} from "~/types/invoice.interface";
import { CURRENCIES } from "~/types/region.interface";

const props = defineProps<{
    contracts: IContract[];
    filters: IContractFilters;
}>();

const { t } = useI18n();
const contractStore = useContractStore();
const regionStore = useRegionStore();
const invoiceStore = useInvoiceStore();
const page = ref<number>(1);
const { globalSystemSettings, regionCurrency } = storeToRefs(regionStore);
const { invoices, isLoading, totalInvoices } = storeToRefs(invoiceStore);

const getSumCommission = (
    lines: IInvoiceCachedSystemSettings["lines"],
    amount: number,
) => {
    for (const l of lines) {
        if (
            parseFloat(l.fromAmount) <= amount &&
            amount <= parseFloat(l.toAmount)
        ) {
            if (l.commission) return (amount * l.commission) / 100;
        }
    }
    return 0;
};

const getSumDiscount = (
    lines: IInvoiceCachedSystemSettings["lines"],
    amount: number,
) => {
    for (const l of lines) {
        if (
            parseFloat(l.fromAmount) <= amount &&
            amount <= parseFloat(l.toAmount)
        ) {
            if (l.discount) return (amount * l.discount) / 100;
        }
    }
    return 0;
};

const getEnrolledTable = (
    lines: IInvoiceLine[],
    bill: IInvoice,
    nds: number,
) => {
    const enrolledTable: { items: any[]; fields: any[] } = {
        items: [],
        fields: [
            {
                key: "accountName",
                label: t("Documents.LinesTableAccount"),
            },
            {
                key: "system",
                label: t("Documents.LinesTablePlatform"),
            },
            {
                key: "sum",
                label: t("Documents.LinesTableAmount"),
            },
            {
                key: "rate",
                label: t("Settings.Currency"),
            },
        ],
    };
    for (const line of lines) {
        const system = bill.cachedSystemSettings.find(
            (item) => item.systemName === line.systemName,
        );
        if (!system) continue;

        for (const account of line.accounts) {
            const commission = getSumCommission(system.lines, account.sum);
            const discount = getSumDiscount(system.lines, account.sum);
            let sum = account.sum - nds - commission + discount;
            let currency = regionCurrency.value;

            if (bill.rates) {
                if (system.currency === CURRENCIES.RUB && bill.rates.rubRate) {
                    sum /= Number(bill.rates.rubRate);
                    currency = system.currency;
                }
                if (system.currency === CURRENCIES.USD && bill.rates.usdRate) {
                    sum /= Number(bill.rates.usdRate);
                    currency = system.currency;
                }
                if (system.currency === CURRENCIES.EUR && bill.rates.eurRate) {
                    sum /= Number(bill.rates.eurRate);
                    currency = system.currency;
                }
            }

            enrolledTable.items.push({
                ...line,
                accountName: account.name,
                system: line.systemName,
                rate: currency,
                sum: sum.toLocaleString("by-BY"),
            });
        }
    }
    return enrolledTable;
};

const bills = computed(() => {
    return (
        invoices.value?.map((invoice) => {
            const contract = props.contracts.find(
                (c) => c.id === invoice.contractId,
            );
            if (!contract) return {};

            const date = new Date(invoice.createdAt);
            let amount = invoice.lines.reduce(
                (acc, next) =>
                    (acc += next.accounts.reduce((a, ac) => (a += ac.sum), 0)),
                0,
            );
            const nds =
                (amount * contract.settings.vat) / 100 + contract.settings.vat;

            const lines = getEnrolledTable(invoice.lines, invoice, nds);

            const document = invoice.invoiceDocument.find(
                (item) => item.type === InvoiceDocumentType.SIGNED_BILL,
            )
                ? invoice.invoiceDocument.find(
                      (item) => item.type === InvoiceDocumentType.SIGNED_BILL,
                  )
                : invoice.invoiceDocument.find(
                      (item) => item.type === InvoiceDocumentType.BILL,
                  );

            console.log("document", document);
            return {
                documentType: invoice.invoiceNumber,
                documentDate: date.toLocaleDateString(),
                id: invoice.id,
                billClosed:
                    invoice.status === "cancelled" || invoice.status === "void",
                contractType: contract ? contract.contractType : "-",
                amountVat: amount,
                documentEnrolled: lines,
                download: document?.link,
                type: "bill",
            };
        }) ?? []
    );
});
console.log("bills", bills.value);

const loadInvoices = async () => {
    await invoiceStore.getCustomerInvoices({
        skip: (page.value - 1) * 10,
        query: props.filters.search,
        fromDate: props.filters.fromDate,
        endDate: props.filters.endDate,
        contract: props.filters.contractId
            ? Number(props.filters.contractId)
            : undefined,
    });
};
const fields = markRaw([
    {
        key: "documentType",
        label: t("Documents.DocumentType"),
        sortable: true,
        tdClass: "document-type",
    },
    {
        key: "documentDate",
        label: t("Documents.DocumentDate"),
        sortable: true,
        tdClass: "document-date",
    },
    {
        key: "contractType",
        label: t("Documents.DocumentBase"),
        sortable: true,
        tdClass: "contract-type",
    },
    {
        key: "documentEnrolled",
        label: t("Documents.DocumentEnrolled"),
        sortable: true,
        tdClass: "document-enrolled",
    },
    {
        key: "amountVat",
        label: t("Documents.AmountVat"),
        sortable: true,
        tdClass: "amount-vat",
        formatter: (val: number) => {
            return val.toLocaleString("by-BY", {
                style: "currency",
                currency: regionStore.regionCurrency,
            });
        },
    },
    {
        key: "download",
        label: "",
        sortable: false,
        tdClass: "document-download",
    },
]);

onMounted(() => {
    loadInvoices();
});
watch(
    () => props.filters,
    () => {
        loadInvoices();
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
                :items="bills"
                :fields="fields"
            />
        </div>
        <b-pagination
            class="mt-3"
            align="center"
            v-model="page"
            v-if="bills && bills.length"
            :total-rows="totalInvoices"
            :per-page="10"
            aria-controls="my-table"
        />
    </div>
</template>

<style scoped lang="css"></style>
