<script setup lang="ts">
import type { ICustomer, CustomerTableItem } from "~/types/user.interface";
import type { ISystem } from "~/types/region.interface";
import { PaymentWay } from "~/types/invoice.interface";
import { ContractType } from "~/types/contract.interface";
import type { IContract } from "~/types/contract.interface";
import { useCustomerStore } from "~/store/customers";
import { useEvent } from "~/composables/useEventBus";
import { useAuthStore } from "~/store/auth";
import { CustomerEditTabs } from "~/types/common";

const props = defineProps<{
    clients: ICustomer[];
    systems: ISystem[];
    clientsToAccounts: Map<any, any>;
}>();
const { t } = useI18n();
const customerStore = useCustomerStore();
const authStore = useAuthStore();
const fields = markRaw([
    {
        key: "companyName",
        label: t("registration.CompanyName"),
        sortable: true,
        tdClass: "company-name-column",
    },
    {
        key: "companyEmail",
        label: t("registration.CompanyEmail"),
        sortable: true,
        tdClass: "company-email-column",
    },
    {
        key: "contactName",
        label: t("registration.FullName"),
        sortable: true,
        tdClass: "contact-name-column",
    },
    {
        key: "isActive",
        label: t("AccountManagement.AccountStatus"),
        sortable: true,
        tdClass: "is-active-column",
    },
    {
        key: "conditions",
        label: t("AccountManagement.Conditions"),
        sortable: true,
        tdClass: "conditions-column",
    },
    {
        key: "customerDocuments",
        label: t("Documents.Documents"),
        sortable: false,
        tdClass: "gab-column",
    },
    {
        key: "actions",
        label: t("AccountManagement.AdminActions"),
        sortable: false,
        tdClass: "actions-column",
    },
    {
        key: "showAccounts",
        label: t("AccountManagement.ShowAccounts"),
        sortable: false,
        tdClass: "show-accounts-column",
    },
]);
const clientsTypes = markRaw([
    {
        value: "publicContract",
        text: t("AccountManagement.PublicContract"),
    },
    {
        value: "uniqueContract",
        text: t("AccountManagement.UniqueContract"),
    },
]);

const items = computed<CustomerTableItem[]>(() => {
    const clients = props.clients;
    let items: any = [];
    for (let i = 0; i < clients.length; i++) {
        const contracts = clients[i].contracts;
        if (contracts && contracts.length) {
            const activeContract = contracts.find((c) => c.isActive);
            const settings = activeContract?.settings;
            const payType = settings
                ? settings.payType.toLowerCase()
                : PaymentWay.PREPAY;

            items.push({
                id: clients[i].id,
                companyName: clients[i].companyName,
                companyEmail: clients[i].companyEmail,
                contactName: clients[i].contactName,
                isActive: !!activeContract,
                conditions: {
                    contractType: getContractType(contracts, activeContract),
                    payType: t("Settings." + payType),
                    clientId: clients[i].id,
                },
                actions: {
                    clientId: clients[i].id,
                    isActive: clients[i].isActive,
                    userId: clients[i].userId,
                },
                hasAccounts: !!clients[i].accounts?.length,
            });
        } else {
            items.push({
                id: clients[i].id,
                companyName: clients[i].companyName,
                companyEmail: clients[i].companyEmail,
                contactName: clients[i].contactName,
                isActive: false,
                conditions: {
                    contractType: ContractType.NULL,
                    payType: null,
                    clientId: clients[i].id,
                },
                actions: {
                    clientId: clients[i].id,
                    isActive: clients[i].isActive,
                    userId: clients[i].userId,
                },
                hasAccounts: !!clients[i].accounts?.length,
            });
        }
    }

    return items;
});

const getContractType = (
    contracts: IContract[],
    activeContract?: IContract,
) => {
    if (activeContract) {
        return activeContract.contractType;
    }
    if (contracts && contracts.length) {
        return contracts[0].contractType;
    }
    return null;
};
const openContractsModal = async (tab: number, clientId: number) => {
    const customer = props.clients.find((c) => c.id === clientId);
    if (customer) {
        customerStore.setActiveCustomer({
            tab: tab,
            id: clientId,
            client: customer,
        });
        useEvent("modal:edit-contracts");
    }
};

const deleteCustomer = (customerId: number) => {
    customerStore.deleteCustomer(customerId);
};

const loginAsCustomer = (customerId: number) => {
    authStore.signInAsUser(customerId);
};
const openDocumentsModal = (tab: number, customerId: number) => {
    const customer = props.clients.find((c) => c.id === customerId);
    if (customer) {
        customerStore.setActiveCustomer({
            id: customerId,
            client: customer,
            tab: CustomerEditTabs.Invoices,
        });
        useEvent("modal:edit-documents", {
            id: customerId,
            customer,
        });
    }
};
const openEditClientModal = (tab: number, customerId: number) => {
    const customer = props.clients.find((c) => c.id === customerId);
    if (customer) {
        customerStore.setActiveCustomer({
            tab: tab,
            id: customerId,
            client: customer,
        });
        useEvent("modal:edit-client");
    }
};
</script>

