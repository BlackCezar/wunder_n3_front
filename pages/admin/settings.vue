<script setup lang="ts">
import { useRegionStore } from "~/store/regions";
import { storeToRefs } from "pinia";
import { IRegion } from "~/types/region.interface";
import { useLogger } from "vue-logger-plugin";

const regionStore = useRegionStore();
const { regions } = storeToRefs(regionStore);
const pfToken = ref<string>("");
const isLoading = ref<boolean>(false);
const editRegionModal = ref<boolean>(false);
const createRegionModal = ref<boolean>(false);
const selectedRegion = ref<IRegion | null>(null);
const logger = useLogger();

const generatePFToken = async () => {
    pfToken.value = await regionStore.generatePFToken();
};
const openRegionCreateModal = () => {
    createRegionModal.value = true;
};

onMounted(async () => {
    isLoading.value = true;
    await regionStore.loadRegions();
    isLoading.value = false;
});

useListen("modal-close:create-region", () => {
    createRegionModal.value = false;
});

useListen("modal-close:edit-region", () => {
    editRegionModal.value = false;
});

useListen("modal:edit-region", (id: number) => {
    const region = regions.value.find((r) => r.id === id);
    if (region) {
        logger.info("start edit region", region);
        selectedRegion.value = region;
        editRegionModal.value = true;
    }
});
</script>
<template>
    <div class="settings-page">
        <div class="page-header-3">
            {{ $t("Navigation.Settings").toUpperCase() }}
            <div class="settings-button-row">
                <b-button variant="primary" @click="openRegionCreateModal">
                    {{ $t("Navigation.createRegion") }}
                </b-button>
                <b-button @click="generatePFToken" variant="primary">
                    {{ $t("Navigation.generatePFToken") }}
                </b-button>
            </div>
        </div>
        <div class="mt-4 mb-2" v-if="pfToken">
            <div class="w-100" style="word-break: break-all">{{ pfToken }}</div>
        </div>
        <div class="table-container">
            <AdminSettingsTable :is-loading="isLoading" :items="regions" />
        </div>
        <b-modal
            hide-footer
            hide-header
            size="xl"
            v-model="editRegionModal"
            id="edit-region-modal"
        >
            <AdminSettingsRegionEditModal
                v-if="selectedRegion"
                :region="selectedRegion"
            />
        </b-modal>
        <b-modal
            hide-footer
            hide-header
            id="create-region-modal"
            v-model="createRegionModal"
        >
            <AdminSettingsRegionCreateModal />
        </b-modal>
    </div>
</template>

<style lang="css">
@import "assets/css/settingsForm.css";
@import "assets/css/settings.css";
.settings-page .page-header-3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
@media screen and (max-width: 768px) {
    .settings-page .page-header-3 {
        flex-direction: column;
        align-items: flex-start;
    }
}

.settings-page .settings-button-row {
    display: flex;
    align-items: center;
}
@media screen and (max-width: 768px) {
    .settings-page .settings-button-row {
        margin-top: var(--elementMargin);
    }
}
.settings-page .settings-button-row .btn {
    margin-left: var(--elementMargin);
}

.settings-group {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 1rem;
}

.modal-body {
    padding: 0;
}
</style>
