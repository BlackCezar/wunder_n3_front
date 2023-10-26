import { IContract } from "./contract.interface";
import { ICustomerSettings, IRegionSettings } from "./region.interface";
import { ICustomer, ICustomerCandidate, IUser } from "./user.interface";

export interface ILoginPayload {
    username: string;
    password: string;
}
export interface ISignUpPayload {
    companyName: string;
    companyTaxNumber: string;
    contactEmail: string;
    contactName: string;
    contactPhoneNumber: string;
    personalAgree: boolean;
    publicAgree: boolean;
    region: string;
}
export interface ICompleteSignUpPayload {
    companyEmail: string;
    companyAddress: string;
    postalAddress?: string;
    sameAddress?: boolean;
    responsiblePersonFullName: string;
    responsiblePersonPosition: string;
    signatureDocumentType: string;
    bankName: string;
    accountNumber: string;
    bankAddress: string;
    BIC: string;
    personalAgree: boolean;
    customerCandidateId: number;
}

export interface ISignUpResult {
    id: number;
    regionName: string;
    companyName: string;
    companyTaxNumber: string;
    contactEmail: string;
    contactName: string;
    contactPhoneNumber: string;
    publicAgree: boolean;
    customerId: null;
}

export type Tokens = {
    access_token: string;
    refresh_token: string;
    expires?: number;
};

export interface AuthStoreState {
    customerCandidate: null | ICustomerCandidate | ICustomer;
    contracts: IContract[];
    user: IUser | null;
    busy: boolean;
    tokens: null | Tokens;
}
