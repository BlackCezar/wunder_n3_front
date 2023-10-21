import type { $Fetch, FetchRequest, FetchOptions } from "ofetch";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import type { Tokens } from "~/types/auth.interface";
export const useClient = () => {
    const authStore = useAuthStore();
    const { tokens } = storeToRefs(authStore);

    const apiClient = $fetch.create({
        baseURL: "/api",
        headers: {
            Accept: "application/json",
        },
        onRequest: (context) => {
            if (tokens.value?.access_token) {
                //@ts-ignore
                context.options.headers[
                    "Authorization"
                ] = `Bearer ${tokens.value.access_token}`;
            }
        },
        onResponseError: async (context) => {
            if (context.response.status === 401 && tokens.value) {
                const result = await $fetch<Tokens>("/api/auth/refresh", {
                    method: "POST",
                    body: {
                        refresh_token: tokens.value.refresh_token,
                    },
                });
                authStore.setTokens(result);
            }
        },
        retry: 2,
        retryStatusCodes: [401, 403],
    }) as unknown as IAPIClient;

    apiClient.post = async (url, body) => {
        return apiClient(url, {
            body,
            method: "POST",
        });
    };
    apiClient.put = async (url, body) => {
        return apiClient(url, {
            body,
            method: "PUT",
        });
    };

    apiClient.get = async (request, options) => {
        const response = await apiClient(request, {
            ...options,
            retry: 1,
            method: "get",
            retryStatusCodes: [401],
        });
        return response;
    };
    apiClient.delete = async (request, options) => {
        const response = await apiClient(request, {
            method: "delete",
            ...options,
        });
        return response;
    };

    return {
        apiClient,
    };
};
interface IAPIClient extends $Fetch {
    post: <T = any>(url: string, body?: JSON | FormData | any) => Promise<T>;
    put: <T = any>(url: string, body?: JSON | FormData | any) => Promise<T>;
    get: <T = any>(
        request: FetchRequest,
        options?: FetchOptions<"json">,
    ) => Promise<T>;
    delete: <T = any>(
        request: FetchRequest,
        options?: FetchOptions<"json">,
    ) => Promise<T>;
}
