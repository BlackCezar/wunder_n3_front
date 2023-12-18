<template>
    <div>
        <div class="d-flex justify-content-between">
            <h3 class="page-header-3">{{ $t("Rates.Rates") }}</h3>
            <b-button @click="fetchRates" class="w-auto ml-auto mb-auto mr-2" variant="primary">Обновить вручную</b-button>
            <b-button @click="addRates" class="w-auto mb-auto" variant="primary">Добавить запись</b-button>
        </div>
        <div class="rates__content">
            <AdminRatesList :is-loading="isLoading" :list="normalizedItems" />
        </div>
        <b-pagination class="mt-3" align="center" v-model="filters.page" v-if="list && list.length" :total-rows="totalItems"
            :per-page="filters.limit" aria-controls="my-table" />
        <b-modal @cancel="resetForm" @ok="processForm" v-model="isShowAddRatesModal" title="Добавить запись в курсы валют"
            ok-title="Добавить" ok-variant="danger" cancel-variant="primary" cancel-title="Отменить">
            <AddRateForm />
        </b-modal>
    </div>
</template>

<script setup lang="ts">
import { useRatesStore } from "@/store/rates";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import AddRateForm from '~/components/admin/rates/AddRateForm.vue'

const ratesStore = useRatesStore();
const { isLoading, filters, list, totalItems } = storeToRefs(ratesStore);
const isShowAddRatesModal = ref(false)


const { resetForm, handleSubmit } = useForm()

const processForm = handleSubmit(async (val) => {
    ratesStore.addRecord(val)
})
const addRates = () => {
    isShowAddRatesModal.value = true
}
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
