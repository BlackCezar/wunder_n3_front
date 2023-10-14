<template>
    <div class="admin-customer-contracts-list yyy">
        <b-list-group v-if="contracts && contracts.length">
            <template v-for="contract in contracts" :key="contract.id">
                <b-list-group-item
                    class="d-flex justify-content-between align-items-center"
                >
                    <AdminContractsItem :contract="contract" />
                </b-list-group-item>
            </template>
        </b-list-group>
    </div>
</template>

<script setup lang="ts">
import { IContract } from "types/contract.interface";
import AdminContractsItem from "./Item.vue";

defineProps<{
    contracts: IContract[];
}>();
</script>
