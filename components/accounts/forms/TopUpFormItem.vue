<script setup lang="ts">
import { systemsToImg } from "~/composables/useSystems";
import type {
    ICustomerSystemSettings,
    IRegionSystemSettings,
} from "~/types/region.interface";
import TopUpFormItemAccount from "./TopUpFormItemAccount.vue";

defineProps<{
    system: IRegionSystemSettings | ICustomerSystemSettings;
    index: number;
}>();
</script>

<template>
    <div>
        <label class="selected-system">
            <span class="selected-systems-icon">
                <img
                    :src="systemsToImg.get(system.systemName)"
                    :alt="system.systemName"
                />
            </span>
            <Field
                :name="`topUpAccounts[${index}].isActive`"
                type="checkbox"
                class="form-check-input"
                :value="true"
            />
        </label>

        <TopUpFormItemAccount :system-id="system.id" :system-index="index" />
    </div>
</template>

<style scoped lang="css">
.selected-system {
    cursor: pointer;
}
</style>
