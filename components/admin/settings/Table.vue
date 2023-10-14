<script setup lang="ts">
import { IRegion } from "~/types/region.interface";
import { useRegionStore } from "~/store/regions";

defineProps<{
    isLoading: boolean;
    items: IRegion[];
}>();

const { t } = useI18n();
const regionStore = useRegionStore();

const fields = markRaw([
    {
        key: "id",
        label: t("Settings.id"),
    },
    {
        key: "name",
        label: t("Settings.name"),
    },
    {
        key: "isActive",
        label: t("Settings.IsActive"),
    },
    {
        key: "contacts.contactName",
        label: t("registration.ContactName"),
    },
    {
        key: "sign",
        label: t("Settings.SignTab"),
    },
    {
        key: "actions",
        label: t("AccountManagement.AdminActions"),
        sortable: false,
        tdClass: "actions-column",
    },
]);

const removeRegion = (id: number) => {
    //@ts-ignore
    if (window.confirm("Вы уверены что хотите удалить регион?")) {
        regionStore.deleteRegion(id);
    }
};
</script>

<template>
    <div>
        <b-table
            id="settings-table"
            :busy="isLoading"
            :items="items"
            :fields="fields"
        >
            <template #cell(sign)="data">
                <span v-if="data.value">{{ $t("Settings.Uploaded") }}</span>
                <span v-else>{{ $t("Settings.NotUploaded") }}</span>
            </template>
            <template #cell(actions)="data">
                <div
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                    "
                >
                    <div class="action-icon">
                        <b-button
                            type="button"
                            size="sm"
                            variant="outline-primary"
                            @click="useEvent('modal:edit-region', data.item.id)"
                        >
                            <IBiPencil variant="primary" />
                        </b-button>
                    </div>
                    <div class="action-icon">
                        <b-button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            @click="removeRegion(data.item.id)"
                        >
                            <IBiTrash variant="danger" />
                        </b-button>
                    </div>
                </div>
            </template>
            <template #cell(isActive)="data">
                <template v-if="data.value">
                    <IBiCheckCircle variant="success" />
                </template>
                <template v-else>
                    <IBiXCircle class="danger" />
                </template>
            </template>
        </b-table>
    </div>
</template>

<style lang="css">
.action-icon button {
    width: 2rem;
    height: 2rem;
    min-height: unset;
}
</style>
