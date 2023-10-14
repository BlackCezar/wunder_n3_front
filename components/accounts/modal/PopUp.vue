<script setup lang="ts">
import TopUpForm from "../forms/TopUpForm.vue";
const isOpen = ref(false);

useListen("modal:popup-account", () => {
    isOpen.value = true;
});
</script>
<template>
    <div>
        <b-modal hide-header v-model="isOpen" hide-footer id="top-up-modal">
            <TopUpForm />
        </b-modal>
    </div>
</template>
