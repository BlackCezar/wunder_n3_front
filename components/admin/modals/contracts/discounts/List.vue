<script setup lang="ts">
import type { IDiscountItem } from '@/types/common';
import DiscountItem from './Item.vue'

defineProps<{
    list: IDiscountItem[];
}>()
</script>
<template>
    <h3>Список накопительных скидок по догвоору</h3>
    <div class="admin-customer-contracts-list mb-4">
        <div class="d-flex">
            <div class="discount-names mt-4">
                <span>Сумма</span>
                <span>Скидка</span>
                <span>Период</span>
                <span>Система</span>
            </div>
            <div style="width: 94px"></div>
        </div>
        <b-list-group v-if="list && list.length">
            <template v-for="item in list" :key="list.id">
                <b-list-group-item class="d-flex justify-content-between align-items-center">
                    <DiscountItem :item="item" />
                </b-list-group-item>
            </template>
        </b-list-group>
    </div>
</template>