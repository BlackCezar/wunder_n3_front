<script setup lang="ts">
import { systemsToImg } from "~/composables/useSystems";
import { SystemName } from "~/types/region.interface";
import { useAccountStore } from "~/store/accounts";
import { storeToRefs } from "pinia";
import { FieldEntry } from "vee-validate";
import { ITopUpAccount } from "~/types/account.interface";
import FormInput from "~/components/ui/FormInput.vue";

const props = defineProps<{ systemName: SystemName }>();
const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);
const { t } = useI18n();

const defaultItem = shallowRef({
    isActive: true,
    systemName: props.systemName,
    accountId: 0,
    sum: 0,
});

const accountOptions = computed(() => {
    const list: { value: number | null; text: string; disabled?: boolean }[] = [
        {
            value: 0,
            disabled: true,
            text: t("AccountManagement.SelectAccount"),
        },
    ];
    list.push(
        ...accounts.value
            .filter((account) => account.system?.name === props.systemName)
            .map((account) => ({
                value: account.id,
                text: account.accountName,
            })),
    );
    return list;
});
</script>

<template>
    <FieldArray name="topUpAccounts" v-slot="{ fields, remove, push }">
        <template v-for="(field, index) of fields" :key="field.key">
            <template v-if="field.value?.systemName === systemName">
                <label class="selected-system" v-if="field.isFirst">
                    <span class="selected-systems-icon">
                        <img
                            :src="systemsToImg.get(systemName)"
                            :alt="systemName"
                        />
                    </span>
                    <Field
                        :name="`topUpAccounts[${index}].isActive`"
                        type="checkbox"
                        class="form-check-input"
                        :value="true"
                    />
                </label>
                <div class="d-flex">
                    <Field
                        :name="`topUpAccounts[${index}].accountId`"
                        type="select"
                        v-slot="{ field }"
                    >
                        <BFormSelect v-bind="field" :options="accountOptions" />
                    </Field>
                    <FormInput
                        :placeholder="$t('AccountManagement.Sum')"
                        :name="`topUpAccounts[${index}].sum`"
                        step="0.01"
                        type="number"
                    />
                    <b-button variant="outline-danger" @click="remove(index)"
                        ><IBiTrash
                    /></b-button>
                </div>
                <b-button
                    variant="outline-info"
                    @click="push(defaultItem)"
                    v-if="field.isLast"
                >
                    <IBiPlus />
                    <span>
                        {{ $t("AccountManagement.AddAccount") }}
                    </span>
                </b-button>
            </template>
        </template>
    </FieldArray>
</template>

<style scoped lang="css">
.selected-system {
    cursor: pointer;
}
</style>
