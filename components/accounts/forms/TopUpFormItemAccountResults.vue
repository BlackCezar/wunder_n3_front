<script setup lang="ts">
import type { ITopUpAccount } from "~/types/account.interface";
import { useAuthStore } from "~/store/auth";
import { storeToRefs } from "pinia";
import { useRatesStore } from "~/store/rates";

const props = defineProps<{
    systemIndex: number;
    systemId: number;
}>();

const value = useFieldValue<ITopUpAccount>(
    () => `topUpAccounts[${props.systemIndex}]`,
);
const isValidAmount = useIsFieldValid(
    () => `topUpAccounts[${props.systemIndex}].accounts[0].sum`,
);
const autoStore = useAuthStore();
const ratesStore = useRatesStore();
const { t } = useI18n();
const { formatter } = useFormat();
const { rates } = storeToRefs(ratesStore);

const { getSettings, getSystemSettings } = storeToRefs(autoStore);

const sum = computed(() =>
    value.value.accounts.reduce((acc, item) => (acc += Number(item.sum)), 0),
);
const activeSystemSettings = computed(
    () =>
        getSystemSettings.value?.find((item) => item.id === props.systemId) ??
        null,
);

const getTotalWithOutVat = computed(() => {
    if (!getSettings.value) return 0;
    return (
        (sum.value * (100 - getSettings.value.vat)) /
        (100 + getSettings.value.vat)
    );
});

const getSumComission = computed(() => {
    if (!activeSystemSettings.value) return 0;

    for (const line of activeSystemSettings.value.lines) {
        if (
            Number(line.fromAmount) <= sum.value &&
            sum.value < Number(line.toAmount)
        )
            return (sum.value * line.commission) / 100;
    }
    return 0;
});

const getSumDiscount = computed(() => {
    if (!activeSystemSettings.value) return 0;

    for (const line of activeSystemSettings.value.lines) {
        if (
            Number(line.fromAmount) <= sum.value &&
            sum.value < Number(line.toAmount)
        )
            return (sum.value * line.discount) / 100;
    }
    return 0;
});

const total = computed(() => {
    return sum.value - getSumComission.value + getSumDiscount.value;
});

const totalCurrencyEquivalent = computed(() => {
    if (!activeSystemSettings.value) return "";

    let rate = 0;
    switch (activeSystemSettings.value.currency) {
        case "RU":
            rate = rates.value.sellRUB;
            break;
        case "EUR":
            rate = rates.value.sellEUR;
            break;
        case "USD":
            rate = rates.value.sellUSD;
            break;
    }
    if (rate <= 0) return "";

    const amount = total.value / rate;
    return t("AccountManagement.CurrencyEquivalents", {
        amount: `${formatter.format(amount)} ${
            activeSystemSettings.value.currency
        }`,
    });
});
//  getCurrencyAccountEquivalent(system, selectedSystem) {
//             let rates = 0

//             switch (system.currency) {
//                 case 'RU':
//                     rates = this.rates.sellRUB;
//                     break;
//                 case 'EUR':
//                     rates = this.rates.sellEUR;
//                     break;
//                 case 'USD':
//                     rates = this.rates.sellUSD;
//                     break;
//             }
//             let amount = this.getCurrencyEquivalent(
//                 this.getSumForTopUp(selectedSystem) - this.getSumComission(selectedSystem) + this.getSumDiscount(selectedSystem),
//                 rates
//             )
//         },
</script>
<template>
    <div class="mt-3" v-if="value.isActive">
        <div class="gray" v-if="isValidAmount">
            {{
                $t("AccountManagement.SumMinusVat", {
                    variable: formatter.format(getTotalWithOutVat),
                })
            }}
        </div>
        <div class="gray" v-if="getSumComission > 0 && isValidAmount">
            {{
                $t("AccountManagement.Comission", {
                    variable: formatter.format(getSumComission),
                })
            }}
        </div>
        <div class="gray" v-if="getSumDiscount > 0 && isValidAmount">
            {{
                $t("AccountManagement.Discount", {
                    variable: formatter.format(getSumDiscount),
                })
            }}
        </div>
        <div>
            {{
                $t("AccountManagement.YourSum", {
                    variable: formatter.format(total),
                })
            }}
        </div>
        <div class="gray" v-if="isValidAmount">
            {{ totalCurrencyEquivalent }}
        </div>
        <div
            class="gray"
            :class="{
                danger: !isValidAmount,
            }"
        >
            {{
                $t("AccountManagement.MinSum", {
                    variable: activeSystemSettings?.minSum ?? 0,
                })
            }}
        </div>
    </div>
</template>
