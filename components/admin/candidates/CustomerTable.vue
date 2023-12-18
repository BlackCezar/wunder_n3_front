<template>
    <div>
        <div class="table-container">
            <b-table class="my-table" :items="clients" :fields="fields" :busy="isLoading">
                <template #cell(publicAgree)="data">
                    <span>{{ data.value ? "Да" : "Нет" }}</span>
                </template>
                <template #cell(actions)="data">
                    <div class="d-flex gap-1">
                        <b-button variant="secondary" @click.prevent="
                            useEvent('modal:show-customer-candidate', data.item)
                            " size="sm">{{ $t("CustomerCandidates.Open") }}</b-button>
                        <b-button @click="useEvent('delete:customer-candidate', data.item.id)" variant="outline-danger">
                            <i-bi-trash />
                        </b-button>
                    </div>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script setup lang=ts>
import { type ICustomerCandidate } from '../../../types/user.interface';


defineProps<{
    isLoading: boolean;
    clients: ICustomerCandidate[];
}>()

var { t } = useI18n()

var fields = markRaw([
    { key: "id", label: t("CustomerCandidates.Id") },
    {
        key: "companyName",
        label: t("CustomerCandidates.companyName"),
    },
    {
        key: "companyTaxNumber",
        label: t("CustomerCandidates.companyTaxNumber"),
    },
    {
        key: "publicAgree",
        label: t("CustomerCandidates.publicAgree"),
    },
    {
        key: "contactName",
        label: t("CustomerCandidates.contactName"),
    },
    {
        key: "contactPhoneNumber",
        label: t("CustomerCandidates.contactPhoneNumber"),
    },
    { key: "actions", label: "..." },
])
</script>

<style scoped></style>
