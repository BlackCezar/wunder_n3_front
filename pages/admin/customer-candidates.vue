<template>
    <div>
        <div class="page-header-3">
            {{ $t("Navigation.customerCandidates").toUpperCase() }}
        </div>
        <div>
            <LazyAdminCandidatesCustomerTable :clients="candidates" :is-loading="isLoading" />
            <b-pagination class="mt-3" :align="'center' as AlignmentJustifyContent" v-model="filters.page"
                v-if="candidates && candidates.length" :total-rows="candidatesTotal" :per-page="filters.limit"
                aria-controls="my-table" />
            <LazyAdminCandidatesModal :clients="candidates" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/store/customers";
import { storeToRefs } from "pinia";
import { useUrlSearchParams } from "@vueuse/core";
import { useEvent } from "~/composables/useEventBus";
import type { AlignmentJustifyContent } from "bootstrap-vue-next";
import {
    LazyAdminCandidatesCustomerTable,
    LazyAdminCandidatesModal,
} from "#components";
import { toast } from "vue3-toastify";

const customerStore = useCustomerStore();
const { candidates, candidatesTotal, filters, isLoading } =
    storeToRefs(customerStore);

onMounted(async () => {
    await customerStore.loadCandidates();
    if (searchParams.id) {
        const candidate = candidates.value?.find(
            (item) => item.id.toString() === searchParams.id,
        );
        console.log("found candidate");
        if (candidate) useEvent("modal:show-customer-candidate", candidate);
        delete searchParams.id;
    }
});

const searchParams = useUrlSearchParams<{
    id?: string;
}>("history");

watch(
    () => filters.value.page,
    () => {
        customerStore.loadCandidates();
    },
);

useListen('delete:customer-candidate', async (id) => {
    await customerStore.removeCustomerCandidate(id)
    toast.success('Успешно удалено')
})
</script>
