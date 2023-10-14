<template>
    <div>
        <div class="page-header-3">
            {{ $t("Navigation.customerCandidates").toUpperCase() }}
        </div>
        <div>
            <AdminCandidatesCustomerTable
                :clients="candidates"
                :is-loading="isLoading"
            />
            <b-pagination
                class="mt-3"
                align="center"
                v-model="filters.page"
                v-if="candidates && candidates.length"
                :total-rows="candidatesTotal"
                :per-page="filters.limit"
                aria-controls="my-table"
            />
            <AdminCandidatesModal
                :clients="candidates"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/store/customers";
import { storeToRefs } from "pinia";

const customerStore = useCustomerStore();
const { candidates, candidatesTotal, filters, isLoading } = storeToRefs(customerStore);

onMounted(() => {
    customerStore.loadCandidates();
});

watch(() => filters.value.page, () => {
    customerStore.loadCandidates();
})
</script>
