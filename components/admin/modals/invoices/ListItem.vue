<script setup lang="ts">
import type { IInvoice } from "~/types/invoice.interface";
import { InvoiceStatusTranslate } from "~/types/invoice.interface";
import { useInvoiceStore } from "~/store/invoices";

const props = defineProps<{
    invoice: IInvoice;
}>();
const invoiceStore = useInvoiceStore();
const isRemoving = ref<boolean>(false);

const getDocumentName = computed(() => {
    return `№${props.invoice?.invoiceNumber} от ${new Date(
        props.invoice?.createdAt,
    ).toLocaleDateString()}`;
});

const removeInvoice = () => {
    isRemoving.value = true;
    if (window.confirm("Вы точно хотите удалить " + getDocumentName.value))
        invoiceStore.removeInvoice(props.invoice.id);
    isRemoving.value = false;
};
</script>

<template>
    <div class="invoice-item">
        <div class="invoice-item-name">
            <IBiFileEarmark />
            {{ getDocumentName }}
        </div>
        <div class="invoice-item-status">
            <BBadge>{{
                InvoiceStatusTranslate.get(invoice.status.toLowerCase())
            }}</BBadge>
        </div>
        <div class="invoice-item-buttons">
            <BButton
                variant="outline-primary"
                @click="useEvent('modal:edit-invoice', invoice)"
            >
                <span>{{ $t("Documents.Change") }}</span>
                <IBiPen />
            </BButton>
            <BButton
                :disabled="isRemoving"
                variant="outline-danger"
                @click="removeInvoice"
            >
                <span v-if="!isRemoving">{{ $t("Settings.remove") }}</span>
                <BSpinner v-else />
                <IBiTrash />
            </BButton>
        </div>
    </div>
</template>

<style scoped lang="css">
.invoice-item-status {
    margin-right: auto;
}
.invoice-item-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
}
.invoice-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}
.invoice-item-name {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
.btn svg {
    margin-left: 0.25rem;
}
</style>
