<script setup lang="ts">
import TopUpForm from "../forms/TopUpForm.vue";
import { SystemName } from "~/types/region.interface";

const isOpen = ref(false);
const accountId = ref<number>(0);
const selectedSystemName = ref<SystemName>(SystemName.GoogleAds);

useListen("modal:popup-account", (ev) => {
    selectedSystemName.value = ev.system;
    accountId.value = ev.accountId;
    isOpen.value = true;
});

const resetData = () => {
    accountId.value = 0;
    selectedSystemName.value = SystemName.GoogleAds;
};
</script>
<template>
    <div>
        <b-modal
            hide-header
            v-model="isOpen"
            hide-footer
            id="top-up-modal"
            @close="resetData"
        >
            <TopUpForm
                :account-id="accountId"
                :system-name="selectedSystemName"
            />
        </b-modal>
    </div>
</template>
