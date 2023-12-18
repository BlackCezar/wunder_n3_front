<template>
    <div class="float-btns">
        <KnowledgePseudoChat />
        <div class="float-btns-wrapper" v-if="globalSettings">
            <div class="float-btns-btn" v-if="globalSettings?.telegramLink">
                <a :href="globalSettings.telegramLink" class="float-btns-tl" rel="nofollow" target="_blank">
                    <iconTelegram />
                </a>
            </div>
            <div class="float-btns-btn" v-if="globalSettings?.telPhone">
                <a :href="`tel:${globalSettings.telPhone}`" target="_blank">
                    <PhoneIcon />
                </a>
            </div>
            <div class="float-btns-btn" v-if="globalSettings?.whatappPhone">
                <a :href="`https://api.whatsapp.com/send?phone=${globalSettings.whatappPhone
                    }&text=${globalSettings.whatappPhone
                        ? encodeURIComponent(globalSettings.whatappPhone)
                        : ''
                    }`" target="_blank">
                    <iconWhatsapp />
                </a>
            </div>
            <OtherComplaintForm v-if=globalSettings?.complaintForm />
        </div>
    </div>
</template>

<script setup lang="ts">
import iconTelegram from "assets/img/telegram.svg?component";
import iconWhatsapp from "assets/img/whatsapp.svg?component";
import PhoneIcon from "assets/img/phone.svg?component";
import { useRegionStore } from "~/store/regions";
import { storeToRefs } from "pinia";

const regionStore = useRegionStore();
const { globalSettings } = storeToRefs(regionStore);
</script>

<style lang="css">
.float-btns {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 99;
    pointer-events: none;
    font-size: 0;
}

.float-btns-wrapper {
    width: fit-content;
    display: grid;
    gap: 20px;
    grid-template-columns: 50px;
    margin-left: auto;
    grid-template-rows: 50px;
}

.float-btns>* {
    text-align: left;
}

.float-btns-btn {
    display: block;
    width: 100%;
    max-width: 50px;
    pointer-events: initial;
}

.float-btns-btn a {
    display: block;
    width: 100%;
    height: 100%;
}

.float-btns-btn svg image {
    width: 100%;
    height: 100%;
}

.float-btns-tl {
    transition: opacity 0.1s;
}

.float-btns-tl:hover {
    opacity: 0.9;
}

@media (max-width: 599px) {
    .float-btns {
        right: 15px;
        bottom: 15px;
    }
}
</style>
