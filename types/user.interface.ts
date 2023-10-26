import type { ContractType, IContract } from "~/types/contract.interface";
import type { IAccount } from "~/types/account.interface";
import type { ICustomerSettings } from "./region.interface";
import type { TableItem } from "bootstrap-vue-next";

export type ICustomerUser = {
    id: number;
    customer: ICustomer;
    role: ICustomerRole.CUSTOMER;
    email: string;
    contracts: IContract[];
};
export type IAdminUser = {
    id: number;
    role: ICustomerRole.ADMIN;
    email: string;
    contracts: [];
};

export type IUser = ICustomerUser | IAdminUser;

export const enum ICustomerRole {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
}

export interface ICustomer extends ICustomerCandidate {
    userId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    isNew: boolean;
    dateOfBirth?: Date;
    accountNumber: string;
    BIC: string;
    bankAddress: string;
    bankName: string;
    companyAddress: string;
    companyPhoneNumber: string;
    companyEmail: string;
    postalAddress: string;
    responsiblePersonFullName: string;
    responsiblePersonPosition: string;
    signatureDocumentType: string;
    personalAgree?: boolean;
    planFixId?: number;
    user?: IUser;
    contracts?: IContract[];
    accounts?: IAccount[];
    settings?: ICustomerSettings;
}

export interface ICustomerCandidate {
    id: number;
    regionName?: string;
    companyTaxNumber: string;
    contactEmail: string;
    companyName: string;
    contactPhoneNumber: string;
    customerId?: number;
    contactName: string;
    publicAgree: boolean;
    taskId?: number;
}

export type SignInPayload = {
    login: string;
    password: string;
};
export type SignInResponse = {
    token: {
        access_token: string;
        refresh_token: string;
    };
};

export interface CustomerTableItem extends TableItem {
    id: number;
    companyName: string;
    companyEmail: string;
    contactName: string;
    isActive: boolean;
    conditions: {
        contractType: ContractType;
        payType: string;
        clientId: number;
    };
    hasAccounts: boolean;
    actions: {
        clientId: number;
        isActive: boolean;
        userId: number;
    };
}
