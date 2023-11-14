<template>
    <div>
        <div class="table-container">
            <b-table
                class="my-table"
                :items="clients"
                :fields="fields"
                :busy="isLoading"
            >
                <template #cell(publicAgree)="data">
                    <span>{{ data.value ? "Да" : "Нет" }}</span>
                </template>
                <template #cell(actions)="data">
                    <b-button
                        variant="secondary"
                        @click.prevent="
                        useEvent('modal:show-customer-candidate', data.item)
                        "
                        size="sm"
                        >{{ $t("CustomerCandidates.Open") }}</b-button
                    >
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminCandidatesCustomerTable",
    props: {
        clients: [Array, Object],
        isLoading: Boolean,
    },
    data() {
        return {
            fields: [
                { key: "id", label: this.$t("CustomerCandidates.Id") },
                {
                    key: "companyName",
                    label: this.$t("CustomerCandidates.companyName"),
                },
                {
                    key: "companyTaxNumber",
                    label: this.$t("CustomerCandidates.companyTaxNumber"),
                },
                {
                    key: "publicAgree",
                    label: this.$t("CustomerCandidates.publicAgree"),
                },
                {
                    key: "contactName",
                    label: this.$t("CustomerCandidates.contactName"),
                },
                {
                    key: "contactPhoneNumber",
                    label: this.$t("CustomerCandidates.contactPhoneNumber"),
                },
                { key: "actions", label: "..." },
            ],
        };
    },
};
</script>

<style scoped></style>
