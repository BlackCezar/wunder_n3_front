<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
import type { IUser } from "~/types/user.interface";

const props = defineProps<{
    departments: {
        user: IUser;
    };
}>();

const authStore = useAuthStore();
const { t } = useI18n();

const fields = markRaw([
    {
        key: "user.email",
        label: t("login.Email"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("AccountManagement.AdminActions"),
        sortable: false,
        tdClass: "actions-column",
    },
]);
</script>
<template>
    <div class="accounts-tables-container">
        <b-table :fields="fields" :items="departments" class="sub-group-table">
            <template #cell(actions)="data">
                <b-button class="w-auto" variant="outline-danger">
                    <IBiTrash />
                </b-button> </template
        ></b-table>
    </div>
</template>
<style>
.sub-group-table thead {
    display: none;
}
.sub-group-table {
    padding-left: 1rem;
    padding-right: 1rem;
}
.sub-group-table td {
    vertical-align: middle;
}
</style>
