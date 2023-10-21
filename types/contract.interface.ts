import type {
    ICustomerSettings,
    ICustomerSystemSettings,
} from "~/types/region.interface";
import type { ICustomer } from "~/types/user.interface";

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
    NULL = "NULL",
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
    finances = "finances",
    closure = "closure",
    contracts = "contracts",
}

export interface IContractFilters {
    contractId?: string;
    endDate?: string;
    fromDate?: string;
    search?: string;
    limit?: string;
}

export interface GetCustomerContractsQuery {
    query?: string;
    skip?: string;
    limit?: string;
    fromDate?: string;
    endDate?: string;
    customerId: string;
    contractId?: string;
}
