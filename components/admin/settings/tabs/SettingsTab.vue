<script lang="ts" setup>
import { PayType } from "~/types/region.interface";
import { useI18n, markRaw } from "#imports";

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
        <UiTableInput :label="$t('Settings.IsActive')" name="isActive" type="checkbox" />
        <UiTableInput :label="$t('Settings.DefaultCurrency')" :placeholder="$t('Settings.DefaultCurrency')" name="currency"
            type="text" />
        <UiTableInput :label="$t('Settings.RegionName')" :placeholder="$t('Settings.RegionName')" type="text" name="name" />
        <UiTableInput :label="$t('Settings.emailFrom')" :placeholder="$t('Settings.emailFrom')" type="text"
            name="settings[0].emailFrom" />
        <UiTableInput :label="$t('Settings.PlanFixManagerId')" :placeholder="$t('Settings.PlanFixManagerId')" type="text"
            name="settings[0].planFixManagerId" />
        <UiTableInput :label="$t('Settings.financialManagerId')" :placeholder="$t('Settings.financialManagerId')"
            type="text" name="settings[0].financialManagerId" />
        <UiTableInput :label="$t('Settings.projectId')" :placeholder="$t('Settings.projectId')" name="settings[0].projectId"
            type="number" />
        <UiTableInput :label="$t('Settings.paymentWaitingHours')" :placeholder="$t('Settings.paymentWaitingHours')"
            name="settings[0].paymentWaitingHours" type="number" />
        <UiTableInput :label="$t('Settings.TelegramLink')" :placeholder="$t('Settings.TelegramLink')"
            name="settings[0].telegramLink" type="url" />
        <UiTableInput :label="$t('Settings.WhatsAppPhone')" :placeholder="$t('Settings.WhatsAppPhonePlaceholder')"
            name="settings[0].whatappPhone" type="tel" />
        <UiTableInput :label="$t('Settings.WhatsAppText')" :placeholder="$t('Settings.WhatsAppTextPlaceholder')" type="text"
            name="settings[0].whatappText" />
        <UiTableInput :label="$t('Settings.TelPhone')" :placeholder="$t('Settings.TelPhonePlaceholder')"
            name="settings[0].telPhone" type="tel" />
        <UiTableInput :label="$t('Settings.ratesAdds')" :placeholder="$t('Settings.ratesAdds')" name="settings[0].ratesAdds"
            type="number" />
        <UiTableInput :label="$t('Settings.freeHours')" :placeholder="$t('Settings.freeHours')" name="settings[0].freeHours"
            type="number" />
        <UiTableInput :label="$t('Settings.freeTimes')" :placeholder="$t('Settings.freeTimes')" name="settings[0].freeTimes"
            type="number" />
        <UiTableInput :label="$t('Settings.hourCost')" :placeholder="$t('Settings.hourCost')" name="settings[0].hourCost"
            step="0.01" type="number" />
        <UiTableInput :label="$t('Settings.vat')" :placeholder="$t('Settings.vat')" name="settings[0].vat" type="number" />
        <UiTableInput :label="$t('Settings.personalAgree')" type="text" :placeholder="$t('Settings.personalAgree')"
            name="settings[0].personalAgree" />
        <UiTableInput :label="$t('Settings.publicContract')" type="text" :placeholder="$t('Settings.publicContract')"
            name="settings[0].publicContract" />
        <UiTableInput :label="$t('Settings.EnableEDN')" name="settings[0].isEDNActive" type="checkbox" />
        <UiTableInput :label="$t('Settings.PayType')" type="select" name="settings[0].payType" :options="payTypes" />
        <UiTableInput :label="$t('Settings.allowTransfer')" name="settings[0].allowTransfer" type="checkbox" />
        <UiTableInput label="Форма жалоб" name="settings[0].complaintForm" type="checkbox" />
        <UiTableInput name="settings[0].complaintEmail" label="Email для жалоб" type="email" />

    </div>
</template>
