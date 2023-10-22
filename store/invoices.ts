import { defineStore } from "pinia";
import type {
    IInvoice,
    IInvoiceFilters,
    IInvoiceState,
} from "~/types/invoice.interface";
import { useAuthStore } from "~/store/auth";
import { ICustomerRole } from "~/types/user.interface";

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
                let customerId = null;
                if (authStore.user?.role === ICustomerRole.CUSTOMER)
                    customerId = authStore.user.customer.id;

                const query = {
                    customerId: customerId,
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
        async getInvoices(customerId: number) {
            try {
                this.isLoading = true;
                const { apiClient } = useClient();

                const result = await apiClient.get("/invoices", {
                    query: {
                        customerId,
                        filters: JSON.stringify({
                            query: "",
                            skip: 0,
                        }),
                    },
                });
                this.isLoading = false;
                return result[1];
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
                this.isLoading = false;
            }
        },
        async removeInvoice(id: number) {
            try {
                const { apiClient } = useClient();

                await apiClient.delete("/invoices/" + id);
                this.invoices = this.invoices.filter(
                    (invoice) => invoice.id !== id,
                );
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async saveInvoice(invoice: IInvoice) {
            try {
                const { apiClient } = useClient();
                return await apiClient.put("/invoices/" + invoice.id, invoice);
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
    },
});
