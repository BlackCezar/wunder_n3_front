import {
    ICustomerSettings,
    ICustomerSystemSettings,
} from "~/types/region.interface";
import { ICustomer } from "~/types/user.interface";

export interface IContract {
    id: number;
    customerId: number;
    contractNumber?: string;
    contractService?: string;
    contractType: ContractType;
    isActive: boolean;
    customer?: ICustomer;
    settingsId: number;
    settings: ICustomerSettings;
    documents?: IDocument[];
    systemSettings: ICustomerSystemSettings[];
    expireDate?: Date | string;
    startDate: Date | string;
}

export enum ContractType {
    STANDARD = "STANDARD",
    CUSTOM = "CUSTOM",
    NULL = 'NULL'
}

export interface IDocument {
    id: number;
    contractId: number;
    name?: string;
    comment?: string;
    link: string;
    contract?: IContract;
}

export enum DocumentsTabs {
    finances = 'finances',
    closure = 'closure',
    contracts = 'contracts'
}
