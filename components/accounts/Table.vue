<script setup lang="ts">
import { systemsToImg } from "~/composables/useSystems";
import { SystemName } from "~/types/region.interface";
import { AccountTableRow, IAccount } from "~/types/account.interface";
import { ContractType } from "~/types/contract.interface";
import { useEvent } from "~/composables/useEventBus";
import { useAccountStore } from "~/store/accounts";

const props = defineProps<{
    system: SystemName;
    accounts: IAccount[];
    adminVersion?: boolean;
    customerId: number;
    isActive: boolean;
    allowTransfer: boolean;
    contractType: ContractType;
}>();

const isOpen = ref<boolean>(false);
const accountStore = useAccountStore();
const { t } = useI18n();

const fields = markRaw([
    {
        key: "accountName",
        label: t("AccountManagement.AccountName"),
        sortable: true,
        tdClass: "account-name-column",
    },
    {
        key: "accountLogin",
        label: t("AccountManagement.AccountLogin"),
        sortable: true,
        tdClass: "account-login-column",
    },
    {
        key: "balance",
        label: t("AccountManagement.AccountBalance"),
        sortable: true,
        tdClass: "account-balance-column",
    },
    {
        key: "spentInMonth",
        label: t("AccountManagement.SpentInMonth"),
        sortable: true,
        tdClass: "spent-in-month-column",
    },
    {
        key: "gabColumn2",
        label: "",
        sortable: false,
    },
    {
        key: "gabColumn3",
        label: "",
        sortable: false,
    },
    {
        key: "topUpAccount",
        label: t("AccountManagement.TopUpAccount"),
        sortable: false,
        tdClass: "top-up-account-column",
    },
    {
        key: "transfer",
        label: t("AccountManagement.Transfer"),
        sortable: false,
        tdClass: "transfer-column",
    },
    {
        key: "gabColumn4",
        label: "",
        sortable: false,
        tdClass: "gab-column-4",
    },
]);
const adminFields = markRaw([
    {
        key: "accountName",
        label: t("AccountManagement.AccountName"),
        sortable: true,
        tdClass: "account-name-column",
    },
    {
        key: "gabColumn1",
        label: "",
        sortable: false,
        tdClass: "gab-column-1",
    },
    {
        key: "accountLogin",
        label: t("AccountManagement.AccountLogin"),
        sortable: true,
        tdClass: "account-login-column",
    },
    {
        key: "accountPassword",
        label: t("AccountManagement.AccountPassword"),
        sortable: true,
        tdClass: "account-login-column",
    },
    {
        key: "gabColumn2",
        label: "",
        sortable: false,
    },
    {
        key: "gabColumn3",
        label: "",
        sortable: false,
    },
    {
        key: "actions",
        label: t("AccountManagement.AdminActions"),
        sortable: false,
        tdClass: "actions-column",
    },
]);

const items = ref<AccountTableRow[]>([]);

onMounted(() => {
    const accounts = props.accounts;
    for (let i = 0; i < accounts.length; i++) {
        let item: AccountTableRow = {
            accountId: accounts[i].id,
            allowTransfer: Boolean(
                props.allowTransfer && accounts[i].accountName,
            ),
            accountName: accounts[i].accountName,
            accountLogin: accounts[i].login,
            accountPassword: accounts[i].password,
            balance: accounts[i].balance > 0 ? accounts[i].balance : "",
            spentInMonth: accounts[i].spentInMonth,
            systemId: accounts[i].systemId,
            topUpAccount: {
                accountId: accounts[i].id,
                isActive: accounts[i].isActive,
            },
            transfer: accounts[i].isActive,
            actions: {
                accountId: accounts[i].id,
                isActive: accounts[i].isActive,
            },
        };
        if (!accounts[i].isActive) {
            item._rowVariant = "secondary";
        }
        items.value.push(item);
    }
});

const transferItem = (item: AccountTableRow) => {
    if (item.allowTransfer) {
        useEvent("modal:transfer", {
            system: props.system,
            accountId: item.actions.accountId,
        });
    }
};

const popupItem = (account: AccountTableRow) => {
    useEvent("modal:activate-account", {
        system: props.system,
        accountId: account.accountId,
    });
    accountStore.setForm({
        id: account.accountId,
        customerId: props.customerId,
        isLoading: false,
        isActivate: true,
        account: account,
    });
};
const accountDelete = (id: number) => {
    accountStore.delete(id);
};
const accountEdit = (id: number, customerId: number) => {
    useEvent("modal:edit-account", {
        system: props.system,
        accountId: id,
        customerId,
    });
};
</script>

