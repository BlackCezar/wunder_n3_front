<script lang="ts" setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "~/store/auth";
import { computed, useRouter } from "#imports";
import { useRegionStore } from "~/store/regions";
import { storeToRefs } from "pinia";
import { useGtm } from "@gtm-support/vue-gtm";

definePageMeta({
    layout: "signup",
});

const authStore = useAuthStore();
const { t } = useI18n();
const regionStore = useRegionStore();
const { regionName, globalSettings } = storeToRefs(regionStore);
const gtm = useGtm();
const router = useRouter();

const companyTaxNumberLength = computed<number>(() => {
    switch (regionName.value) {
        case "BY":
            return 9;
        case "KZ":
            return 12;
    }
    return 12;
});

const formSchema = computed(() =>
    yup.object().shape({
        companyTaxNumber: yup
            .string()
            .required()
            .length(companyTaxNumberLength.value),
        companyName: yup.string().required(),
        contactName: yup.string().required(),
        contactEmail: yup.string().required().email(),
        contactPhoneNumber: yup.string().required(),
        publicAgree: yup.bool().optional().default(false),
        personalAgree: yup.bool().isTrue().required(),
    }),
);

const links = computed(() => {
    return {
        publicContract: globalSettings.value?.publicContract || "",
        personalAgree: globalSettings.value?.personalAgree || "",
    };
});

const { handleSubmit, isSubmitting } = useForm({
    validationSchema: formSchema,
});

const processForm = handleSubmit(async (values: any) => {
    console.log("values", values);
    const customer = await authStore.signUp({
        ...values,
        publicAgree: !!values.publicAgree,
        region: regionName.value ?? "BY",
    });
    if (customer) {
        if (gtm?.enabled())
            gtm?.trackEvent({
                event: "auth-step-1",
            });
        useNuxtApp().$toast.success(t("registration.Success"));
        await router.push("/auth/thanks?id=" + customer.id);
    }
});
</script>
<template>
    <div>
        <form form-class="sign-in-form-card" @submit="processForm">
            <div class="sign-in-form-card">
                <div class="form-card-body">
                    <UiFormInput
                        :helper-text="$t('registration.helperCompanyTaxNumber')"
                        :max-length="companyTaxNumberLength"
                        :placeholder="$t('registration.CompanyTaxNumber')"
                        name="companyTaxNumber"
                        type="number"
                    />
                    <UiFormInput
                        :helper-text="$t('registration.helperCompanyName')"
                        :placeholder="$t('registration.CompanyName')"
                        name="companyName"
                    />
                    <UiFormInput
                        :helper-text="$t('registration.helperFullName')"
                        :placeholder="$t('registration.FullName')"
                        name="contactName"
                    />
                    <UiFormInput
                        :helper-text="$t('registration.helperContactEmail')"
                        :placeholder="$t('registration.ContactMail')"
                        name="contactEmail"
                    />
                    <UiFormInput
                        :helper-text="$t('registration.helperPhone')"
                        :placeholder="$t('registration.MobilePhone')"
                        name="contactPhoneNumber"
                        type="tel"
                    />
                    <UiFormCheckbox name="publicAgree">
                        {{ $t(`registration.agreeWith`) }}
                        <a :href="links.publicContract" class="a-link">
                            {{ $t(`registration.publicContract`) }}
                        </a>
                    </UiFormCheckbox>
                    <UiFormCheckbox name="personalAgree">
                        {{ $t(`registration.agreeWith`) }}
                        <a :href="links.personalAgree" class="a-link">
                            {{ $t(`registration.personalAgree`) }}
                        </a>
                    </UiFormCheckbox>
                </div>
            </div>
            <b-button
                :disabled="isSubmitting"
                class="button-submit"
                squared
                type="submit"
                variant="info"
            >
                <template v-if="isSubmitting">
                    <span>{{ $t("registration.Register") }}</span>
                    <b-spinner class="ml-3" variant="white" />
                </template>
                <template v-else>
                    {{ $t("registration.Register") }}
                </template>
            </b-button>
        </form>
    </div>
</template>
<style>
.btn-info {
    color: white;
}
.btn .btn-content {
    display: flex;
    align-items: center;
    gap: 12px;
}
</style>
