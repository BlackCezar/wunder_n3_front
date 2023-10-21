<script setup lang="ts">
import { storeToRefs } from "pinia";
import * as yup from "yup";
import TopUpFormItem from "~/components/accounts/forms/TopUpFormItem.vue";
import { systemsToImg } from "~/composables/useSystems";
import { useAccountStore } from "~/store/accounts";
import { useAuthStore } from "~/store/auth";
import type { ITopUpAccount } from "~/types/account.interface";
import { PayType, SystemName } from "~/types/region.interface";
import type { ISystemSettings } from "~/types/region.interface";
import { useRegionStore } from "~/store/regions";

const props = defineProps<{
    accountId: number;
    systemName: SystemName;
    enabledSystems: ISystemSettings[];
}>();
const autoStore = useAuthStore();
const accountsStore = useAccountStore();
const { accounts } = storeToRefs(accountsStore);
const { getSettings, getActiveContract } = storeToRefs(autoStore);
const selectedSystemForTopUp = ref(props.systemName);
const { hide } = useModal();
const { t } = useI18n();
const regionStore = useRegionStore();
const { globalSettings, regionCurrency } = storeToRefs(regionStore);

const selectSystemForTopUp = (systemName: SystemName) => {
    selectedSystemForTopUp.value = systemName;
};

watch(
    () => props.systemName,
    (val) => selectSystemForTopUp(val),
    {
        immediate: true,
        deep: true,
    },
);

const hasActiveAccount = (system: SystemName): boolean => {
    return !!accounts.value.find(
        (account) =>
            account.system?.name &&
            account.system.name === system &&
            account.isActive,
    );
};

const {
    values,
    isSubmitting,
    setTouched,
    meta,
    errors,
    handleSubmit,
    setValues,
} = useForm<{ topUpAccounts: ITopUpAccount[] }>({
    validationSchema: yup.object({
        publicAgree: yup.boolean().isTrue().required(),
        topUpAccounts: yup.array().of(
            yup.lazy((systemValue) => {
                const min = Number(
                    props.enabledSystems.find(
                        (item) => item.systemName === systemValue.systemName,
                    )?.minSum ?? 0,
                );

                return yup.object<ITopUpAccount>({
                    isActive: yup.boolean().required().default(false),
                    systemName: yup.string().required(),
                    accounts: yup.array().of(
                        yup.object({
                            id: systemValue.isActive
                                ? yup.number().required().min(1)
                                : yup.number().optional(),
                            sum: systemValue.isActive
                                ? yup.number().required().min(min)
                                : yup.number().optional(),
                        }),
                    ),
                });
            }),
        ),
    }),
    keepValuesOnUnmount: true,
    initialValues: {
        topUpAccounts: [],
    },
});

function setValuesFromProps() {
    if (props.enabledSystems?.length)
        setValues({
            topUpAccounts: props.enabledSystems.map((item) => {
                if (item.systemName === props.systemName)
                    return {
                        isActive: true,
                        systemName: item.systemName,
                        accounts: [
                            {
                                id: props.accountId,
                                sum: 0,
                            },
                        ],
                    };

                const account = accounts.value?.find(
                    (account) => account.systemId === item.id,
                );
                const systemAccounts = account
                    ? [
                          {
                              id: account.id,
                              sum: 0,
                          },
                      ]
                    : [];

                return {
                    isActive: false,
                    accounts: systemAccounts,
                    systemName: item.systemName,
                } satisfies ITopUpAccount;
            }),
        });
}

const cancel = () => {
    setTouched(false);
    setValuesFromProps();
    hide();
};

const billItemsNumber = computed(
    () =>
        values.topUpAccounts.filter(
            (item) => item.isActive && item.accounts.length,
        )?.length ?? 0,
);

const processForm = handleSubmit(async (values) => {
    console.log("VALUES", values);
    const activeList = values.topUpAccounts.filter((item) => item.isActive);
    if (!getActiveContract.value) {
        useNuxtApp().$toast.error("Активный договор не найден");
        return;
    }

    const isSuccess = await accountsStore.topUpAccounts({
        list: activeList,
        customerId: getActiveContract.value.customerId,
        contractId: getActiveContract.value.id,
        currency: regionCurrency.value ?? "BYN",
    });
    if (isSuccess) {
        const messasge =
            getSettings.value?.payType === PayType.POSTPAY
                ? t("AccountManagement.TopUpPostPayAccountCreated")
                : t("AccountManagement.TopUpAccountCreated");
        useNuxtApp().$toast.success(messasge);
        setValuesFromProps();
        setTouched(false);
        hide();
    }
});

