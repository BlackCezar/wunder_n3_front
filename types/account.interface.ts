import type { ICustomer } from "~/types/user.interface";
import type { ISystem, SystemName } from "~/types/region.interface";
import type { IContract } from "~/types/contract.interface";

export interface IAccount {
    id: number;
    customerId: number;
    systemId: number;
    contractId: number;
    balance: number;
    isActive: boolean;
    login?: string;
    password?: string;
    email?: string;
    accountName: string;
    site: string;

    spentInMonth: number;

    externalAccountId?: string;
    externalClientId?: string;
    externalAgency?: string;
    externalRegion?: string;

    customer?: ICustomer;
    system: ISystem;
    contract?: IContract;
}

export type UpdateAccountPayload = Partial<IAccount>;

export type CreateAccountPayload = Pick<
    IAccount,
    | "customerId"
    | "accountName"
    | "site"
    | "email"
    | "externalAccountId"
    | "externalAgency"
    | "externalClientId"
    | "externalRegion"
> & {
    system: string;
    contractId: number;
};

export type AccountTableRow = {
    accountId: number;
    systemId: number;
    allowTransfer: boolean;
    accountName: string;
    accountLogin?: string;
    accountPassword?: string;
    balance: string | number;
    spentInMonth?: number;
    topUpAccount: {
        accountId: number;
        isActive: boolean;
    };
    transfer: boolean;
    actions: {
        accountId: number;
        isActive: boolean;
    };
    _rowVariant?: string;
};

export interface ITopUpAccount {
    isActive: boolean;
    systemName: SystemName;
    accounts: {
        id: number;
        sum: number;
    }[];
}

export type TopUpAccountPayload = {
    list: ITopUpAccount[];
    currency: string;
    customerId: number;
    contractId: number;
};
