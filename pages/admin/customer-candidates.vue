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
            <AdminCandidatesModal :clients="candidates" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/store/customers";
import { storeToRefs } from "pinia";
import { useUrlSearchParams } from "@vueuse/core/index";
import { useEvent } from "~/composables/useEventBus";

const customerStore = useCustomerStore();
const { candidates, candidatesTotal, filters, isLoading } =
    storeToRefs(customerStore);

onMounted(() => {
    customerStore.loadCandidates();
});

const searchParams = useUrlSearchParams<{
    id?: string;
}>("history");

if (searchParams.id) {
    const candidate = candidates.value?.find(
        (item) => item.id.toString() === searchParams.id,
    );
    if (candidate) useEvent("modal:show-customer-candidate", candidate);
    delete searchParams.id;
}

watch(
    () => filters.value.page,
    () => {
        customerStore.loadCandidates();
    },
);
</script>
