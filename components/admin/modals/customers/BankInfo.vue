<template>
    <div>
        <client-only>
            <div>
                <UiTableInput
                    :label="$t('registration.BankName')"
                    :placeholder="$t('registration.BankName')"
                    name="bankName"
                    type="text"
                />
                <UiTableInput
                    :label="$t('registration.AccountNumber')"
                    :placeholder="$t('registration.AccountNumber')"
                    name="accountNumber"
                    type="text"
                />
                <UiTableInput
                    :label="$t('registration.BankAddress')"
                    :placeholder="$t('registration.BankAddress')"
                    name="bankAddress"
                    type="text"
                />
                <UiTableInput
                    :placeholder="$t('registration.BIC')"
                    :label="$t('registration.BIC')"
                    name="BIC"
                    type="text"
                />
            </div>
        </client-only>
    </div>
</template>
<script setup lang="ts"></script>
