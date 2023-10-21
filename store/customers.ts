import { defineStore } from "pinia";
import type { ICustomer, ICustomerCandidate } from "~/types/user.interface";
import type { CustomerEditTabs, IFilters } from "~/types/common";

interface ICustomerState {
    list: ICustomer[];
    listTotal: number;
    candidates: ICustomerCandidate[];
    candidatesTotal: number;
    filters: IFilters;
    isLoading: boolean;
    forms: {
        customers: {
            tab: CustomerEditTabs;
            id: number | null;
            client: Partial<ICustomer> | null;
        };
    };
}

export const useCustomerStore = defineStore("customers", {
    state: (): ICustomerState => ({
        list: [],
        listTotal: 0,
        candidatesTotal: 0,
        isLoading: false,
        candidates: [],
        filters: {
            isLoading: false,
            limit: 10,
            page: 1,
            query: "",
        },
        forms: {
            customers: {
                tab: 0,
                id: null,
                client: null,
            },
        },
    }),
    getters: {
        activeCustomer: (state) => state.forms.customers.client,
        activeTab: (state) => state.forms.customers.tab,
        customerForm: (state) => state.forms.customers,
    },
    actions: {
        setActiveCustomer(data: ICustomerState["forms"]["customers"]) {
            this.forms.customers = data;
        },
        async loadCustomers() {
            try {
                const { apiClient } = useClient();

                this.filters.isLoading = true;
                const response = await apiClient.get("/customers", {
                    query: this.filters,
                });
                this.listTotal = response.count;
                this.list = response.array;
                this.filters.isLoading = false;
            } catch (e: any) {
                this.filters.isLoading = false;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async loadCandidates() {
            try {
                const { apiClient } = useClient();
                this.isLoading = true;
                const response = await apiClient.get("/customers/candidates", {
                    query: {
                        filters: {
                            limit: this.filters.limit,
                            skip: (this.filters.page - 1) * this.filters.limit,
                        },
                    },
                });
                this.candidatesTotal = response.count;
                this.candidates = response.array;
                this.isLoading = false;
            } catch (e: any) {
                this.isLoading = false;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async getCandidate(id: number) {
            try {
                const { apiClient } = useClient();
                return await apiClient.get(`/customers/candidates/${id}`);
            } catch (e: any) {
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async getCustomerContracts(id: number) {
            try {
                const { apiClient } = useClient();
                return await apiClient.get(`/customers/${id}/contracts`);
            } catch (e: any) {
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async deleteCustomer(id: number) {
            try {
                const { apiClient } = useClient();
                await apiClient.delete(`/customers/${id}`);
                this.list = this.list.filter((item) => item.id !== id);
                useNuxtApp().$toast.success("Данные успешно удалены");
            } catch (e: any) {
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async changePassword(id: number) {
            try {
                const { apiClient } = useClient();
                const result = await apiClient.put(
                    `/customers/change-password/${id}`,
                );
                console.log("CHANGE PASSWORD", result);
                useNuxtApp().$toast.success("Данные успешно обновлены");
            } catch (e: any) {
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async updateCustomer(data) {
            try {
                const { apiClient } = useClient();
                const result = await apiClient.put(
                    `/customers/${data.id}`,
                    data,
                );
                this.list = this.list.map((item) => {
                    if (item.id === data.id) {
                        return {
                            ...item,
                            ...result,
                        };
                    }
                    return item;
                });
                useNuxtApp().$toast.success("Данные успешно обновлены");
                return result;
            } catch (e: any) {
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
    },
});
