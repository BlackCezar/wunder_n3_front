<script setup lang="ts">
import { useRegionStore } from '~/store/regions'
import { useCustomerStore } from '~/store/customers'
import { storeToRefs } from "pinia";


const props = defineProps<{
    item: IDiscountItem;
}>()

const { formatter } = useFormat();
const regionStore = useRegionStore()
const { regionCurrency } = storeToRefs(regionStore)
const customerStore = useCustomerStore()

const removeDiscount = async () => {
    await customerStore.deleteDiscount(props.item.id)
    useEvent('delete:discount', props.item.id)
}
</script>
<template>
    <div class="admin-discounts-item">
        <div class="discount-names">
            <span>{{ formatter.format(item.amount) }} {{ regionCurrency }}</span>
            <span>{{ formatter.format(item.discount) }} {{ regionCurrency }}</span>
            <span>{{ item.period === 'month' ? 'Месяц' : '' }}</span>
            <span>{{ item.system }}</span>
        </div>

        <div class="discount-buttons">
            <b-button @click="editContract" style="font-size: 16px; line-height: 1em" variant="outline-primary"
                :disabled="isLoading">
                <template v-if="!isLoading">
                    <IBiPen />
                </template>
                <b-spinner small variant="dark" v-else />
            </b-button>
            <b-button @click="removeDiscount" variant="outline-danger">
                Удалить
                <IBiTrash />
            </b-button>
        </div>
    </div>
</template>
<style>
.admin-discounts-item {
    display: flex;
    width: 100%;
    align-items: center;
}

@media screen and (max-width: 768px) {
    .admin-discounts-item {
        display: grid;
        grid-template-columns: 16px auto auto;
        grid-gap: 10px;
    }
}

.admin-discounts-item .discount-buttons {
    display: grid;
    grid-gap: var(--elementMargin);
    margin-left: auto;
    grid-template-columns: 1fr 1fr;
}

.discount-names {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}

@media screen and (max-width: 768px) {
    .admin-discounts-item .discount-buttons {
        grid-auto-flow: row;
    }
}

.admin-discounts-item .discount-buttons .btn {
    font-size: 0;
}

.admin-discounts-item .discount-buttons .btn svg {
    font-size: 1rem;
}
</style>