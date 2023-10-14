<template>
    <div>
        <client-only>
            <div>
                <UiTableInput
                    :label="$t('registration.CompanyName')"
                    name="companyName"
                    :placeholder="$t('registration.CompanyName')"
                    type="text"
                />
                <UiTableInput
                    :placeholder="$t('registration.FullName')"
                    :label="$t('registration.FullName')"
                    type="text"
                    name="contactName"
                />
                <UiTableInput
                    :label="$t('registration.ContactMailLabel')"
                    :placeholder="$t('registration.ContactMail')"
                    name="contactEmail"
                    type="email"
                />
                <UiTableInput
                    :label="$t('registration.MobilePhoneLabel')"
                    :placeholder="$t('registration.MobilePhone')"
                    name="contactPhoneNumber"
                    type="tel"
                />
                <UiTableInput
                    :label="$t('registration.DateOfBirth')"
                    :placeholder="$t('registration.DateOfBirth')"
                    type="date"
                    name="dateOfBirth"
                />
            </div>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { useRegionStore } from "~/store/regions";

const regionStore = useRegionStore();

const regexPhone = computed(() => {
    if (regionStore.regionName === "BY") {
        return "^\\+375\\(\\d{2}\\)-\\d{3}-\\d{2}-\\d{2}$";
    } else if (regionStore.regionName === "KZ") {
        ("^\\+7\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}$");
    }
    return "^\\+988\\(\\d{2}\\)-\\d{3}-\\d{2}-\\d{2}$";
});
</script>
