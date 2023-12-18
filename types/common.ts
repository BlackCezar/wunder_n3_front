export type INavLink = {
    to: string;
    icon: any;
    linkText: string;
};

export type IFilters = {
    isLoading: boolean;
    page: number;
    limit: number;
    query: string;
};

export const enum CustomerEditTabs {
    MainData = 0,
    CompanyData = 1,
    ResponsiblePersonData = 2,
    BankData = 3,
    AccountData = 4,
    Info = 5,
    Contracts,
    Invoices,
}


export type IDiscountItem = {
    amount: number;
    period: 'week' | 'month' | 'year';
    discount: number;
}