<template>
    <div>
        <div
            class="table-system-header"
            @dblclick="isOpen = !isOpen"
            @click="isOpen = !isOpen"
            :class="isOpen && 'header-open'"
        >
            <div class="table-system-header__items">
                <div class="table-system-icon">
                    <img :src="systemsToImg.get(system)" :alt="system" />
                </div>
                <div class="public-contract">
                    {{
                        contractType === "STANDARD"
                            ? $t("AccountManagement.PublicContractFull")
                            : $t("AccountManagement.UniqueContract")
                    }}
                </div>
                <div
                    class="public-contract-status"
                    :class="isActive ? 'green' : 'danger'"
                >
                    {{
                        isActive
                            ? $t("AccountManagement.Active")
                            : $t("AccountManagement.NotActive")
                    }}
                </div>
            </div>
            <div class="close-open-button" @click.stop="isOpen = !isOpen">
                <IBiChevronUp
                    class="chevron-btn close-open-button"
                    :class="{ open: isOpen }"
                />
            </div>
        </div>
        <div class="table-container" v-show="isOpen">
            <b-table
                class="my-table"
                :items="items"
                :fields="adminVersion ? adminFields : fields"
            >
                <template #cell(topUpAccount)="data">
                    <div
                        class="action-icon green active"
                        v-if="data.value.isActive && isActive"
                    >
                        <IBiPlusSquare
                            @click="useEvent('modal:popup-account', {
                                system,
                                accountId: data.value.accountId
                            })"
                        />
                    </div>
                    <div class="action-icon" v-else>
                        <IBiPlusSquare />
                    </div>
                </template>
                <template #cell(transfer)="data">
                    <div
                        class="action-icon"
                        @click="transferItem(data.item)"
                        :class="data.item.allowTransfer && 'active'"
                    >
                        <IBiArrowLeftRight />
                    </div>
                </template>
                <template #cell(actions)="data">
                    <div
                        style="
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                        "
                    >
                        <div
                            v-if="!data.value.isActive"
                            class="action-icon active mr-3"
                        >
                            <IBiCheck2All
                                variant="success"
                                @click="popupItem(data.item)"
                            />
                        </div>
                        <div
                            class="action-icon active mr-2"
                            @click="
                                accountEdit(data.value.accountId, customerId)
                            "
                        >
                            <IBiPencil variant="primary" />
                        </div>
                        <div
                            class="action-icon active"
                            @click="accountDelete(data.value.accountId)"
                        >
                            <IBiTrash class="danger" />
                        </div>
                    </div>
                </template>
            </b-table>
        </div>
    </div>
</template>

<style lang="css">
.table-system-header {
    min-height: 69px;
    background-color: #ffffff;
    border-radius: 5px;
    padding-left: 2.2em;
    padding-right: 2.2em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
}
.table-system-header__items {
    display: flex;
    flex-direction: row;
    align-items: center;
}
@media screen and (max-width: 768px) {
    .table-system-header {
        padding-left: 15px;
        padding-right: 15px;
    }
    .table-system-header__items {
        display: grid;
        grid-gap: 5px;
        padding-right: 5px;
        grid-template-columns: 1fr auto 1fr;
    }
}

.table-system-header.header-open {
    border-radius: 5px 5px 0 0;
}

.table-system-icon {
    display: flex;
    align-items: center;
    width: 170px;
    height: 40px;
}
@media screen and (max-width: 768px) {
    .table-system-icon {
        width: 140px;
        height: auto;
        margin-left: -20px;
        margin-right: -20px;
    }
}
.table-system-icon img {
    display: block;
    max-height: 40px;
    width: auto;
}

.close-open-button {
    opacity: 0.3;
    font-weight: bold;
}

.close-open-button:hover {
    cursor: pointer;
    opacity: 0.7;
}

.table-container {
    border-radius: 0 0 5px 5px;
    transition: 0.3s ease;
    padding-bottom: 1em;
}

.account-name-column {
    width: 11em;
}

.gab-column-1 {
    width: 3em;
}

.account-login-column {
    width: 12em;
}

.account-balance-column {
    text-align: center;
    width: 11em;
}

.spent-in-month-column {
    width: 10em;
}

.top-up-account-column {
    width: 6em;
}

.transfer-column {
    width: 6em;
}

.gab-column-4 {
    width: 4em;
}

.public-contract {
    margin-left: 4.75em;
    margin-right: 4.75em;
    font-size: 14px;
    font-weight: 500;
    color: var(--paragraphColor);
}
@media screen and (max-width: 768px) {
    .public-contract {
        margin-left: 0;
        margin-right: 0;
        text-align: center;
    }
}

.public-contract-status {
    font-size: 14px;
    font-weight: 700;
}

.action-icon {
    text-align: center;
    vertical-align: middle;
    opacity: 1;
}

.action-icon.green {
    margin-top: 2px;
    color: var(--green);
}

.action-icon img {
    opacity: 0.4;
}

.action-icon.active img {
    opacity: 1;
}

.action-icon.active:hover {
    cursor: pointer;
    transform: scale(1.2);
}

.chevron-btn {
    font-size: 140%;
    transform: rotate(0deg);
    transition: transform 0.3s ease;
    cursor: pointer;
}
.chevron-btn.open {
    transform: rotate(180deg);
}
</style>
