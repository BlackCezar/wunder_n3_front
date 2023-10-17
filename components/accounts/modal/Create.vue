<script lang="ts" setup>
import {
    ICustomerSystemSettings,
    IRegion,
    ISystem,
    SystemName,
} from "~/types/region.interface";
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
const selectedSystem = ref<SystemName>("");

const schema = computed(() =>
    yup.object().shape({
        account: yup.object().shape({
            email: [SystemName.Telegram, SystemName.AppleSearch].includes(
                selectedSystem.value,
            )
                ? yup.string().required()
                : [].includes(selectedSystem.value)
                ? yup.string().email().required()
                : yup.string().optional(),
            accountName: [SystemName.Telegram, SystemName.AppleSearch].includes(
                selectedSystem.value,
            )
                ? yup.string().required()
                : yup.string().optional(),
            site: yup.string().required().url(),
            system: yup.string().required(),
        }),
    }),
);

const { handleSubmit, values, setFieldValue, meta, errors } = useForm({
    validationSchema: schema,
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

const updateSystem = (systemName: string) => {
    selectedSystem.value = systemName;
    setFieldValue("account.system", systemName);
};
const handleCreateAccountSubmit = handleSubmit(async (values) => {
    isLoading.value = true;

    const result = await accountStore.create({
        customerId: auth.user.customer.id,
        contractId: contract?.id,
        accountName: values.account.accountName,
        site: values.account.site,
        email: values.account.email,
        system: values.account.system,
    });
    isLoading.value = false;
    showCreateAccountModal.value = false;
    useEvent("new-account", result);
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

useListen("modal:add-account", () => (showCreateAccountModal.value = true));
</script>

<template>
    <div>
        <b-modal
            id="create-account-modal"
            ref="modal"
            v-model="showCreateAccountModal"
            hide-footer
            hide-header
        >
            <form @submit.prevent="handleCreateAccountSubmit">
                <div class="create-account-form-container">
                    <div class="system-buttons-container">
                        <template
                            v-for="system in enabledSystems"
                            :key="system.id"
                        >
                            <div
                                :class="
                                    selectedSystem === system.systemName &&
                                    'active'
                                "
                                class="select-system-button"
                                @click="updateSystem(system.systemName)"
                            >
                                <img
                                    :alt="system.systemName"
                                    :src="systemsToImg.get(system.systemName)"
                                />
                            </div>
                        </template>
                    </div>
                    <div :class="choseSystem ? 'chose-system' : 'not-visible'">
                        {{ t("AccountManagement.ChoseSystem") }}
                    </div>

                    <UiFormInput
                        v-if="selectedSystem === SystemName.GoogleAds"
                        name="account.email"
                        placeholder="email@gmail.com"
                    />
                    <UiFormInput
                        v-if="selectedSystem === SystemName.MyTarget"
                        :placeholder="
                            t('AccountManagement.MyTargetPlaceholder')
                        "
                        name="account.email"
                    />
                    <UiFormInput
                        v-if="selectedSystem === SystemName.Telegram"
                        :placeholder="
                            t('AccountManagement.TelegramUserPlaceholder')
                        "
                        name="account.email"
                    />
                    <UiFormInput
                        v-if="
                            [
                                SystemName.TikTok,
                                SystemName.Facebook,
                                SystemName.DV360,
                                SystemName.OK,
                                SystemName.LinkedIn,
                            ].includes(selectedSystem)
                        "
                        name="account.email"
                    />
                    <UiFormInput
                        v-if="selectedSystem === SystemName.VK"
                        :placeholder="t('AccountManagement.VKLink')"
                        :rules="{
                            required: true,
                            regex: /[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,5}/,
                        }"
                        name="account.email"
                    />
                    <UiFormInput
                        v-if="selectedSystem === SystemName.Telegram"
                        :placeholder="
                            t('AccountManagement.AccountNameTelegramName')
                        "
                        name="account.accountName"
                    />
                    <UiFormInput
                        v-if="selectedSystem === SystemName.AppleSearch"
                        :placeholder="
                            t('AccountManagement.AccountNameAppleSearchName')
                        "
                        name="account.accountName"
                    />
                    <UiFormInput
                        v-if="
                            ![
                                SystemName.AppleSearch,
                                SystemName.Telegram,
                            ].includes(selectedSystem)
                        "
                        :placeholder="t('AccountManagement.AccountName')"
                        name="account.accountName"
                    />
                    <UiFormInput
                        v-if="
                            [
                                SystemName.AppleSearch,
                                SystemName.Telegram,
                            ].includes(selectedSystem)
                        "
                        :placeholder="
                            t('AccountManagement.TelegramURLPlaceholder')
                        "
                        :rules="{
                            required: true,
                            regex: /[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,5}/,
                        }"
                        name="account.site"
                    />
                    <UiFormInput
                        v-else
                        :placeholder="t('AccountManagement.Site')"
                        :rules="{
                            required: true,
                            regex: /[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,5}/,
                        }"
                        name="account.site"
                    />
                </div>
                <p>{{ errors }}</p>
                <b-button
                    :disabled="isLoading || !meta.valid"
                    style="width: 100%; margin-top: 9px; height: 59px"
                    type="submit"
                    variant="danger"
                >
                    <template v-if="isLoading">
                        {{ t("AccountManagement.CreateAccount") }}
                        <b-spinner variant="white ms-3" />
                    </template>
                    <template v-else>
                        {{ t("AccountManagement.CreateAccount") }}
                    </template>
                </b-button>
            </form>
        </b-modal>
    </div>
</template>
