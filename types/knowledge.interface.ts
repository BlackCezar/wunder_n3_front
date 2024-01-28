
export interface IKnowledgeCategoriesResponse {
    data: IKnowledgeCategory[]
}


export type IKnowledgeUpdateCategoriesResponse = IKnowledgeCategory

export interface IKnowledgeCategory {
    id: number;
    sort: number;
    name: string;
}

export interface ICreatePostResponse {
    data: {
        toMain?: boolean;
        postID: number
    }
    message: string[]
}

export type IFetchMainResponse = IKnowledgePost[]

export interface IKnowledgePost {
    id: number;
    categoryID: number;
    title: string;
}

export interface IUpdatePostResponse {
    toMain: boolean;
    postID: number
}

export interface IFetchPostsResponse {
    posts: IKnowledgePost[];
    category: IKnowledgeCategory;
}