<template>
    <div class="admin-customer-contracts-list">
        <b-list-group v-if="list && list.length">
            <b-list-group-item
                v-for="(item, index) in sortedList"
                :key="`${documentType}-${index}`"
                class="d-flex justify-content-between align-items-center"
            >
                <AdminCustomersModalDocumentsListItem
                    :document-type="documentType"
                    :document="item"
                />
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import AdminCustomersModalDocumentsListItem from "./ListItem";

export default {
    name: "AdminCustomersModalDocumentsList",
    components: { AdminCustomersModalDocumentsListItem },
    computed: {
        sortedList() {
            if (this.list && this.list.length) {
                return this.list.sort((a, b) =>
                    new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
                );
            }
            return [];
        },
    },
    props: {
        list: {
            required: true,
            type: Array,
        },
        documentType: String,
    },
};
</script>

<style scoped></style>
