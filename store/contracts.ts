import { defineStore } from "pinia";
import type {
    GetCustomerContractsQuery,
    IContract,
    IContractFilters,
    IDocument,
} from "~/types/contract.interface";
import type { ISystemSettingsLine } from "~/types/region.interface";

interface IContractState {
    list: IContract[];
    customerList: IContract[];
    listTotal: number;
    isLoading: boolean;
    forms: {
        contract: Partial<IContract> | null;
        contractId: number | null;
    };
}

export const useContractStore = defineStore("contracts", {
    state: (): IContractState => ({
        list: [],
        listTotal: 0,
        customerList: [],
        isLoading: false,
        forms: {
            contract: null,
            contractId: null,
        },
    }),
    getters: {
        activeContract: (state) => state.forms.contract,
        contractId: (state) => state.forms.contractId,
    },
    actions: {
        deleteDocument(id: number) {
            if (this.forms.contract?.documents) {
                this.forms.contract.documents.filter((doc) => doc.id !== id);
            }
        },
        updateDocuments(list: IDocument[]) {
            if (this.forms.contract) {
                if (!this.forms.contract.documents)
                    this.forms.contract.documents = list;
                else this.forms.contract.documents.push(...list);
            }
        },
        setActiveContract(data: IContractState["forms"]["contract"]) {
            this.forms.contract = data;
        },
        setContractLines(system) {
            if (this.forms.contract) {
                this.forms.contract.systemSettings =
                    this.forms.contract.systemSettings?.map((s) => {
                        return s.id === system.id ? system : s;
                    });
            }
        },
        setCustomerList(list: IContract[]) {
            this.customerList = list;
        },
        async getDetails(id: string | number) {
            try {
                const { apiClient } = useClient();

                this.isLoading = true;
                const response = await apiClient.get("/contracts/" + id);
                this.isLoading = false;

                return response;
            } catch (e: any) {
                this.isLoading = false;
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async getCustomerContracts(
            id?: number,
            filters?: IContractFilters,
        ): Promise<{ array: IContract[]; count: number }> {
            try {
                this.isLoading = true;
                const { apiClient } = useClient();

                if (!id) {
                    this.isLoading = false;
                    return {
                        count: 0,
                        array: [],
                    };
                }
                const query: GetCustomerContractsQuery = {
                    customerId: id.toString(),
                    limit: filters?.limit ?? "10",
                };
                if (filters?.contractId) query.contractId = filters.contractId;
                if (filters?.endDate) query.endDate = filters.endDate;
                if (filters?.fromDate) query.fromDate = filters.fromDate;
                if (filters?.search) query.query = filters.search;

                const result = await apiClient.get<{
                    count: number;
                    array: IContract[];
                }>(`/contracts/customer`, {
                    query,
                });
                this.isLoading = false;
                this.listTotal = result.count;
                this.list = result.array;
                return result;
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
                this.isLoading = false;
                return {
                    count: 0,
                    array: [],
                };
            }
        },
        async delete(id: number) {
            try {
                const { apiClient } = useClient();
                await apiClient.delete(`/contracts/${id}`);
                this.list = this.list.filter((item) => item.id !== id);
                this.customerList = this.customerList.filter(
                    (item) => item.id !== id,
                );
                if (process.client)
                    useNuxtApp().$toast.success("Данные успешно удалены");
            } catch (e: any) {
                console.error(e);
                if (process.client) useNuxtApp().$toast.error(e.message);
            }
        },
        async update(data) {
            try {
                const { apiClient } = useClient();
                const result = await apiClient.put(
                    `/contracts/${data.id}`,
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
                if (process.client)
                    useNuxtApp().$toast.success("Данные успешно обновлены");
                return result;
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async create(data: any) {
            try {
                const { apiClient } = useClient();
                const result = await apiClient.post(`/contracts`, data);
                this.list.push(result);
                this.customerList.push(result);
                if (process.client)
                    useNuxtApp().$toast.success("Успешно добавлено");
                return result;
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async removeSystemCustomerLine(line: ISystemSettingsLine) {
            try {
                const { apiClient } = useClient();

                await apiClient.delete(`/contracts/customer-line/${line.id}`);
                if (this.forms.contract?.systemSettings) {
                    this.forms.contract.systemSettings.map((item) => {
                        return item.id === line.systemSettingsId
                            ? {
                                  ...item,
                                  lines: item.lines.filter(
                                      (l) => l.id !== line.id,
                                  ),
                              }
                            : item;
                    });
                }
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
        async removeSystemLine(id: number) {
            try {
                const { apiClient } = useClient();

                await apiClient.delete(`/contracts/line/${id}`);
            } catch (e: any) {
                if (process.client) useNuxtApp().$toast.error(e.message);
                console.error(e);
            }
        },
    },
});
