<script setup lang="ts">
import DynamicForm from "@/components/forms/DynamicForm.vue";
import * as Yup from "yup";
import { useRegionStore } from "~/store/regions";
import { ICustomerRole } from "~/types/user.interface";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";

definePageMeta({
    layout: "signup",
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const { t } = useI18n();
const router = useRouter();
const regionStore = useRegionStore();
const { globalSettings } = storeToRefs(regionStore);
const processForm = async (event: any) => {
    try {
        await authStore.login({
            username: event.login,
            password: event.password,
        });
        if (user.value) {
            if (user.value.role === ICustomerRole.ADMIN) {
                await router.push("/admin");
            } else await router.push("/accounts");
            useNuxtApp().$toast.success(t("Validation.Success"));
        }
    } catch (err) {
        console.error(err);
        useNuxtApp().$toast.error(t("login.NoSuccess"));
    }
};

const formSchema = ref({
    fields: [
        {
            placeholder: t("login.Email"),
            name: "login",
            as: "BFormInput",
            rules: Yup.string()
                .required(t("Validation.required"))
                .email(t("Validation.InvalidEmail")),
        },
        {
            placeholder: t("login.Password"),
            name: "password",
            autocomplete: "current-password",
            as: "b-form-input",
            type: "password",
            rules: Yup.string()
                .required(t("Validation.required"))
                .min(6, t("Validation.minLength", { min: 6 })),
        },
    ],
});

const toSignUp = () => {
    router.push("/auth/signup");
};
</script>
<template>
    <div>
        <IBiQuestionCircle />
        <DynamicForm
            :schema="formSchema"
            form-class="sign-in-form-card"
            @submit="processForm"
        >
            <template #pre-button>
                <a
                    class="forgot-password"
                    target="_blank"
                    v-if="globalSettings"
                    :href="globalSettings.telegramLink"
                >
                    {{ $t("login.ForgotPassword") }}
                </a>
            </template>
            <template #button>
                <b-button
                    squared
                    variant="info"
                    class="button-submit"
                    style="margin-bottom: 30px"
                    :disabled="authStore.busy"
                    type="submit"
                >
                    {{ $t("login.Login") }}
                </b-button>
                <b-button
                    squared
                    variant="outline-info"
                    class="button-next"
                    @click="toSignUp"
                >
                    {{ $t("login.Registration") }}
                </b-button>
            </template>
        </DynamicForm>
    </div>
</template>

<style lang="css">
a.forgot-password {
    display: flex;
    margin-top: 22px;
    width: fit-content;
}
.btn-info {
    color: white;
}
</style>
