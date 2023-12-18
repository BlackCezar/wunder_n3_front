<script setup lang="ts">
import { IUserRole, type IUser } from "~/types/user.interface";
import UsersSubTable from "./UsersSubTable.vue";
import EditUserModal from "../modals/EditUserModal.vue";
import * as yup from "yup";
import { useAuthStore } from "~/store/auth";

defineProps<{
    list: IUser[];
    isLoading: boolean;
}>();

const { t } = useI18n();
const showEditModal = ref(false);
const authStore = useAuthStore();

const fields = markRaw([
    {
        key: "email",
        label: t("login.Email"),
        sortable: false,
    },
    {
        key: "role",
        label: t("login.Role"),
    },
    {
        key: "createdAt",
        label: t("login.CreatedAt"),
    },
    {
        key: "hasDepartments",
        label: "Отделения",
        sortable: true,
    },
    {
        key: "customer.customerGroup.companyName",
        label: "Род. группа",
        sortable: true,
    },
    {
        key: "actions",
        label: t("AccountManagement.AdminActions"),
        sortable: false,
        tdClass: "actions-column",
    },
]);

const onDelete = (email: string, id: number) => {
    if (
        process.client &&
        window?.confirm("Вы точно хотите удалить пользователя " + email)
    ) {
        useEvent("delete:user", id);
    }
};

const { handleSubmit, values, setValues, handleReset } = useForm<IUser>({
    validationSchema: yup.object().shape({
        email: yup.string().email().required(),
        secret: yup.string().required(),
        role: yup.string().required(),
        group: yup.mixed().nullable(),
    }),
    initialValues: {
        role: IUserRole.CUSTOMER,
        email: "",
        secret: "",
    },
});

const onEdit = (user: IUser) => {
    console.log("on edit", user);
    showEditModal.value = true;
    setValues(user);

    nextTick(() => {
        setValues(user);
    });
};

const onSave = handleSubmit(async (values) => {
    await authStore.saveCustomer(values);
});
</script>
<template>
    <div class="table-container">
        <b-table
            :busy="isLoading"
            class="usera-table"
            :items="list"
            details-td-class="details-class"
            :fields="fields"
        >
            <template #cell(role)="data">
                <b-badge variant="info">{{
                    data.value === IUserRole.ADMIN
                        ? "Администратор"
                        : data.value === IUserRole.GROUP
                        ? "Группа"
                        : data.item.secret
                        ? "Пользователь"
                        : "Кандидат"
                }}</b-badge>
            </template>
            <template #cell(createdAt)="data">
                <span>{{
                    new Date(data.value as string).toLocaleDateString()
                }}</span>
            </template>
            <template #cell(actions)="data">
                <div class="d-flex align-items-center justify-content-end">
                    <b-button
                        @click="onEdit(data.item)"
                        class="w-auto"
                        variant="outline-primary"
                    >
                        <IBiPen />
                    </b-button>
                    <b-button
                        @click="
                            onDelete(
                                data.item.email as string,
                                data.item.id as number,
                            )
                        "
                        class="w-auto"
                        variant="outline-danger"
                    >
                        <IBiTrash />
                    </b-button>
                </div>
            </template>
            <template #cell(hasDepartments)="row">
                <b-button
                    v-if="row.value"
                    @click="row.toggleDetails"
                    class="w-auto mx-auto"
                    variant="outline-primary"
                >
                    <IBiChevronUp />
                </b-button>
            </template>
            <template #row-details="row">
                <div class="details-class">
                    <UsersSubTable :departments="row.item.group.departments" />
                </div>
            </template>
        </b-table>
    </div>
    <b-modal
        :title="`Изменить ${values?.email}`"
        v-model="showEditModal"
        cancel-variant="outline-primary"
        cancel-title="Отмена"
        ok-variant="danger"
        ok-title="Сохранить"
        @ok="onSave"
        @close="handleReset"
    >
        <EditUserModal :role="values.role" />
    </b-modal>
</template>
<style scoped>
.details-class {
    background-color: #f2f0f4;
    margin: -0.5rem;
    padding: 0.75rem;
}
</style>
