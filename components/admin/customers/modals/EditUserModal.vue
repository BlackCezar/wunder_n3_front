<script setup lang="ts">
import { UiFormInput } from "#components";
import { IUserRole, type IUser } from "~/types/user.interface";
import FormCheckbox from "~/components/ui/FormCheckbox.vue";
import { useAuthStore } from "~/store/auth";

defineProps<{ role: IUserRole }>();

const authStore = useAuthStore();

const { data: listOfGroups } = useAsyncData("customer-groups", () =>
    authStore.getCustomerGroupsList(),
);
const selectGroupOptions = computed(
    () =>
        listOfGroups.value?.map((i) => ({
            value: i.id,
            text: i.companyName,
        })) ?? [],
);
</script>
<template>
    <div class="edit-user-modal">
        <UiFormInput label="Email (логин)" name="email" type="email" />
        <UiFormInput label="Пароль" name="secret" type="password" />
        <template v-if="role === IUserRole.GROUP">
            <FormCheckbox name="group.isActive"
                ><span>Активен</span></FormCheckbox
            >
            <UiFormInput label="Наименование группы" name="group.companyName" />
        </template>
        <template v-else-if="role === IUserRole.CUSTOMER">
            <UiFormInput
                label="Родительское отделение"
                type="select"
                name="customer.groupId"
                :options="selectGroupOptions"
            />
        </template>
    </div>
</template>
<style>
.edit-user-modal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: var(--bs-modal-padding);
}
</style>
