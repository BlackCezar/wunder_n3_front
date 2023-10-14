<template>
    <div>
        <UiTableInput
            :label="$t('AccountManagement.Conditions')"
            type="select"
            name="contractType"
            :options="contractTypeOptions"
        />
        <UiTableInput
            v-if="contractType === ContractType.CUSTOM"
            :label="$t('Documents.ContractNumber')"
            placeholder=""
            name="contractNumber"
            type="text"
        />
        <UiTableInput
            :label="$t('AccountManagement.AccountStatus')"
            type="select"
            name="isActive"
            :options="accountTypeOptions"
        />
        <UiTableInput
            :label="$t('Documents.ContractService')"
            name="contractService"
            type="text"
        />
        <UiTablePeriod
            :label="$t('Documents.PeriodDate')"
            type="period"
            name="startDate"
            to-name="expireDate"
            :placeholder="$t('Documents.FromDate')"
            :to-placeholder="$t('Documents.EndDate')"
        />
    </div>
</template>
<script setup lang="ts">
import { ContractType } from "@/types/contract.interface";

const { t } = useI18n();

defineProps<{
    contractType: ContractType;
}>();

const contractTypeOptions = markRaw([
    {
        value: "STANDARD",
        text: t("AccountManagement.PublicContract"),
    },
    {
        value: "CUSTOM",
        text: t("AccountManagement.UniqueContract"),
    },
]);

const accountTypeOptions = markRaw([
    {
        value: true,
        text: t("AccountManagement.Active"),
    },
    {
        value: false,
        text: t("AccountManagement.NotActive"),
    },
]);
</script>
