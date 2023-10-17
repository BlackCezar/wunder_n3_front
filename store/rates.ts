import { defineStore } from "pinia";
import { IRatesResponse } from "~/types/rates.interface";
import { useNuxtApp } from "#imports";

interface IRatesState {
    isLoading: boolean;
    list: any[];
    totalItems: number;
    filters: {
        page: number;
        limit: number;
    };
    rates: {
        sellUSD: number;
        sellEUR: number;
        sellRUB: number;
    };
}

export const useRatesStore = defineStore("rates", {
    state: (): IRatesState => ({
        isLoading: false,
        list: [],
        totalItems: 0,
        filters: {
            page: 1,
            limit: 10,
        },
        rates: {
            sellEUR: 0,
            sellRUB: 0,
            sellUSD: 0,
        },
    }),
    actions: {
        async getList() {
            try {
                const { apiClient } = useClient()
                const { count, array } = await apiClient.get("/rates/list", {
                    query: {
                        filters: JSON.stringify({
                            limit: this.filters.limit,
                            skip: (this.filters.page - 1) * this.filters.limit,
                        }),
                    },
                });
                this.totalItems = count;
                this.list = array;
            } catch (e: any) {
                if (process.server) return;
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async loadRates() {
            try {
                const { apiClient } = useClient()

                this.rates = (await apiClient.get("/rates")) as IRatesResponse;
            } catch (e: any) {
                if (process.server) return;
                useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
    },
});
