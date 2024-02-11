import { defineStore } from "pinia";
import type {
    ICreatePostResponse,
    IFetchNavResponse,
    IFetchPostsResponse,
    IKnowledgeCategoriesResponse,
    IKnowledgeCategory,
    IKnowledgePost,
    IKnowledgeUpdateCategoriesResponse,
    IUpdatePostResponse
} from "~/types/knowledge.interface";
import {
    IKnowledgeMainResponse,
    IKnowledgePostFull,
    IKnowledgePostPayload,
    IKnowledgePostUpdatePayload
} from "~/types/knowledge.interface";

interface IKnowledgeStore {
    categories: IKnowledgeCategory[];
    nav: any[];
    posts: IKnowledgePostFull[];
    searchResults: any[];
    main: Omit<IKnowledgePostFull, 'neighbours' | 'prev' | 'next'>[];
    file: any | null;
    post: IKnowledgePostFull | null;
    category: IKnowledgeCategory | null;
}

export const useKnowledgeStore = defineStore("knowledge", {
    state: (): IKnowledgeStore => ({
        categories: [],
        file: null,
        nav: [],
        post: null,
        category: null,
        posts: [],
        searchResults: [],
        main: [],
    }),
    actions: {
        clearFile() {
            this.file = null;
        },
        pushCategory(val: any) {
            this.categories.push(val);
            this.categories.sort((a, b) => {
                if (a.sort < b.sort) {
                    return -1;
                }
                if (a.sort > b.sort) {
                    return 1;
                }
                return 0;
            });
        },
        async createCategory(payload: any) {
            try {
                const { apiClient } = useClient();

                if (payload.sort === "" || typeof payload.sort !== "number") {
                    delete payload.sort;
                }

                const data = await apiClient.post(
                    "/knowledge/create-category",
                    payload,
                );
                this.pushCategory(data);
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },

        async getCategories() {
            try {
                const { apiClient } = useClient();

                const data = (await apiClient.get(
                    "/knowledge/get-categories",
                )) as IKnowledgeCategoriesResponse;
                this.categories = data.data;
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async deleteCategory(id: number) {
            try {
                const { apiClient } = useClient();
                await apiClient.delete("/knowledge/delete-categories/" + id);
                this.categories = this.categories.filter(
                    (item) => item.id !== id,
                );
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async uploadFile(payload: any) {
            try {
                const { apiClient } = useClient();

                this.file = await apiClient.post(
                    "/knowledge/upload-file",
                    payload,
                );
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async createPost(payload: IKnowledgePostPayload) {
            try {
                const { apiClient } = useClient();

                if (this.file?.file) payload.preview = this.file?.file;
                const response: ICreatePostResponse = await apiClient.post(
                    "/knowledge/create-post",
                    payload,
                )
                this.file = null;
                if (response?.message?.length) useNuxtApp().$toast.success(response.message[0])
                await useNuxtApp().$router.push(response.data.toMain ? `/knowledge` : `/knowledge/post/${response.data.postID}`)

            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchMain() {
            try {
                const { apiClient } = useClient();

                const response = await apiClient.get<IKnowledgeMainResponse>("/knowledge");
                if (response.data.length) this.main = response.data
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async updateCategory(payload: any) {
            try {
                const { apiClient } = useClient();

                const data: IKnowledgeUpdateCategoriesResponse =
                    await apiClient.post(
                        "/knowledge/update-category",
                        payload,
                    );

                this.categories = this.categories.map((item) => {
                    return item.id === data.id ? data : item;
                });

                this.categories.sort((a, b) => {
                    if (a.sort < b.sort) {
                        return -1;
                    }
                    if (a.sort > b.sort) {
                        return 1;
                    }
                    return 0;
                });
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async updatePost(payload: IKnowledgePostUpdatePayload) {
            try {
                const { apiClient } = useClient();

                if (this.file?.file) payload.preview = this.file?.file;
                const response: IUpdatePostResponse = await apiClient.put(
                    "/knowledge/update-post",
                    payload,
                );
                this.posts = this.posts.map(item => item.id == payload.id ? response.data.post : item)
                this.file = null;

                await useNuxtApp().$router.push(`/knowledge/post/${response.data.post.id}`);
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchNav() {
            try {
                const { apiClient } = useClient();

                const response = await apiClient.get<IFetchNavResponse>("/knowledge/get-nav")
                if (response?.data) this.nav = response.data
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchPost(id: number) {
            try {
                const { apiClient } = useClient();

                const response = await apiClient.get<{
                    data: IKnowledgePostFull | undefined
                }>("/knowledge/get-post/" + id);
                if (response.data) this.post = response.data
                return response.data
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchPosts(id: number) {
            try {
                const { apiClient } = useClient();

                const response: IFetchPostsResponse = await apiClient.get(
                    "/knowledge/get-posts/" + id,
                );
                if (response.data) {
                    this.posts = response.data.posts;
                    this.category = response.data.category;
                }
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async deletePost(id: number) {
            try {
                const { apiClient } = useClient();

                await apiClient.delete("/knowledge/delete-posts/" + id);
                this.posts = this.posts.filter((item) => item.id !== id);
                await useNuxtApp().$router.push('/knowledge')
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchSearch(keyword: string) {
            try {
                const { apiClient } = useClient();

                this.searchResults = await apiClient.post(
                    "/knowledge/search/?keyword=" + encodeURIComponent(keyword),
                );
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
    },
});
