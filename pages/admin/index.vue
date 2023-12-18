<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRegionStore } from "~/store/regions";
import { useCustomerStore } from "~/store/customers";
import { useAccountStore } from "~/store/accounts";
import { useListen } from "~/composables/useEventBus";
import { SystemName, type ISystem } from "~/types/region.interface";
import { CustomerEditTabs } from "~/types/common";
import AdminCustomersClientTable from "~/components/admin/customers/tables/ClientTable.vue";

const customerStore = useCustomerStore();
const accountStore = useAccountStore();
const regionStore = useRegionStore();
const { list: clients, filters, listTotal } = storeToRefs(customerStore);
const { systems } = storeToRefs(regionStore);
const route = useRoute();
const router = useRouter();

const clientsToAccounts = computed(() => {
    if (clients.value && systems.value) {
        const clientsToAccounts = new Map();

        for (const customer of clients.value) {
            clientsToAccounts.set(customer.id, new Map());

            for (const system of systems.value) {
                clientsToAccounts.get(customer.id).set(system.name, []);
            }

            if (customer.accounts) {
                for (const account of customer.accounts) {
                    const system = systems.value?.find(
                        (system: ISystem) => system.id === account.systemId,
                    );
                    if (system) {
                        clientsToAccounts
                            .get(customer.id)
                            .get(system.name)
                            .push(account);
                    }
                }
            }
        }
        return clientsToAccounts;
    }
    return new Map();
});

const searchFilter = () => {
    customerStore.loadCustomers();
};


watch(() => filters.value.page, searchFilter)
await customerStore.loadCustomers();
accountStore.getList();

const editDocumentsModal = ref(false);
const editContractsModal = ref(false);
const editClientModal = ref(false);
const editAccountModal = ref(false);

useListen("modal:edit-documents", (ev) => {
    editDocumentsModal.value = !editDocumentsModal.value;
});
useListen("modal:activate-account", (event) => {
    editAccountModal.value = true;
});
useListen("modal:edit-contracts", () => {
    editContractsModal.value = true;
});
useListen("modal:edit-client", () => {
    editClientModal.value = !editClientModal.value;
});
useListen("modal:edit-account", (payload) => {
    const account = accountStore.accounts.find(
        (acc) => acc.id === payload.accountId,
    );
    console.log("found account", account);
    accountStore.setForm({
        id: payload.accountId,
        customerId: payload.customerId,
        account,
    });
    editAccountModal.value = true;
});
useListen("modal-close:edit-account", () => {
    editAccountModal.value = false;
});
useListen("modal-close:edit-client", (customer) => {
    editClientModal.value = false;
    if (customer?.contracts?.length === 0) {
        editContractsModal.value = true;
    }
});
useListen("modal-close:edit-contracts", () => {
    editContractsModal.value = false;
});

watchEffect(() => {
    // Effect for open account edit modal
    if (
        !accountStore.isLoading &&
        accountStore.accounts.length &&
        route.query["account"] &&
        route.query["customer"]
    ) {
        useEvent("modal:edit-account", {
            accountId: Number(route.query.account),
            customerId: Number(route.query.customer),
            system: SystemName.GoogleAds,
        });
        router.replace({ query: null });
    }
});

watchEffect(() => {
    if (route.query["editClient"] && clients.value?.length) {
        const customer = clients.value?.find(
            (c) => c.id === Number(route.query["editClient"]),
        );
        if (customer) {
            const tabs = {
                regData: 0,
                regData2: 1,
                regData3: 2,
                regData4: 3,
                accountData: 4,
            };
            const tabsIndex = (route.query["tab"]?.toString() ??
                "regData") as keyof typeof tabs;
            customerStore.setActiveCustomer({
                tab: tabs[tabsIndex],
                id: customer.id,
                client: customer,
            });
            editClientModal.value = true;
            router.replace({ query: null });
        }
    }
});

watchEffect(() => {
    if (
        route.query["customer"] &&
        clients.value?.length &&
        route.query["invoice"]
    ) {
        const client = clients.value.find(
            (c) => c.id === Number(route.query.customer),
        );
        if (!client) return;
        customerStore.setActiveCustomer({
            id: Number(route.query.customer),
            client,
            tab: CustomerEditTabs.Invoices,
        });
        editDocumentsModal.value = !editDocumentsModal.value;
    }
});

definePageMeta({
    middleware: ["admin"],
});
</script>

<template>
    <div class="customers">
        <div class="page-header-3">
            {{ $t("Navigation.Clients").toUpperCase() }}
        </div>
        <div class="search-filter">
            <UiFormInput :placeholder="$t('Documents.EnterSearch')" inputId="search" name="customers-search" type="search"
                :inputModel="filters.query" v-model="filters.query" @input="searchFilter" />
        </div>
        <template v-if="filters.isLoading">
            <div class="text-center">
                <b-spinner class="danger ms-3" label="Spinning" />
            </div>
        </template>
        <template v-else>
            <AdminCustomersClientTable v-if="clients && clients.length" :clients="clients" :systems="systems"
                :clients-to-accounts="clientsToAccounts" />
            <div v-else class="no-clients">
                {{ $t("Navigation.NoClients") }}
            </div>
            <b-pagination class="mt-3" align="center" v-model="filters.page" v-if="clients && clients.length"
                :total-rows="listTotal" :per-page="filters.limit" aria-controls="my-table" />
        </template>
        <b-modal hide-footer hide-header size="xl" v-model="editDocumentsModal" id="edit-documents-modal"
            ref="edit-documents-modal">
            <AdminModalsInvoicesList />
        </b-modal>
        <b-modal hide-footer hide-header id="edit-contracts-modal" ref="edit-contracts-modal" v-model="editContractsModal">
            <AdminModalsContractsWrapper v-if="editContractsModal" />
        </b-modal>
        <b-modal hide-header hide-footer id="edit-client-modal" ref="edit-client-modal" v-model="editClientModal">
            <AdminModalsCustomers v-if="editClientModal" />
        </b-modal>
        <b-modal hide-header hide-footer id="edit-account-modal" @hidden="$emit('resetEditAccount')"
            v-model="editAccountModal">
            <AdminModalsAccountsEdit />
        </b-modal>
    </div>
</template>

<style lang="css">
@import "assets/css/customers.css";
</style>
