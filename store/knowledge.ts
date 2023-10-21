import { defineStore } from "pinia";
import type {
    ICreatePostResponse,
    IFetchMainResponse,
    IFetchPostsResponse,
    IKnowledgeCategoriesResponse,
    IKnowledgeCategory,
    IKnowledgePost,
    IKnowledgeUpdateCategoriesResponse,
    IUpdatePostResponse,
} from "~/types/knowledge.interface";

interface IKnowledgeStore {
    categories: IKnowledgeCategory[];
    nav: any[];
    posts: IKnowledgePost[];
    searchResults: any[];
    main: IFetchMainResponse;
    file: any | null;
    post: IKnowledgePost | null;
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
        async createPost(payload) {
            try {
                const { apiClient } = useClient();

                payload.preview = this.file;
                const data: ICreatePostResponse = await apiClient.post(
                    "/knowledge/create-post",
                    payload,
                );
                this.file = null;
                if (!data.toMain) {
                    this.router.push("/knowledge/post/" + data.postID);
                } else this.router.push("/knowledge");
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchMain() {
            try {
                const { apiClient } = useClient();

                this.main = await apiClient.get("/knowledge");
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
                        "/knowledge/update-categories",
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
        async updatePost(payload: any) {
            try {
                const { apiClient } = useClient();

                payload.preview = this.file;
                const data: IUpdatePostResponse = await apiClient.post(
                    "/knowledge/update-post",
                    payload,
                );
                this.file = null;

                if (!data.toMain) {
                    this.router.push("/knowledge/post/" + data.postID);
                } else this.router.push("/knowledge");
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchNav() {
            try {
                const { apiClient } = useClient();

                this.nav = await apiClient.get("/knowledge/get-nav");
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchPost(id: number) {
            try {
                const { apiClient } = useClient();

                this.post = await apiClient.get("/knowledge/get-post/" + id);
            } catch (err: any) {
                useNuxtApp().$toast.error(err.message);
                console.error(err);
            }
        },
        async fetchPosts(id: number) {
            try {
                const { apiClient } = useClient();

                const data: IFetchPostsResponse = await apiClient.get(
                    "/knowledge/get-posts/" + id,
                );
                this.posts = data.posts;
                this.category = data.category;
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
                this.router.push("/knowledge");
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
