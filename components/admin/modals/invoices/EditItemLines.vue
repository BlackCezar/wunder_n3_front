<script setup lang="ts">
import { systemsToImg } from "~/composables/useSystems";
import TableInput from "~/components/ui/TableInput.vue";
</script>

<template>
    <div class="p-3">
        <FieldArray name="lines" v-slot="{ fields }">
            <BFormGroup v-for="(field, idx) of fields" :key="idx">
                <div class="p-3">
                    <img
                        :src="systemsToImg.get(field.value.systemName)"
                        :alt="field.value.systemName"
                        class="mx-auto d-block"
                    />
                    <TableInput
                        :name="`lines[${idx}].amount`"
                        readonly
                        :label="$t('Documents.LinesTableAmount')"
                        type="number"
                    />
                    <TableInput
                        :name="`lines[${idx}].expenseAmount`"
                        :label="$t('EditClient.ExpensesAmount')"
                        type="number"
                    />
                    <TableInput
                        :name="`lines[${idx}].transferAmount`"
                        :label="$t('EditClient.ClosedAmount')"
                        type="number"
                    />
                </div>
            </BFormGroup>
        </FieldArray>
    </div>
</template>

<style scoped lang="css"></style>
