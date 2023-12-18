<script setup lang="ts" >
import { SystemName } from "~/types/region.interface";

const options = ref([{
    value: 'month',
    text: 'Месяц'
}])
</script>
<template >
    <form class="p-4 d-flex flex-col gap-4">
        <UiFormInput type="string" name="amount" label="необходимая сумма" />
        <UiFormInput type="string" name="discount" label="Доп. скидка" />
        <UiFormInput type="select" name="period" :options="options" label="Период" />
        <UiFormInput label="Система" type="select" name="system" :options="Object.values(SystemName)" />
    </form>
</template>