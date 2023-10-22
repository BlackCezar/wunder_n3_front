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
import type { IUser } from "~/types/user.interface";
import { ICustomerRole } from "~/types/user.interface";
import { useRegionStore } from "~/store/regions";

export const useAuthStore = defineStore("auth-custom", {
    state: (): AuthStoreState => ({
        customerCandidate: null,
        contracts: [],
        user: null,
        busy: false,
        tokens: null,
    }),
    getters: {
        loggedIn: (state) => {
            return state.tokens?.expires && state.tokens?.expires > Date.now();
        },
        getSettings(state): null | IRegionSettings | ICustomerSettings {
            if (state.user?.role === ICustomerRole.CUSTOMER) {
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
            if (state.user?.role === ICustomerRole.CUSTOMER) {
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
        async completeSignUp(body: ICompleteSignUpPayload) {
            const { apiClient } = useClient();
            try {
                const result = await apiClient.post("/auth/complete", body);
                this.customerCandidate = result;
                return result ? result : null;
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
            }
        },
        async signUp(body: ISignUpPayload) {
            const { apiClient } = useClient();
            try {
                const result = await apiClient.post("/auth/signup", body);
                this.customerCandidate = result;
                return result ? result : null;
            } catch (e: any) {
                console.error(e);
                useNuxtApp().$toast.error(e.message);
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
                console.error(e);
                useNuxtApp().$toast.error(e.message);
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
