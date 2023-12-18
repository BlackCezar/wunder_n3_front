<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccountStore } from "~/store/accounts";
import { useCustomerStore } from "~/store/customers";
import { useRegionStore } from "~/store/regions";
import { ISystem } from "~/types/region.interface";
import AdminCustomersClientTable from "~/components/admin/customers/tables/ClientTable.vue";

const customerStore = useCustomerStore();
const { list: clients, filters, listTotal } = storeToRefs(customerStore);
const regionStore = useRegionStore();
const { systems } = storeToRefs(regionStore);
const accountStore = useAccountStore();

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

await customerStore.loadCustomers();
accountStore.getList();
</script>
<template>
    <div>
        <div class="page-header-3">
            {{ $t("Navigation.AccountManagement").toUpperCase() }}
        </div>
        <AdminCustomersClientTable
            v-if="clients && clients.length"
            :clients="clients"
            :systems="systems"
            group-view
            :clients-to-accounts="clientsToAccounts"
        />
        <div v-else class="no-clients">
            {{ $t("Navigation.NoClients") }}
        </div>
        <b-pagination
            class="mt-3"
            align="center"
            v-model="filters.page"
            v-if="clients && clients.length"
            :total-rows="listTotal"
            :per-page="filters.limit"
            aria-controls="my-table"
        />
    </div>
</template>
