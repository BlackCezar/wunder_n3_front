<template>
    <div>
        <div class=" align-items-center d-flex justify-content-between">
            <h3 class="page-header-3">
                {{ $t("Navigation.Users").toUpperCase() }}
            </h3>
            <b-button @click="openCreateUserModal" class="w-auto" variant="dark">
                <IBiPlus /> <span>Добавить пользователя</span>
            </b-button>
        </div>

        <div>
            <UsersTable :is-loading="busy" :list="usersList" />
            <b-pagination v-if="users" class="mt-3" :align="'center' as AlignmentJustifyContent" :total-rows="usersTotal"
                :model-value="Number(params.page)" @update:model-value="params.page = $event" :per-page="10"
                aria-controls="users-table" />
        </div>
        <b-modal hide-footer hide-header id="create-user" v-model="isShowCreateUser">
            <CreateUserModal />
        </b-modal>
    </div>
</template>
<script setup lang="ts">
import { useUrlSearchParams } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import UsersTable from "~/components/admin/customers/tables/UsersTable.vue";
import CreateUserModal from "~/components/admin/customers/modals/CreateUserModal.vue";
import type { AlignmentJustifyContent } from "bootstrap-vue-next";

const authStore = useAuthStore();
const { users, usersTotal, busy } = storeToRefs(authStore);
const params = useUrlSearchParams("history", {
    initialValue: {
        page: 1,
    },
});

const isShowCreateUser = ref<boolean>(false);
onMounted(() => {
    authStore.loadUsers(params.page);
});

watch(
    () => params.page,
    () => {
        authStore.loadUsers(params.page);
    },
);

const openCreateUserModal = () => {
    isShowCreateUser.value = true;
};

useListen("delete:user", async (id) => {
    await authStore.deleteUser(id);
});

const usersList = computed(() =>
    users.value.map((item) => ({
        ...item,
        hasDepartments: !!item?.group?.departments?.length,
    })),
);
</script>
