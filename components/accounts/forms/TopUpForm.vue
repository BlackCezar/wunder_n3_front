<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
import { storeToRefs } from "pinia";
import { SystemName } from "~/types/region.interface";
import { useAccountStore } from "~/store/accounts";
import { systemsToImg } from "~/composables/useSystems";
import * as yup from "yup";
import { ITopUpAccount } from "~/types/account.interface";
import TopUpFormItem from "~/components/accounts/forms/TopUpFormItem.vue";

const props = defineProps<{
    accountId: number;
    systemName: SystemName;
}>();
const autoStore = useAuthStore();
const accountsStore = useAccountStore();
const { accounts } = storeToRefs(accountsStore);
const { getSystemSettings } = storeToRefs(autoStore);
const enabledSystems = computed(() => getSystemSettings.value ?? []);

const selectedSystemForTopUp = ref(props.systemName);

const selectSystemForTopUp = (systemName: SystemName) => {
    selectedSystemForTopUp.value = systemName;
};

const hasActiveAccount = (system: SystemName) => {
    return !!accounts.value.find((account) => account.system?.name === system);
};

const { values } = useForm({
    validationSchema: yup.object({
        topUpAccounts: yup.array().of(
            yup.object<ITopUpAccount>({
                isActive: yup.boolean().required().default(false),
                systemName: yup.string().required(),
                accountId: yup.number().required(),
            }),
        ),
    }),
    initialValues: {
        topUpAccounts: [
            {
                isActive: true,
                systemName: props.systemName,
                accountId: props.accountId,
            },
        ],
    },
});
</script>
<template>
    <form v-if="accountId && accountId > 0">
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
                        </button>
                    </template>
                </div>
                <div class="top-up-form-container w-100">
                    <div v-if="!selectedSystemForTopUp">
                        {{ $t("AccountManagement.NoActiveAccounts") }}
                    </div>
                    <div v-else class="w-100">
                        <TopUpFormItem :system-name="selectedSystemForTopUp" />
                        <!--                        <div
                            class="selected-system"
                            :class="
                                !topUpAccounts[selectedSystemForTopUp].length &&
                                'gray'
                            "
                        >
                            <div class="selected-systems-icon">
                                <img
                                    :src="
                                        systemsToImg.get(selectedSystemForTopUp)
                                    "
                                    :alt="selectedSystemForTopUp"
                                />
                            </div>

                            <b-icon
                                v-if="
                                    topUpAccounts[selectedSystemForTopUp].length
                                "
                                icon="toggle-on"
                                font-scale="2.6"
                                variant="success"
                                class="toggle-icon"
                                @click="
                                    toggleOffSystemForTopUp(
                                        selectedSystemForTopUp,
                                    )
                                "
                            />
                            <b-icon
                                class="toggle-icon"
                                v-else
                                icon="toggle-off"
                                font-scale="2.6"
                                style="color: #bbbbbb"
                                @click="
                                    addAccountForTopUp(selectedSystemForTopUp)
                                "
                            />
                        </div>
                        <div
                            class="top-up-form-row"
                            v-for="(line, index) in topUpAccounts[
                                selectedSystemForTopUp
                            ]"
                            :key="index"
                        >
                            <validation-provider
                                name="selectAccount"
                                slim
                                :rules="{ required: true }"
                                v-slot="validationContext"
                            >
                                <b-form-group>
                                    <b-form-select
                                        v-model="line.accountId"
                                        :class="
                                            !line.accountId &&
                                            'select-default-option'
                                        "
                                        :options="
                                            getActiveAccounts(
                                                selectedSystemForTopUp,
                                            )
                                        "
                                        :state="
                                            getValidationState(
                                                validationContext,
                                            )
                                        "
                                    >
                                        <template #first>
                                            <b-form-select-option
                                                :value="null"
                                                disabled
                                                class="select-default-option"
                                            >
                                                {{
                                                    $t(
                                                        "AccountManagement.SelectAccount",
                                                    )
                                                }}
                                            </b-form-select-option>
                                        </template>
                                    </b-form-select>
                                </b-form-group>
                            </validation-provider>
                            <validation-provider
                                name="AccountSum"
                                :rules="{
                                    required: true,
                                    min_value: systemSettings.get(
                                        selectedSystemForTopUp,
                                    ).minSum,
                                }"
                                v-slot="validationContext"
                                slim
                            >
                                <b-input
                                    v-model.number="line.sum"
                                    :placeholder="$t('AccountManagement.Sum')"
                                    type="number"
                                    id="AccountSum"
                                    name="AccountSum"
                                    step="0.01"
                                    :state="
                                        getValidationState(validationContext)
                                    "
                                ></b-input>
                            </validation-provider>
                            <b-button
                                @click="
                                    deleteAccountForTopUp(
                                        selectedSystemForTopUp,
                                        index,
                                    )
                                "
                                variant="outline-danger"
                                >—
                            </b-button>
                        </div>
                        <div
                            v-if="topUpAccounts[selectedSystemForTopUp].length"
                            class="top-up-form-row"
                        >
                            <b-button
                                @click="
                                    addAccountForTopUp(selectedSystemForTopUp)
                                "
                                variant="outline-info"
                                class="add-account-for-top-up"
                                v-if="
                                    topUpAccounts[selectedSystemForTopUp]
                                        .length <
                                    getActiveAccounts(selectedSystemForTopUp)
                                        .length
                                "
                            >
                                {{ $t("AccountManagement.AddAccount") }}
                            </b-button>
                        </div>
                        <div
                            v-if="topUpAccounts[selectedSystemForTopUp].length"
                            class="mt-3"
                        >
                            <div
                                class="gray"
                                v-if="
                                    getSumForTopUp(selectedSystemForTopUp) >=
                                    systemSettings.get(selectedSystemForTopUp)
                                        .minSum
                                "
                            >
                                {{
                                    $t("AccountManagement.SumWithVat", {
                                        variable: getTotalWithVat(
                                            selectedSystemForTopUp,
                                        ),
                                    })
                                }}
                            </div>
                            <div
                                v-if="
                                    getSumComission(selectedSystemForTopUp) !==
                                    0
                                "
                                class="gray"
                            >
                                {{
                                    $t("AccountManagement.Comission", {
                                        variable: getSumComission(
                                            selectedSystemForTopUp,
                                        ),
                                    })
                                }}
                            </div>
                            <div
                                v-if="
                                    getSumDiscount(selectedSystemForTopUp) !== 0
                                "
                                class="gray"
                            >
                                {{
                                    $t("AccountManagement.Discount", {
                                        variable: getSumDiscount(
                                            selectedSystemForTopUp,
                                        ),
                                    })
                                }}
                            </div>
                            <div>
                                {{
                                    $t("AccountManagement.YourSum", {
                                        variable:
                                            getSumForTopUp(
                                                selectedSystemForTopUp,
                                            ) -
                                            getSumComission(
                                                selectedSystemForTopUp,
                                            ) +
                                            getSumDiscount(
                                                selectedSystemForTopUp,
                                            ),
                                    })
                                }}
                            </div>
                            <div
                                class="gray"
                                v-if="
                                    getSumForTopUp(selectedSystemForTopUp) >=
                                        systemSettings.get(
                                            selectedSystemForTopUp,
                                        ).minSum &&
                                    !['BYN', 'KZT'].includes(
                                        systemSettings.get(
                                            selectedSystemForTopUp,
                                        ).currency,
                                    )
                                "
                            >
                                {{
                                    getCurrencyAccountEquivalent(
                                        systemSettings.get(
                                            selectedSystemForTopUp,
                                        ),
                                        selectedSystemForTopUp,
                                    )
                                }}
                            </div>
                            <div
                                class="gray"
                                :class="
                                    getSumForTopUp(selectedSystemForTopUp) >=
                                    systemSettings.get(selectedSystemForTopUp)
                                        .minSum
                                        ? 'gray'
                                        : 'danger'
                                "
                            >
                                {{
                                    $t("AccountManagement.MinSum", {
                                        variable: systemSettings.get(
                                            selectedSystemForTopUp,
                                        ).minSum,
                                    })
                                }}
                            </div>
                            <div class="gray" v-if="
                                getSumForTopUp(selectedSystemForTopUp) >=
                                systemSettings.get(selectedSystemForTopUp).minSum
                            ">
                                {{
                                    $t("AccountManagement.SumWithoutVat", {
                                        variable: getTotalWithoutVat(selectedSystemForTopUp)
                                    })
                                }}
                            </div>
                            <ValidationProvider
                                ref="publicAgree"
                                name="publicAgree"
                                :rules="{ required: { allowFalse: false } }"
                                v-if="contract.contractType === 'STANDARD'"
                                v-slot="{ dirty, validated, valid }"
                            >
                                <b-form-group>
                                    <b-form-checkbox
                                        :state="
                                            dirty || validated ? valid : null
                                        "
                                        v-model="publicAgree"
                                        id="publicAgree"
                                        class="form-checkbox"
                                    >
                                        {{ $t(`registration.agreeWith`) }}
                                        <a
                                            class="a-link"
                                            :href="
                                                globalSettings.publicContract
                                            "
                                            >{{
                                                $t(
                                                    `registration.publicContract`,
                                                )
                                            }}</a
                                        >
                                    </b-form-checkbox>
                                    <b-form-invalid-feedback
                                        :state="
                                            dirty || validated ? valid : null
                                        "
                                        class="form-input-invalid-feedback"
                                        id="input-live-feedback"
                                    >
                                        {{ $t("registration.PhoneFeedback") }}
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </ValidationProvider>
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="top-up-buttons">
            <!--
            <div v-if="billItemsNumber" class="count-indicator">
                {{ billItemsNumber }}
            </div>
            <b-row class="h-100 m-0">
                <b-col style="padding: 0 1px 0 0">
                    <b-button
                        type="submit"
                        :disabled="isLoading"
                        class="m-0 w-100 h-100"
                        variant="danger"
                    >
                        <template v-if="isLoading">
                            {{ $t("AccountManagement.GenerateBill") }}
                            <b-spinner variant="white ml-3" />
                        </template>
                        <template v-else>
                            {{ $t("AccountManagement.GenerateBill") }}
                        </template>
                    </b-button>
                </b-col>
                <b-col class="p-0">
                    <b-button
                        @click="closeTopUpModal"
                        class="m-0 w-100 h-100 cancel"
                        variant="outline-danger"
                    >
                        {{ $t("AccountManagement.Cansel") }}
                    </b-button>
                </b-col>
            </b-row>
            -->
        </div>
    </form>
</template>

<style scoped lang="css">
.select-system-tab {
    max-width: 220px;
}
</style>
