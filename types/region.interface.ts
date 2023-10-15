import { ICustomer } from "~/types/user.interface";
import { IContract } from "~/types/contract.interface";

export interface IRegion {
    id: number;
    name: string;
    currency: string;
    sign?: string;
    isActive: boolean;
}

export interface IRegionSettings extends ISettings {
    emailFrom: string;
    planFixManagerId: string;
    financialManagerId: string;
    telegramLink?: string;
    whatappText?: string;
    whatappPhone?: string;
    telPhone?: string;
    regionId: number;
    region?: Pick<IRegion, "id" | "name" | "sign" | "currency">;
    paymentWaitingHours: number;
    balanceUpdateDelay: number;
    publicContract: string;
    personalAgree: string;
}

export interface ICustomerSettings extends ISettings {
    contractId: number;
    contract?: IContract;
    customerId: number;
    customer?: ICustomer;
}

export interface ICustomerSystemSettings extends ISystemSettings {
    customerId?: number;
    customer?: ICustomer;
    contractId?: number;
    contract?: IContract;
}

export interface IRegionEdit extends IRegion {
    settings: Omit<IRegionSettings, "regionId" | "contractId" | "id">[];
    systemSettings: IRegionSystemSettings[];
}

export interface ISettings {
    id: number;
    ratesAdds: number;
    freeHours: number;
    freeTimes: number;
    contractId: number;
    hourCost: number;
    vat: number;
    payType: PayType;
    allowTransfer: boolean;
    projectId: number;
    isEDNActive: boolean;
}

export enum PayType {
    PREPAY = "PREPAY",
    POSTPAY = "POSTPAY",
    EXPENSES = "EXPENSES",
}

export interface ICustomerSystemSettings extends ISystemSettings {
    customerId?: number;
    customer?: ICustomer;
    contractId?: number;
    contract?: IContract;
}

export interface ISystemSettings {
    id: number;
    lines: ISystemSettingsLine[];
    systemName: SystemName;
    minSum: number;
    system?: ISystem;
    isActive: boolean;
}
export interface IRegionSystemSettings extends ISystemSettings {
    regionId: number;
    currency: string;
    region?: IRegion;
}

export interface ISystemSettingsLine {
    id: number;
    discount: number;
    systemSettingsId: number;
    systemSettings?: IRegionSystemSettings;
    commission: number;
    fromAmount: number;
    toAmount: number;
    systemName: string;
}

export interface ISystem {
    id: number;
    name: string;
}

export enum SystemName {
    YandexDirect = "Яндекс Директ",
    YandexNavigator = "Яндекс Навигатор",
    YandexView = "Яндекс Взгляд",
    GoogleAds = "Google Ads",
    TikTok = "TikTok",
    Twitter = "Twitter",
    Facebook = "Facebook",
    MyTarget = "MyTarget",
    DV360 = "DV360",
    VK = "VK",
    OK = "OK",
    LinkedIn = "LinkedIn",
    Telegram = "Telegram",
    AppleSearch = "Apple Search",
}
