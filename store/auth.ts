import { defineStore } from "pinia";
import type {
    AuthStoreState,
    ICompleteSignUpPayload,
    ILoginPayload,
    ISignUpPayload,
    Tokens,
} from "~/types/auth.interface";
import type { IContract } from "~/types/contract.interface";
import { ContractType } from "~/types/contract.interface";
import type {
    ICustomerSettings,
    ICustomerSystemSettings,
    IRegionSettings,
    IRegionSystemSettings,
    ISystemSettings,
} from "~/types/region.interface";
import { useNuxtApp, persistedState } from "#imports";
import type {
    ICustomerCandidate,
    ICustomerGroup,
    IUser,
    IUserCreatePayload,
} from "~/types/user.interface";
import { IUserRole } from "~/types/user.interface";
import { useRegionStore } from "~/store/regions";
import { FetchError } from "ofetch";

export const useAuthStore = defineStore("auth-custom", {
    state: (): AuthStoreState => ({
        customerCandidate: null,
        contracts: [],
        user: null,
        users: [],
        usersTotal: 0,
        busy: false,
        tokens: null,
    }),
    getters: {
        loggedIn: (state) => {
            return state.tokens?.expires && state.tokens?.expires > Date.now();
        },
        getSettings(state): null | IRegionSettings | ICustomerSettings {
            if (state.user?.role === IUserRole.CUSTOMER) {
                const contract = state.user.contracts.find(
                    (contract) => contract.isActive,
                );

                if (!contract) return null;
                return contract.settings;
            }
            return null;
        },
        contractType(state): ContractType | null {
            const contract = state.user?.contracts?.find(
                (item) => item.isActive,
            );
            if (!contract) return null;
            return contract.contractType;
        },
        getActiveContract(state): IContract | null {
            if (this.contracts?.length) {
                return (
                    state.contracts.find((contract) => contract.isActive) ??
                    null
                );
            } else {
                const user = useAuthStore().user;
                if (!user) return null;
                return (
                    user.contracts.find(
                        (contract: IContract) => contract.isActive,
                    ) ?? null
                );
            }
        },
        getSystemSettings(state): ISystemSettings[] {
            if (state.user?.role === IUserRole.CUSTOMER) {
                const contract = state.user.contracts.find(
                    (contract) => contract.isActive,
                );
                if (!contract) return [];

                if (contract?.contractType === ContractType.STANDARD) {
                    const region = useRegionStore();
                    return region.globalSystemSettings;
                } else return contract.systemSettings;
            }
            return [];
        },
    },
    actions: {
        setBusy(val: boolean) {
            this.busy = val;
        },
        setTokens(tokens: Tokens) {
            const jwtUtils = useJWTUtils();
            this.tokens = tokens;
            const token = jwtUtils.decodeJWT(tokens.access_token);
            this.tokens.expires = token.exp * 1000;
        },
        setUser(user: IUser) {
            this.user = user;
        },
        async loadUsers(page: number) {
            const { apiClient } = useClient();
            const result = await apiClient.get<[number, IUser[]]>(
                "/auth/users",
                {
                    query: {
                        page,
                    },
                },
            );
            if (Array.isArray(result)) {
                this.usersTotal = result[0];
                this.users = result[1];
            }
        },
        async createUser(values: IUserCreatePayload) {
            const { apiClient } = useClient();
            try {
                const result = await apiClient.post(`/auth/users`, values);
                if (result) {
                    this.users.push(result);
                    this.usersTotal++;
                    return result;
                }
                return null;
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
        },
        async getProfile() {
            const { apiClient } = useClient();
            const user = await apiClient.get("/auth/me");
            this.user = user;
            return user;
        },
        async login(payload: ILoginPayload) {
            const { apiClient } = useClient();
            this.busy = true;

            const result = await apiClient.post("/auth/signin", payload);
            this.setTokens(result);
            await this.getProfile();
            this.busy = false;
        },
        async logout() {
            //@ts-ignore
            this.router.push("/login");
            this.tokens = null;
            this.user = null;
        },

        setContracts(list: IContract[]) {
            this.contracts = list;
        },
        setCustomerCandidate(data: any) {
            this.customerCandidate = data;
        },
        async getCustomerCandidate(id: string) {
            const { apiClient } = useClient();
            try {
                const result = await apiClient.get(
                    `/customers/candidates/${id}`,
                );
                if (result) {
                    this.customerCandidate = result;
                    return result;
                }
                return null;
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
        },
        async completeSignUp(body: ICompleteSignUpPayload) {
            const { apiClient } = useClient();
            try {
                const result = await apiClient.post("/auth/complete", body);
                this.customerCandidate = result;
                return result ? result : null;
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
        },
        async getCustomerGroupsList(): Promise<ICustomerGroup[]> {
            const { apiClient } = useClient();
            return apiClient.get<ICustomerGroup[]>("/customers/groups");
        },
        async getDepartments(groupId: number) {
            const { apiClient } = useClient();
            try {
                return apiClient.get<IUser | undefined>("/auth/users", {
                    query: {
                        groupId,
                    },
                });
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
        },
        async saveCustomer(data: IUser) {
            const { apiClient } = useClient();
            try {
                const result = await apiClient.put<IUser | undefined>(
                    "/auth/users",
                    data,
                );
                if (result) {
                    this.users = this.users.map((item) => {
                        return item.id === data.id ? data : item;
                    });
                    return result;
                }
                return null;
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
        },
        async signUp(body: ISignUpPayload) {
            const { apiClient } = useClient();
            try {
                const result = await apiClient.post<
                    ICustomerCandidate | undefined
                >("/auth/signup", body);
                if (result) {
                    this.customerCandidate = result;
                    return result;
                }
                return null;
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
        },
        async refreshTokens() {
            const result = await $fetch<Tokens>("/api/auth/refresh", {
                method: "POST",
                body: {
                    refresh_token: this.tokens?.refresh_token,
                },
            });
            this.setTokens(result);
        },
        async deleteUser(id: number) {
            try {
                this.busy = true;
                const { apiClient } = useClient();

                await apiClient.delete("/auth/users/" + id);
                this.users = this.users.filter((u) => u.id !== id);
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
            this.busy = false;
        },
        async signInAsUser(id: number) {
            const { apiClient } = useClient();
            try {
                const tokens: Tokens = await apiClient.post("/auth/as-user", {
                    id,
                });
                await this.setTokens(tokens);
                const user = await apiClient.get("/auth/me");
                this.user = user;
                // @ts-ignore
                this.router.push("/accounts");
                useNuxtApp().$toast.success("Вы успешно авторизовались");
            } catch (e: any) {
                if (e instanceof FetchError) {
                    console.dir(e.data);
                    useNuxtApp().$toast.error(e.data.message);
                } else {
                    console.error(e);
                    useNuxtApp().$toast.error(e.message);
                }
            }
        },
    },
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: "strict",
        }),
        paths: ["tokens"],
    },
});