<template>
    <div class="table-container">
        <b-table
            class="my-table"
            :items="items"
            :fields="fields"
            details-td-class="details-class"
        >
            <template #cell(isActive)="data">
                <div style="display: flex; flex-direction: row">
                    <div
                        class="action-icon active mr-2"
                        @click="
                            openContractsModal(
                                CustomerEditTabs.Contracts,
                                data.item.id,
                            )
                        "
                    >
                        <IBiPencil />
                    </div>
                    <span>
                        {{
                            data.item.conditions.contractType ===
                            ContractType.NULL
                                ? $t("AccountManagement.Null")
                                : data.value
                                ? $t("AccountManagement.Active")
                                : $t("AccountManagement.NotActive")
                        }}
                    </span>
                </div>
            </template>
            <template #cell(conditions)="data">
                <div style="display: flex; flex-direction: row">
                    <div
                        class="action-icon active mr-2"
                        @click="
                            openContractsModal('contract', data.value.clientId)
                        "
                    >
                        <IBiPencil />
                    </div>
                    <span
                        v-if="
                            data.value.contractType &&
                            data.value.contractType !== ContractType.NULL
                        "
                    >
                        {{ data.value.payType }}
                    </span>
                    <span v-else>{{ $t("EditClient.NoContracts") }}</span>
                </div>
            </template>
            <template #cell(showAccounts)="row">
                <div
                    v-if="row.item.hasAccounts"
                    class="chevron-btn close-open-button"
                    :class="{ open: !row.detailsShowing }"
                    style="display: flex; justify-content: center"
                    @click="row.toggleDetails"
                >
                    <IBiChevronUp />
                </div>
                <div v-else class="text-center">
                    {{ $t("AccountManagement.NoAccounts") }}
                </div>
            </template>
            <template #cell(customerDocuments)="data">
                <div
                    class="action-icon active mr-auto w-fit"
                    @click="
                        openDocumentsModal(
                            CustomerEditTabs.Contracts,
                            data.item.id,
                        )
                    "
                >
                    <IBiPencil />
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
                        class="action-icon active mr-2"
                        @click="
                            openEditClientModal(
                                CustomerEditTabs.MainData,
                                data.value.clientId,
                            )
                        "
                    >
                        <IBiPencil />
                    </div>
                    <div
                        class="action-icon active mr-2"
                        @click="deleteCustomer(data.value.clientId)"
                    >
                        <IBiTrash class="danger" />
                    </div>
                    <div
                        class="action-icon active"
                        @click="loginAsCustomer(data.value.userId)"
                    >
                        <IBiBoxArrowInRight class="danger" />
                    </div>
                </div>
            </template>
            <template #row-details="row">
                <div class="details-class">
                    <div
                        class="accounts-tables-container"
                        v-for="[
                            systemName,
                            accountsInSystem,
                        ] in clientsToAccounts.get(row.item.id)"
                        :key="systemName"
                    >
                        <AccountsTable
                            v-if="accountsInSystem.length"
                            :system="systemName"
                            :accounts="accountsInSystem"
                            :admin-version="true"
                            :allow-transfer="false"
                            :customer-id="row.item.id as number"
                            :is-active="row.item.isActive as boolean"
                            :contract-type="
                                row.item.conditions
                                    ?.contractType as ContractType
                            "
                        />
                    </div>
                </div>
            </template>
        </b-table>
    </div>
</template>

<style lang="css">
@import "assets/css/accounts.css";

.table {
    background: white;
}

.mr-auto {
    margin-right: auto;
}

.w-fit {
    width: fit-content;
}

.activate-client-button .b-icon.bi {
    text-align: center;
    vertical-align: middle;
}

.activate-client-button:hover .b-icon.bi {
    font-size: 130%;
}

.company-name-column {
    width: 11em;
}

.company-email-column {
    width: 11em;
}

.contact-name-column {
    width: 11em;
}

.is-active-column,
.conditions-column {
    width: 11em;
}

.show-accounts-column,
.actions-column {
    width: 7em;
}

.details-class {
    background-color: #f2f0f4;
    margin: -0.5rem;
    padding: 0.75rem;
}
@media screen and (min-width: 768px) {
    .details-class {
        padding: 5px 15px !important;
    }
}

account-title {
    display: flex;
    padding-top: 1.5rem;
    height: unset;
}

.create-account-name {
    width: 100%;
}

.create-account-img {
    width: auto;
    max-width: unset !important;
    height: 40px;
}
</style>
