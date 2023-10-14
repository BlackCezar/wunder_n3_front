<script setup lang="ts">
import { ContractType } from "@/types/contract.interface";
import { PayType } from "@/types/region.interface";

defineProps<{
    contractType: ContractType;
}>();



const { t } = useI18n();
const payTypes = markRaw([
    {
        value: PayType.PREPAY,
        text: t("Settings.PREPAY"),
    },
    {
        value: PayType.POSTPAY,
        text: t("Settings.POSTPAY"),
    },
    {
        value: PayType.EXPENSES,
        text: t("Settings.EXPENSES"),
    },
]);
</script>

<template>
    <div>
        <UiTableInput
            :label="$t('Settings.ratesAdds')"
            :placeholder="$t('Settings.ratesAdds')"
            :disabled="contractType === ContractType.STANDARD"
            type="number"
            name="settings.ratesAdds"
        />
        <UiTableInput
            :label="$t('Settings.freeHours')"
            :placeholder="$t('Settings.freeHours')"
            :disabled="contractType === ContractType.STANDARD"
            type="number"
            name="settings.freeHours"
        />
        <UiTableInput
            :label="$t('Settings.freeTimes')"
            :placeholder="$t('Settings.freeTimes')"
            name="settings.freeTimes"
            :disabled="contractType === ContractType.STANDARD"
            type="number"
        />
        <UiTableInput
            :label="$t('Settings.hourCost')"
            :placeholder="$t('Settings.hourCost')"
            type="number"
            step="0.01"
            name="settings.hourCost"
            :disabled="contractType === ContractType.STANDARD"
        />
        <UiTableInput
            :label="$t('Settings.vat')"
            :disabled="contractType === ContractType.STANDARD"
            :placeholder="$t('Settings.vat')"
            name="settings.vat"
            type="number"
        />
        <UiTableInput
            name="settings.projectId"
            :label="$t('Settings.projectId')"
            :placeholder="$t('Settings.projectId')"
            type="number"
        />
        <UiTableInput
            :label="$t('Settings.EnableEDN')"
            type="checkbox"
            name="settings.isEDNActive"
        />
        <UiTableInput
            :label="$t('Settings.allowTransfer')"
            type="checkbox"
            name="settings.allowTransfer"
        />
        <UiTableInput
            :label="$t('Settings.PayType')"
            type="select"
            name="settings.payType"
            :options="payTypes"
        />
    </div>
</template>
