
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
    toMain: boolean;
    postID: number
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