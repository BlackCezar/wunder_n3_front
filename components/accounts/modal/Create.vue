<script lang="ts" setup>
import type {
    ICustomerSystemSettings,
    IRegion,
    ISystem,
} from "~/types/region.interface";
import { SystemName } from "~/types/region.interface";
import {
    computed,
    ref,
    systemsToImg,
    useForm,
    useI18n,
    watch,
    useListen,
    useEvent,
} from "#imports";
import * as yup from "yup";
import { useAccountStore } from "~/store/accounts";
import { useAuthStore } from "~/store/auth";
import { storeToRefs } from "pinia";

const props = defineProps<{
    accounts: any[];
    systemSettings: (ICustomerSystemSettings & {
        region: IRegion;
    })[];
    systems: ISystem[];
}>();

const showCreateAccountModal = ref<boolean>(false);
const choseSystem = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const enabledSystems = computed(() => {
    return props.systemSettings.filter((s) => s.isActive);
});
const selectedSystem = ref<SystemName>(SystemName.GoogleAds);

const { handleSubmit, values, setFieldValue, meta, errors } = useForm<{
    account: {
        email?: string;
        accountName?: string;
        site?: string;
        system: SystemName;
    };
}>({
    validationSchema: yup.object().shape({
        account: yup.object().shape({
            email: yup.lazy((_val) => {
                if (selectedSystem.value === SystemName.GoogleAds)
                    return yup
                        .string()
                        .required()
                        .matches(/.+@gmail\.com/, {
                            message:
                                t("Validation.ShouldContain") + "@gmail.com",
                        });
                if (selectedSystem.value === SystemName.VK)
                    return yup
                        .string()
                        .required()
                        .matches(/[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,5}/, {
                            message: t("Validation.InvalidSite"),
                        });
                if (
                    [SystemName.MyTarget, SystemName.Telegram].includes(
                        selectedSystem.value,
                    )
                )
                    return yup.string().required();
                if (
                    [
                        SystemName.TikTok,
                        SystemName.Facebook,
                        SystemName.DV360,
                        SystemName.OK,
                        SystemName.LinkedIn,
                    ].includes(selectedSystem.value)
                )
                    return yup.string().email().required();
                return yup.string().optional();
            }),
            accountName: yup.lazy(() => {
                if (
                    [SystemName.Telegram, SystemName.AppleSearch].includes(
                        selectedSystem.value,
                    )
                )
                    return yup.string().required();
                return yup.string().optional();
            }),
            site: yup.string().required().url(),
            system: yup.string().required().oneOf(Object.values(SystemName)),
        }),
    }),
    initialValues: {
        account: {
            email: "",
            accountName: "",
            site: "",
            system: "",
        },
    },
});

const authStore = useAuthStore();
const contract = authStore.getActiveContract;
const { t } = useI18n();
const auth = useAuthStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(auth);

const updateSystem = (systemName: SystemName) => {
    selectedSystem.value = systemName;
    setFieldValue("account.system", systemName);
};
const handleCreateAccountSubmit = handleSubmit(async (values) => {
    isLoading.value = true;

    const result = await accountStore.create({
        customerId: user.value?.customer?.id,
        contractId: contract?.id ?? 0,
        accountName: values.account.accountName,
        site: values.account.site,
        email: values.account.email,
        system: values.account.system,
    });
    isLoading.value = false;
    showCreateAccountModal.value = false;
    if (result) useEvent("new-account", result);
});

watch(
    enabledSystems,
    (val: ICustomerSystemSettings[]) => {
        if (!selectedSystem.value && val && Array.isArray(val)) {
            selectedSystem.value = val[0]?.systemName;
            setFieldValue("account.system", val[0]?.systemName);
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

useListen("modal:add-account", () => {
    showCreateAccountModal.value = true;
    console.log("has");
});
</script>

<template>
    <div>
        <b-modal id="create-account-modal" ref="modal" v-model="showCreateAccountModal" hide-footer hide-header>
            <form @submit.prevent="handleCreateAccountSubmit">
                <div class="create-account-form-container">
                    <div class="system-buttons-container">
                        <template v-for="system in enabledSystems" :key="system.id">
                            <div :class="selectedSystem === system.systemName &&
                                'active'
                                " class="select-system-button" @click="updateSystem(system.systemName)">
                                <img :alt="system.systemName" :src="systemsToImg.get(system.systemName)" />
                            </div>
                        </template>
                    </div>
                    <div :class="choseSystem ? 'chose-system' : 'not-visible'">
                        {{ t("AccountManagement.ChoseSystem") }}
                    </div>

                    <UiFormInput v-if="selectedSystem === SystemName.GoogleAds" name="account.email"
                        placeholder="email@gmail.com" />
                    <UiFormInput v-if="selectedSystem === SystemName.MyTarget" :placeholder="t('AccountManagement.MyTargetPlaceholder')
                        " name="account.email" />
                    <UiFormInput v-if="selectedSystem === SystemName.Telegram" :placeholder="t('AccountManagement.TelegramUserPlaceholder')
                        " name="account.email" />
                    <UiFormInput v-if="[
                            SystemName.TikTok,
                            SystemName.Facebook,
                            SystemName.DV360,
                            SystemName.OK,
                            SystemName.LinkedIn,
                        ].includes(selectedSystem)
                        " placeholder="Email" name="account.email" />
                    <UiFormInput v-if="selectedSystem === SystemName.VK" :placeholder="t('AccountManagement.VKLink')"
                        :rules="{
                            required: true,
                            regex: /[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,5}/,
                        }" name="account.email" />
                    <UiFormInput v-if="selectedSystem === SystemName.Telegram" :placeholder="t('AccountManagement.AccountNameTelegramName')
                        " name="account.accountName" />
                    <UiFormInput v-if="selectedSystem === SystemName.AppleSearch" :placeholder="t('AccountManagement.AccountNameAppleSearchName')
                        " name="account.accountName" />
                    <UiFormInput v-if="![
                            SystemName.AppleSearch,
                            SystemName.Telegram,
                        ].includes(selectedSystem)
                        " :placeholder="t('AccountManagement.AccountName')" name="account.accountName" />
                    <UiFormInput v-if="[
                            SystemName.AppleSearch,
                            SystemName.Telegram,
                        ].includes(selectedSystem)
                        " :placeholder="t('AccountManagement.TelegramURLPlaceholder')
        " type="url" name="account.site" />
                    <UiFormInput v-else :placeholder="t('AccountManagement.Site')" type="url" name="account.site" />
                </div>
                <b-button :disabled="isLoading || !meta.valid" style="width: 100%; margin-top: 9px; height: 59px"
                    type="submit" variant="danger">
                    <template v-if="isLoading">
                        {{ t("AccountManagement.CreateAccount") }}
                        <b-spinner class="white ms-3" />
                    </template>
                    <template v-else>
                        {{ t("AccountManagement.CreateAccount") }}
                    </template>
                </b-button>
            </form>
        </b-modal>
    </div>
</template>
