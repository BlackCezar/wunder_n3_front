<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '~/store/accounts';
import TopUpFormItemAccountResults from './TopUpFormItemAccountResults.vue'

const props = defineProps<{
    systemIndex: number;
    systemId: number
}>()

// const { fields, push, remove } = useFieldArray(`topUpAccounts[${props.systemIndex}].accounts`)
const { t } = useI18n();
const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const activeAccounts = computed(() =>
    accounts.value
        .filter(account => account.systemId === props.systemId))


</script>
<template>
    <div class="top-up-accounts">
        <FieldArray :name="`topUpAccounts[${props.systemIndex}].accounts`" v-slot="{ push, remove, fields }">
            <div v-for="(field, index) in fields" :key="field.key" class="top-up-account-line">
                <Field :name="`topUpAccounts[${systemIndex}].accounts[${index}].id`" type="select" v-slot="{ field, meta }">
                    <select class="form-control" :class="{
                        'is-invalid': !meta.valid && meta.touched,
                        'is-valid': meta.valid && meta.touched,
                    }" v-bind="field">
                        <option selected disabled value="0">{{ t("AccountManagement.SelectAccount") }}</option>
                        <template v-for="account of activeAccounts">
                            <option :value="account.id">{{ account.accountName }}</option>
                        </template>
                    </select>
                </Field>
                <Field :name="`topUpAccounts[${systemIndex}].accounts[${index}].sum`" step="0.01" min="0"
                    v-slot="{ meta, field }" :placeholder="$t('AccountManagement.Sum')" type="number">
                    <input type="number" step="0.01" v-bind="field" class="form-control" :class="{
                        'is-invalid': !meta.valid && meta.touched,
                        'is-valid': meta.valid && meta.touched,
                    }" />
                </Field>
                <b-button :disabled="field.isFirst" variant="outline-danger" @click="remove(index)">
                    <IBiTrash />
                </b-button>
            </div>
            <b-button v-if="activeAccounts?.length > fields.length" variant="outline-info" type="button"
                @click="push({ id: 0, sum: 0 })">
                <span>
                    {{ $t("AccountManagement.AddAccount") }}
                </span>
            </b-button>
        </FieldArray>
        <TopUpFormItemAccountResults :system-index="systemIndex" :system-id="systemId" />
    </div>
</template>
<style scoped>
.top-up-accounts {
    display: flex;
    flex-direction: column;
    gap: var(--minimalPadding);
}

.top-up-account-line {
    display: grid;
    grid-template-columns: 1fr 1fr 47px;
    grid-gap: var(--minimalPadding);
}
</style>