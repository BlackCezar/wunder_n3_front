<script setup lang="ts">
import { useRegionStore } from "@/store/regions";
import FloatBtns from "~/components/other/FloatBtns.vue";
import { setLocale } from "yup";

const regionStore = useRegionStore();

await useAsyncData('globalSettings', () => regionStore.loadGlobalSettings())

const { t } = useI18n();
setLocale({
    mixed: {
        required: t("Validation.required"),
        default: t("Validation.InvalidFormat"),
        notType: t("Validation.InvalidFormat"),
    },
    number: {
        integer: t("Validation.NaN"),
        lessThan: ({ less }) => t("Validation.maxLength", { max: less }),
        moreThan: ({ more }) => t("Validation.minLength", { min: more }),
        max: ({ max }) => t("Validation.Max", { max }),
        min: ({ min }) => t("Validation.Min", { min }),
    },
    string: {
        max: ({ max }) => t("Validation.maxLength", { max }),
        min: ({ min }) => t("Validation.minLength", { min }),
        email: t("Validation.InvalidEmail"),
        url: t("Validation.InvalidSite"),
        length: ({ length }) => t("Validation.Length", { length }),
    },
});
</script>

<template>
    <client-only>
        <div class="auth-page">
            <div class="main">
                <div class="sing-in-container">
                    <nuxt-link class="logo d-block auth-logo" to="/">
                        <img
                            src="/imgs/logo-auth.svg"
                            alt="Wunder Digital"
                            width="600"
                            height="200"
                        />
                    </nuxt-link>
                    <slot />
                    <FloatBtns />
                </div>
            </div>
        </div>
    </client-only>
</template>

<style lang="css">
.auth-page {
    background-image: url("/imgs/registration-backgraund.webp");
    background-size: cover;
    background-repeat: no-repeat;
    background-color: black;
}

.main {
    padding: 30px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
}

.sing-in-container {
    margin: auto;
    width: 100%;
    max-width: 608px;
}

.sign-in-form-card {
    width: 100%;
    background: rgba(0, 0, 0, 0)
        linear-gradient(-45deg, transparent 23px, #fff 0);
    margin-bottom: 30px;
    padding: 8px 55px 34px 55px;
}

.sign-in-form-card.last {
    padding-bottom: 16px;
    margin-bottom: 0;
    background: white;
}

.form-card-header {
    height: 100px;
    display: flex;
    flex-direction: row;
    margin-bottom: 29px;
}

.step {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    line-height: 1.2;
    font-weight: 400;
    color: var(--paragraphColor);
}

.step.not-active {
    background-color: var(--lightGray);
    box-shadow: inset -1px -1px 13px 0px rgba(23, 23, 23, 0.14);
    color: var(--borderGray);
    cursor: pointer;
}

.step.not-active:hover {
    box-shadow: 0 0 0 0.2rem rgba(205, 205, 205, 0.25);
}

.button-submit,
.button-next {
    width: 100%;
    height: 70px;
    border: none;
    line-height: 1.2;
    font-weight: 700;
}

.button-next {
    background-color: #ffffff;
}

.auth-logo {
    margin-bottom: 50px;

    img {
        width: 600px;
        display: block;
        margin: 0 auto;
    }
}
</style>
