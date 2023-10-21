import { defineStore } from "pinia";
import type {
    CreateAccountPayload,
    IAccount,
    ITopUpAccount,
    TopUpAccountPayload,
} from "~/types/account.interface";
import type { IFilters } from "~/types/common";
import { useAuthStore } from "./auth";
import type { ICustomerUser, IUser } from "~/types/user.interface";
import { client } from "process";

interface IAccountState {
    accounts: IAccount[];
    filters: IFilters;
    form: {
        id: number | null;
        customerId: number | null;
        account: Partial<IAccount> | null;
        isActivate: boolean;
        isLoading: boolean;
    };
}

export const useAccountStore = defineStore("account", {
    state: (): IAccountState => ({
        accounts: [],
        form: {
            id: null,
            customerId: null,
            account: null,
            isActivate: false,
            isLoading: false,
        },
        filters: {
            query: "",
            page: 1,
            limit: 10,
            isLoading: false,
        },
    }),
    getters: {
        isLoading(state) {
            return state.filters.isLoading;
        },
    },
    actions: {
        setForm(data: Partial<IAccountState["form"]>) {
            this.form = {
                ...this.form,
                ...data,
            };
        },
        resetForm() {
            this.form = {
                id: null,
                customerId: null,
                account: null,
                isLoading: false,
            };
        },
        async create(payload: CreateAccountPayload) {
            try {
                const { apiClient } = useClient();
                const account: IAccount = await apiClient.post(
                    "/accounts",
                    payload,
                );
                this.accounts.push(account);
                useNuxtApp().$toast.success("Аккаунт успешно создан");

                return account;
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async getList() {
            try {
                const { apiClient } = useClient();
                this.filters.isLoading = true;
                this.accounts = await apiClient.get("/accounts");
                this.filters.isLoading = false;
            } catch (e: any) {
                console.error(e);
                this.filters.isLoading = false;
                useNuxtApp().$toast.error(e.message);
            }
        },
        async getCustomerAccounts(customerId?: number) {
            try {
                const { apiClient } = useClient();
                const authStore = useAuthStore();
                const user = authStore.user as ICustomerUser;

                this.accounts = await apiClient.get(`/accounts/customer`, {
                    query: {
                        customerId: customerId ? customerId : user.customer?.id,
                    },
                });
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async delete(id: number) {
            try {
                const { apiClient } = useClient();
                await apiClient.delete(`/accounts/delete/${id}`);
                this.accounts = this.accounts.filter(
                    (account) => account.id !== id,
                );
                useNuxtApp().$toast.success("Аккаунт успешно удален");
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async activate(id: number, account: Partial<IAccount>) {
            try {
                const { apiClient } = useClient();
                const payload = {
                    ...account,
                    login: account.login === null ? "" : account.login,
                    password: account.password === null ? "" : account.password,
                };
                const response = await apiClient.put(
                    `/accounts/activate/${id}`,
                    payload,
                );
                this.accounts = this.accounts.map((item) => {
                    if (item.id === id) {
                        return response;
                    }
                    return item;
                });
                useNuxtApp().$toast.success("Аккаунт успешно активирован");
                return response;
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async update(account: Partial<IAccount>) {
            try {
                const { apiClient } = useClient();
                const payload = {
                    ...account,
                    login: account.login === null ? "" : account.login,
                    password: account.password === null ? "" : account.password,
                };
                const response = await apiClient.put(
                    `/accounts/${account.id}`,
                    payload,
                );
                this.accounts = this.accounts.map((item) => {
                    if (item.id === account.id) {
                        return response;
                    }
                    return item;
                });
                if (this.form.account) this.form.account = response;
                useNuxtApp().$toast.success("Аккаунт успешно обновлен");
                return response;
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async runUpdateBalance(id: number) {
            try {
                const { apiClient } = useClient();
                const response = await apiClient.put(
                    `/accounts/${id}/update-balance`,
                );
                this.accounts = this.accounts.map((item) => {
                    if (item.id === id) {
                        return response;
                    }
                    return item;
                });
                useNuxtApp().$toast.success("Баланс успешно обновлен");
                return response;
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async topUpAccounts(data: TopUpAccountPayload): Promise<boolean> {
            try {
                const { apiClient } = useClient();
                await apiClient.post("/accounts/top-up", data);
                // useNuxtApp().$gtm.push({ event: 'topup-account' })
                return true;
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
                return false;
            }
        },
    },
});
