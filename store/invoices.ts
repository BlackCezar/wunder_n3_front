import { defineStore } from "pinia";
import type { IInvoiceFilters, IInvoiceState } from "~/types/invoice.interface";
import { useAuthStore } from "~/store/auth";
import type { IFilters } from "~/types/common";

export const useInvoiceStore = defineStore("invoices", {
    state: (): IInvoiceState => ({
        invoices: [],
        isLoading: false,
        totalInvoices: 0,
    }),
    getters: {
        bills: (state) => state.invoices,
    },
    actions: {
        async getCustomerInvoices(filters: IInvoiceFilters) {
            try {
                this.isLoading = true;
                const { apiClient } = useClient();
                const authStore = useAuthStore();

                const query = {
                    customerId: authStore.user?.customer.id,
                    filters: JSON.stringify(filters),
                };
                const result = await apiClient.get("/invoices", {
                    query,
                });
                this.totalInvoices = result[0];
                this.invoices = result[1];
                this.isLoading = false;
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
                this.isLoading = false;
            }
        },
    },
});
