import type { IAccount } from "~/types/account.interface";
import type { ICustomer } from "~/types/user.interface";
import type { IContract } from "~/types/contract.interface";

export enum InvoiceDocumentType {
    BILL = "BILL",
    ACT = "ACT",
    SIGNED_BILL = "SIGNED_BILL",
    SIGNED_ACT = "SIGNED_ACT",
}

export interface IInvoiceDocument {
    id: number;
    link: string;
    name: string;
    type: InvoiceDocumentType;
    invoiceId: number;
}
export type IInvoiceCachedSystemSettings = {
    currency: string;
    minSum: string;
    systemName: string;
    lines: {
        commission: number;
        discount: number;
        fromAmount: string;
        id: number;
        systemName: string;
        systemSettingsId: number;
        toAmount: string;
    }[];
};
export interface IInvoice {
    id: number;
    contractId: number;
    status: InvoiceStatus;
    createdAt: Date;
    taskId?: number;
    customerId: number;
    currency: string;
    invoiceNumber: string;
    invoiceDocument: IInvoiceDocument[];
    rates: IInvoiceRates | null;
    lines: IInvoiceLine[];
    cachedSystemSettings: IInvoiceCachedSystemSettings[];
    isVisible: boolean;
}

export interface IInvoiceSystemLine {
    id: number;
    discount: number;
    commission: number;
    fromAmount: number;
    toAmount: number;
    systemName: string;
    invoiceId: number;
    invoice?: IInvoice;
}

export interface IInvoiceLine {
    isActive: boolean;
    systemName: string;
    accounts: {
        id: number;
        sum: number;
        name: string;
    }[];
    amount: number;
}

export type InvoiceStatus =
    | "created"
    | "void"
    | "cancelled"
    | "waiting"
    | "paid"
    | "completed"
    | "signed";

export type IPaymentWay = "prepay" | "postpay" | "postpay-expense";
export enum PaymentWay {
    PREPAY = "prepay",
    POSTPAY = "postpay",
    POSTPAY_EXPENSE = "postpay-expense",
}

export interface IInvoiceRates {
    id: number;
    invoiceId: number;
    invoice: IInvoice;
    rubRate?: string;
    usdRate?: string;
    eurRate?: string;
}

export interface IInvoiceState {
    invoices: IInvoice[];
    isLoading: boolean;
    totalInvoices: number;
}
export interface IInvoiceFilters {
    limit?: number;
    skip?: number;
    status?: string;
    query?: string;
    contract?: number;
    fromDate?: string;
    endDate?: string;
}
