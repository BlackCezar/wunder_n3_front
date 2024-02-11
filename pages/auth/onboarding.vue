<template>
    <b-form autocomplete="on" @submit.prevent="userRegister">
        <div class="sign-in-form-card">
            <div class="form-card-body">
                <UiFormInput
                    :helper-text="$t('registration.helperCompanyEmail')"
                    :placeholder="$t('registration.CompanyEmail')"
                    name="companyEmail"
                    type="email"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperCompanyAddress')"
                    :placeholder="$t('registration.CompanyAddress')"
                    name="companyAddress"
                />
                <UiFormCheckbox name="sameAddress">
                    {{ $t("registration.sameAddress") }}
                </UiFormCheckbox>
                <UiFormInput
                    v-if="!values.sameAddress"
                    :helper-text="$t('registration.helperPostalAddress')"
                    :placeholder="$t('registration.PostalAddress')"
                    name="postalAddress"
                />
            </div>
        </div>
        <div class="sign-in-form-card">
            <div class="form-card-body">
                <UiFormInput
                    :helper-text="
                        $t('registration.helperResponsiblePersonFullName')
                    "
                    :placeholder="$t('registration.ResponsiblePersonFullName')"
                    name="responsiblePersonFullName"
                />
                <UiFormInput
                    :helper-text="
                        $t('registration.helperResponsiblePersonPosition')
                    "
                    :placeholder="$t('registration.ResponsiblePersonPosition')"
                    name="responsiblePersonPosition"
                />
                <UiFormInput
                    :helper-text="
                        $t('registration.helperSignatureDocumentType')
                    "
                    :placeholder="$t('registration.SignatureDocumentType')"
                    name="signatureDocumentType"
                />
            </div>
        </div>
        <div class="sign-in-form-card">
            <div class="form-card-body">
                <UiFormInput
                    :helper-text="$t('registration.helperBankName')"
                    :placeholder="$t('registration.BankName')"
                    name="bankName"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperAccountNumber')"
                    :placeholder="$t('registration.AccountNumber')"
                    name="accountNumber"
                    :type="regionName === 'kz' ? 'number' : 'text'"
                    :max-length="accountNumberLength"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperBankAddress')"
                    :placeholder="$t('registration.BankAddress')"
                    name="bankAddress"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperBIC')"
                    :placeholder="$t('registration.BIC')"
                    name="BIC"
                    type="number"
                    :max-length="bicLength"
                />
                <UiFormCheckbox name="personalAgree">
                    {{ $t(`registration.agreeWith`) }}
                    <a :href="globalSettings?.personalAgree" class="a-link">
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
                {{ $t("registration.Register") }}
                <b-spinner class="ml-3" variant="white" />
            </template>
            <template v-else>
                {{ $t("registration.Register") }}
            </template>
        </b-button>
    </b-form>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "#imports";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { useRegionStore } from "~/store/regions";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { useGtm } from "@gtm-support/vue-gtm";
import auth from "~/middleware/auth";

const regionStore = useRegionStore();
const authStore = useAuthStore();
const { globalSettings, regionName } = storeToRefs(regionStore);
const gtm = useGtm();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const bicLength = computed(() => {
    if (regionName.value === "BY") return 12;
    if (regionName.value === "KZ") return 8;
    return 8;
})
const accountNumberLength = computed<number>(() => {
    if (regionName.value === "BY") return 28;
    if (regionName.value === "KZ") return 12;
    return 12;
});

const formSchema = computed(() =>
    yup.object().shape({
        companyEmail: yup.string().required().email(),
        companyAddress: yup.string().required(),
        sameAddress: yup.boolean().required().default(true),
        postalAddress: yup.string().when("sameAddress", (same, sch) => {
            if (!same) return sch.required();
            return sch.optional();
        }),
        responsiblePersonFullName: yup.string().required(),
        responsiblePersonPosition: yup.string().required(),
        signatureDocumentType: yup.string().required(),
        bankName: yup.string().required(),
        accountNumber: yup
            .string()
            .required()
            .length(accountNumberLength.value),
        bankAddress: yup.string().required(),
        BIC: yup.string().required().length(8),
        personalAgree: yup.bool().required().isTrue(),
    }),
);

const { handleSubmit, values, isSubmitting } = useForm<{
    companyEmail: string;
    companyAddress: string;
    sameAddress: boolean;
    personalAgree: boolean;
    postalAddress?: string;
    responsiblePersonFullName: string;
    responsiblePersonPosition: string;
    signatureDocumentType: string;
    bankName: string;
    accountNumber: string;
    BIC: string;
    bankAddress: string;
}>({
    validationSchema: formSchema,
});

const userRegister = handleSubmit(async (values) => {
    const payload = {
        ...values,
        customerCandidateId: Number(authStore.customerCandidate?.id),
        personalAgree: true,
    };
    if (payload.sameAddress) {
        payload.postalAddress = payload.companyAddress;
    }

    const result = await authStore.completeSignUp(payload);
    if (result) {
        if (gtm?.enabled())
            gtm?.trackEvent({
                event: "auth-step-1",
            });
        useNuxtApp().$toast.success(t("registration.Success"));
        await router.push("/auth/thanks");
    }
});

onMounted(() => {
    if (!authStore.customerCandidate && route.query.id) {
        authStore.setCustomerCandidate({
            id: route.query.id,
        });
    }
});

definePageMeta({
    layout: "signup",
});
</script>

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
