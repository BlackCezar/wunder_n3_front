<template>
    <div>
        <div class="d-flex justify-content-between">
            <h3 class="page-header-3">{{ $t("Rates.Rates") }}</h3>
            <b-button
                @click="fetchRates"
                class="w-auto mb-auto"
                variant="primary"
                >Обновить вручную</b-button
            >
        </div>
        <div class="rates__content">
            <AdminRatesList :is-loading="isLoading" :list="normalizedItems" />
        </div>
        <b-pagination
            class="mt-3"
            align="center"
            v-model="filters.page"
            v-if="list && list.length"
            :total-rows="totalItems"
            :per-page="filters.limit"
            aria-controls="my-table"
        />
    </div>
</template>

<script setup lang="ts">
import { useRatesStore } from "@/store/rates";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";

const ratesStore = useRatesStore();
const { isLoading, filters, list, totalItems } = storeToRefs(ratesStore);

const fetchRates = async () => {
    await ratesStore.fetchRates();
    toast.success("Успешно");
};
watch(
    filters,
    () => {
        ratesStore.getList();
    },
    {
        deep: true,
    },
);

onMounted(() => {
    ratesStore.getList();
});

const normalizedItems = computed(() => {
    return list.value.map((item) => {
        const date = new Date(item.date);

        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            sellUsd: item.usdRate,
            sellEur: item.eurRate,
            sellRub: item.rubRate,
        };
    });
});
</script>
