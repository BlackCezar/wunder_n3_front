import {IAccount} from "~/types/account.interface";
import {ICustomer} from "~/types/user.interface";
import {IContract} from "~/types/contract.interface";

export interface IInvoice {
    id: number;
    customerId: number;
    customer: ICustomer;
    invoiceURL: string;
    certificateURL: string;
    signedCertificateURL: string;
    invoiceNumber: string;
    createdAt: Date;
    readyForPayment: boolean;
    contractId: number;
    contract: IContract;
    isPaid: boolean;
    isActive: boolean;
    paymentWay: IPaymentWay;
    invoiceRates: IInvoiceRates[];
    invoiceLines: IInvoiceLine[];
    invoiceSystemLines: IInvoiceSystemLine[];
    status: InvoiceStatus;
    total: number;
    sum: number;
    hasOriginal: boolean;
    isVisibly: boolean;
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
    id: number;
    invoiceId: number;
    invoice?: IInvoice;
    sum: number;
    expense: number;
    transferred: number;
    accountId: number;
    account?: IAccount;
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
    POSTPAY_EXPENSE = "postpay-expense"
}

export interface IInvoiceRates {
    id: number;
    invoiceId: number;
    invoice: IInvoice;
    rubRate?: string;
    usdRate?: string;
    eurRate?: string;
}
