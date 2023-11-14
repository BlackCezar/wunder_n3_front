<script setup lang="ts">
import * as yup from "yup";
import { IUserRole } from "~/types/user.interface";
import { useForm } from "#imports";
import { UiFormInput } from "#components";
import { useAuthStore } from "~/store/auth";
import { useRegionStore } from "~/store/regions";
import { storeToRefs } from "pinia";

const regionStore = useRegionStore();
const { regionName, globalSettings } = storeToRefs(regionStore);

const { handleSubmit, values, resetForm } = useForm({
    validationSchema: yup.object().shape({
        email: yup.string().email().required(),
        secret: yup.string().required(),
        role: yup
            .string()
            .oneOf(Object.values(IUserRole))
            .default(IUserRole.CUSTOMER),
        payload: yup.lazy((_val, options) => {
            if (options.parent?.role) {
                if (options.parent.role === IUserRole.ADMIN) {
                    return yup
                        .object()
                        .shape({
                            name: yup.string().required(),
                        })
                        .required();
                } else if (options.parent.role === IUserRole.GROUP) {
                    return yup
                        .object()
                        .shape({
                            companyName: yup.string().required(),
                            isActive: yup.boolean().default(false).nullable(),
                        })
                        .required();
                }
                return yup
                    .object()
                    .shape({
                        companyName: yup.string().required(),
                        companyTaxNumber: yup.string().required(),
                        contactEmail: yup.string().email().required(),
                        contactName: yup.string().required(),
                        contactPhoneNumber: yup.string().required(),
                    })
                    .required();
            }
            return yup.object();
        }),
    }),
    initialValues: {
        email: "",
        secret: "",
        role: IUserRole.GROUP,
        payload: {
            isActive: false,
            companyName: "",
        },
    },
});
const authStore = useAuthStore();
const { hide } = useModal();

const onSave = handleSubmit(async (values) => {
    await authStore.createUser(values);
    resetForm();
    hide();
});

const roles = markRaw(
    Object.values(IUserRole).map((item) => ({
        value: item,
        text: item,
    })),
);

const companyTaxNumberLength = computed<number>(() => {
    switch (regionName.value) {
        case "BY":
            return 9;
        case "KZ":
            return 12;
    }
    return 12;
});
</script>
<template>
    <div class="p-3">
        <form @submit.prevent="onSave" class="create-user-form">
            <UiFormInput
                name="email"
                type="email"
                placeholder="e-mail"
                label="Email (логин)"
                autocomplete="off"
            />
            <UiFormInput
                name="secret"
                type="password"
                label="Пароль"
                autocomplete="off"
            />
            <UiFormInput
                name="role"
                type="select"
                label="Роль"
                :options="roles"
            />
            <template v-if="values.role === IUserRole.ADMIN">
                <UiFormInput
                    name="payload.name"
                    placeholder="Имя"
                    label="Имя"
                    autocomplete="off"
                />
            </template>
            <template v-else-if="values.role === IUserRole.GROUP">
                <UiFormInput
                    :helper-text="$t('registration.helperCompanyName')"
                    :placeholder="$t('registration.CompanyName')"
                    name="payload.companyName"
                />
            </template>
            <template v-else-if="values.role === IUserRole.CUSTOMER">
                <UiFormInput
                    :helper-text="$t('registration.helperCompanyName')"
                    :placeholder="$t('registration.CompanyName')"
                    name="payload.companyName"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperCompanyTaxNumber')"
                    :max-length="companyTaxNumberLength"
                    :placeholder="$t('registration.CompanyTaxNumber')"
                    name="payload.companyTaxNumber"
                    type="number"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperFullName')"
                    :placeholder="$t('registration.FullName')"
                    name="payload.contactName"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperContactEmail')"
                    :placeholder="$t('registration.ContactMail')"
                    name="payload.contactEmail"
                />
                <UiFormInput
                    :helper-text="$t('registration.helperPhone')"
                    :placeholder="$t('registration.MobilePhone')"
                    name="payload.contactPhoneNumber"
                    type="tel"
                />
            </template>
            <b-button type="submit" @click="onSave" variant="danger"
                >Создать</b-button
            >
        </form>
    </div>
</template>
<style>
.create-user-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}
</style>
