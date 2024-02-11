
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


export interface IKnowledgePost {
    id: number;
    categoryID: number;
    title: string;
}

export interface IUpdatePostResponse {
    data: {
        toMain: boolean;
        post: IKnowledgePostFull
    }
    message: string[]
}

export interface IFetchPostsResponse {
    data: {
        posts: IKnowledgePost[];
        category: IKnowledgeCategory;
    }
}

export interface IFetchNavResponse {
    data: {
        id: number
        name: string
        sort: number
        posts: IKnowledgePost[];
    }[]
}

export interface IKnowledgePostPayload {
    title: string
    toMain: boolean
    categoryID: number
    sort: number
    body: string
    preview?: string
}
export interface IKnowledgePostUpdatePayload {
    title: string
    toMain: boolean
    categoryID: number
    sort: number
    body: string
    preview?: string
    id: number
}

export interface IKnowledgeMainResponse {
    data: Omit<IKnowledgePostFull, 'neighbours' | 'prev' | 'next'>[]
}

export interface IPostLink {
    title: string
    id: number
}
export interface IKnowledgePostFull {
    body: string
    categoryID: number
    createdAt: string
    id: number
    neighbours: IPostLink[]
    next: IPostLink | null
    prev: IPostLink | null
    preview?: string
    sort: number
    title: string
    toMain: boolean
    updatedAt: string
}

export interface IKnowledgeCard extends Omit<IKnowledgePostFull, 'toMain' | 'sort' | 'body' | 'prev' | 'next' | 'neighbours'> {
    category: {
        name: string
    }
}