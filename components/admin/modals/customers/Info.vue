<script setup lang="ts">
import { useCustomerStore } from "~/store/customers";

const customerStore = useCustomerStore();

const generatePassword = () => {
    if (customerStore.customerForm.id) {
        customerStore.changePassword(customerStore.customerForm.id);
    }
};
</script>
<template>
    <div>
        <client-only>
            <div>
                <div class="mb-3">{{ $t("Settings.changePassword") }}</div>
                <b-button
                    variant="danger"
                    type="button"
                    @click="generatePassword"
                >
                    {{ $t("Settings.generate") }}
                </b-button>
                <UiTableInput
                    name="planFixId"
                    :placeholder="$t('Settings.PlanFixId')"
                    :label="$t('Settings.PlanFixId')"
                    type="text"
                />
                <UiTableInput
                    :label="$t('AccountManagement.Active')"
                    name="isActive"
                    type="checkbox"
                />
                <UiTableInput
                    :label="$t('AccountManagement.IsNew')"
                    name="isNew"
                    type="checkbox"
                />
            </div>
        </client-only>
    </div>
</template>