const isValidItem = (index: number) => {
    if (errors.value) {
        for (const key in errors.value) {
            if (key.startsWith(`topUpAccounts[${index}]`)) return false;
        }
    }
    return meta.value.touched;
};
const isActiveItem = (index: number) => {
    return values.topUpAccounts?.[index]?.isActive ?? false;
};
watch(
    () => props.accountId,
    () => {
        if (props.accountId) setValuesFromProps();
    },
    {
        immediate: true,
    },
);
watch(
    () => props.systemName,
    () => {
        if (props.systemName) setValuesFromProps();
    },
    {
        immediate: true,
    },
);
</script>
<template>
    <form @submit.prevent="processForm">
        <div class="top-up-tabs">
            <div class="top-up-tabs__wrapper">
                <div class="top-up-tabs__items">
                    <template
                        v-for="(system, index) in enabledSystems"
                        :key="system.id"
                    >
                        <button
                            type="button"
                            class="top-up-tab select-system-tab border-0"
                            :class="{
                                active:
                                    selectedSystemForTopUp ===
                                    system.systemName,
                                disable: !hasActiveAccount(system.systemName),
                            }"
                            :disabled="!hasActiveAccount(system.systemName)"
                            @click="selectSystemForTopUp(system.systemName)"
                        >
                            <img
                                :src="systemsToImg.get(system.systemName)"
                                :alt="system.systemName"
                            />
                            <div
                                v-if="isActiveItem(index)"
                                class="round-indicator-wrapper"
                            >
                                <div
                                    class="round-indicator"
                                    :class="{
                                        green: isValidItem(index),
                                        red: !isValidItem(index),
                                    }"
                                />
                            </div>
                        </button>
                    </template>
                </div>
                <div class="top-up-form-container">
                    <div v-if="!selectedSystemForTopUp">
                        {{ $t("AccountManagement.NoActiveAccounts") }}
                    </div>
                    <div v-else>
                        <template
                            v-for="(system, index) in enabledSystems"
                            :key="system.id"
                        >
                            <TopUpFormItem
                                v-show="
                                    system.systemName === selectedSystemForTopUp
                                "
                                :system="system"
                                :index="index"
                            />
                        </template>

                        <Field
                            name="publicAgree"
                            as="div"
                            class="checkbox-block"
                            :value="true"
                            type="checkbox"
                            v-slot="{ field, meta }"
                        >
                            <label class="mt-3">
                                <input
                                    class="form-check-input"
                                    :class="{
                                        'is-invalid':
                                            !meta.valid && meta.touched,
                                    }"
                                    type="checkbox"
                                    :value="true"
                                    v-bind="field"
                                />
                                <span>
                                    {{ $t(`registration.agreeWith`) }}
                                    <a
                                        class="a-link"
                                        :href="globalSettings?.publicContract"
                                        >{{
                                            $t(`registration.publicContract`)
                                        }}</a
                                    >
                                </span>
                            </label>
                        </Field>
                    </div>
                </div>
            </div>
        </div>
        <div class="top-up-buttons">
            <div v-if="billItemsNumber" class="count-indicator">
                {{ billItemsNumber }}
            </div>
            <b-row class="h-100 m-0">
                <b-col style="padding: 0 1px 0 0">
                    <b-button
                        type="submit"
                        :disabled="isSubmitting || billItemsNumber === 0"
                        class="m-0 w-100 h-100"
                        variant="danger"
                    >
                        <template v-if="isSubmitting">
                            {{ $t("AccountManagement.GenerateBill") }}
                            <b-spinner variant="light" class="ml-3" />
                        </template>
                        <template v-else>
                            {{ $t("AccountManagement.GenerateBill") }}
                        </template>
                    </b-button>
                </b-col>
                <b-col class="p-0">
                    <b-button
                        @click="cancel"
                        class="m-0 w-100 h-100 cancel"
                        variant="outline-danger"
                    >
                        {{ $t("AccountManagement.Cansel") }}
                    </b-button>
                </b-col>
            </b-row>
        </div>
    </form>
</template>

<style scoped lang="css">
.select-system-tab {
    max-width: 220px;
    position: relative;
}

.round-indicator-wrapper {
    position: absolute;
    right: 5px;
}

.pl-3 {
    padding-left: 1.5rem;
}

.checkbox-block label {
    display: flex;
    gap: 0.5rem;
}

.checkbox-block .form-check-input[type="checkbox"] {
    margin-left: 0 !important;
}
</style>
