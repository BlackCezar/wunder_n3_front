import { defineStore } from "pinia";
import {
    AuthStoreState,
    ICompleteSignUpPayload,
    ILoginPayload,
    ISignUpPayload,
    Tokens,
} from "~/types/auth.interface";
import { IContract } from "~/types/contract.interface";
import { ICustomerSettings, IRegionSettings } from "~/types/region.interface";

export const useAuthStore = defineStore("auth-custom", {
    state: (): AuthStoreState => ({
        customerCandidate: null,
        contracts: [],
        settings: null,
        user: null,
        busy: false,
        tokens: null,
    }),
    getters: {
        loggedIn: (state) => {
            return state.tokens?.expires && state.tokens?.expires > Date.now();
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
        getSettings(state) {
            return state.settings;
        },
    },
    actions: {
        setTokens(tokens: Tokens) {
            const jwtUtils = useJWTUtils();
            this.tokens = tokens;
            const token = jwtUtils.decodeJWT(tokens.access_token);
            this.tokens.expires = token.exp * 1000;
        },
        async getProfile() {
            const { apiClient } = useClient();
            const user = await apiClient.get("/auth/me");
            this.user = user;
            return user;
        },
        async login(payload: ILoginPayload) {
            const { apiClient } = useClient();

            const result = await apiClient.post("/auth/signin", payload);
            this.setTokens(result);
            this.getProfile();
        },
        async logout() {
            //@ts-ignore
            this.router.push("/login");
            this.tokens = null;
            this.user = null;
        },
        setSettings(data: IRegionSettings | ICustomerSettings | null) {
            this.settings = data;
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
    persist: true,
});
