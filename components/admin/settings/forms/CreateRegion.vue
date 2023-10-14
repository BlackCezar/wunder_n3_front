<script setup lang="ts">
import { useI18n } from "#imports";

const { t } = useI18n();
</script>

<template>
    <div class="d-flex flex-column gap-3">
        <UiFormInput
            name="name"
            :label="t('Settings.RegionName')"
            :placeholder="t('Settings.RegionName')"
        />
        <UiFormInput
            name="defaultCurrency"
            :label="t('Settings.DefaultCurrency')"
            placeholder="BYN"
        />
        <UiFormCheckbox name="isActive">{{
            t("Settings.IsActive")
        }}</UiFormCheckbox>
    </div>
</template>
