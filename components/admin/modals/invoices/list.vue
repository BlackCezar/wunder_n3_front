<script setup lang="ts">
import { useCustomerStore } from "~/store/customers";
import { storeToRefs } from "pinia";
import { useInvoiceStore } from "~/store/invoices";
import type { IInvoice } from "~/types/invoice.interface";
import ListItem from "~/components/admin/modals/invoices/ListItem.vue";
import EditItem from "~/components/admin/modals/invoices/EditItem.vue";
import { useLogger } from "vue-logger-plugin";

const customerStore = useCustomerStore();
const { activeCustomer } = storeToRefs(customerStore);
const invoicesStore = useInvoiceStore();
const { isLoading } = storeToRefs(invoicesStore);
const invoices = ref<IInvoice[]>([]);
const selectedInvoice = ref<IInvoice | null>(null);
const editInvoice = ref<boolean>(false);
const log = useLogger()
const route = useRoute()
const router = useRouter()

watchEffect(async () => {
    if (activeCustomer.value?.id) {
        invoices.value = await invoicesStore.getInvoices(
            activeCustomer.value.id,
        );
        log.info('Active customer invoices loaded')
    }
});

const onInvoiceEditStart = (invoice: IInvoice) => {
    editInvoice.value = true;
    selectedInvoice.value = invoice;
    log.info('Start edit invoice')
}

useListen("modal:edit-invoice", onInvoiceEditStart);

const invoiceName = computed(() => {
    if (selectedInvoice.value)
        return `№${selectedInvoice.value.invoiceNumber} от ${new Date(
            selectedInvoice.value.createdAt,
        ).toLocaleDateString()}`;
    return "";
});



useListen("modal:edit-invoice:save", (invoice) => {
    invoices.value = invoices.value.map((i) =>
        i.id === invoice.id ? invoice : i,
    );
    log.info('Invoice save')
});

watchEffect(() => {
    if (route.query['invoice'] && activeCustomer.value?.id && invoices.value?.length) {
        const invoice = invoices.value.find(i => i.id === Number(route.query.invoice))
        if (!invoice) return;
        onInvoiceEditStart(invoice)
        router.replace({ query: null });
    }
})
</script>

<template>
    <div class="admin-customer-invoices-list">
        <h2>
            {{ $t("EditClient.Bills") }}
        </h2>
        <template v-if="isLoading">
            <b-spinner class="mx-auto d-block my-4" />
        </template>
        <template v-else>
            <h3 v-if="invoices.length === 0">
                {{ $t("EditClient.NoBills") }}
            </h3>
            <div v-else class="admin-customer-invoices-items">
                <div v-for="invoice of invoices" :key="invoice.id" class="admin-customer-invoices-item">
                    <ListItem :invoice="invoice" />
                </div>
            </div>
        </template>
        <b-modal id="edit-invoice" hide-footer size="xl" v-model="editInvoice" @close="selectedInvoice = null">
            <template #header>
                <h3>{{ invoiceName }}</h3>
            </template>
            <EditItem v-if="selectedInvoice" :invoice="selectedInvoice" />
        </b-modal>
    </div>
</template>

<style scoped lang="css">
.admin-customer-invoices-list {
    padding: 1rem;
}

.admin-customer-invoices-list h2 {
    text-align: center;
}

.admin-customer-invoices-list h3 {
    text-align: center;
    font-weight: normal;
    font-size: 1.5rem;
    padding-top: 1rem;
}

#edit-invoice h3 {
    text-align: center;
}

.admin-customer-invoices-items {
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.admin-customer-invoices-item {
    border: 1px solid;
    padding: 1rem 1.25rem;
}

@media (min-width: 1024px) {
    .admin-customer-invoices-list {
        padding: 2rem;
    }
}
</style>
