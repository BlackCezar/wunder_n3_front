<template>
    <div class="col-lg-3 col-md-4 col-xs-6">
        <div class="post-card">
            <div class="post-card-img">
                <nuxt-link
                    :to="'/knowledge/post/' + postCard.id"
                    class="post-card-img-link"
                >
                    <img
                        :src="generateUrl(postCard.preview)"
                        :alt="postCard.title"
                        loading="lazy"
                        onerror="this.src = '/imgs/no-post.jpeg'"
                    />
                </nuxt-link>
            </div>

            <div class="post-card-category" v-if="isCategory">
                <i-bi-arrow-up-right-square
                    class="post-card-category-icon"
                    style="color: #495057"
                />
                <nuxt-link :to="'/knowledge/category/' + postCard.categoryID">{{
                    postCard.category.name
                }}</nuxt-link>
            </div>

            <div class="post-card-title">
                <nuxt-link :to="'/knowledge/post/' + postCard.id">{{
                    postCard.title
                }}</nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { IKnowledgeCard, IKnowledgePost } from "~/types/knowledge.interface";

defineProps<{
    postCard: IKnowledgeCard
    isCategory?: boolean
}>()
const app = useAppConfig()
console.log('app', app)
function generateUrl(url?: string | undefined) {
    if (!url) {
        return "/imgs/no-post.jpeg";
    }
    console.log()
    return `${app.publicAssetsUrl}${url}`;
}
</script>

<style lang="css" scoped>
.post-card {
    margin-bottom: 30px;
}
.post-card-img {
    margin-bottom: 15px;
}
.post-card-img-link {
    display: block;
    position: relative;
    padding-bottom: 61%;
    overflow: hidden;
    background: #f7f7f7;
}
.post-card-img-link img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    object-fit: contain;
    object-position: center;
    transition: transform 0.3s;
}
.post-card-img-link:hover img {
    transform: translate(-50%, -50%) scale(1.05);
}
.post-card-category {
    position: relative;
    padding-left: 16px;
    margin-bottom: 5px;
}
.post-card-category a {
    color: var(--darkGray);
    text-decoration: none;
}
.post-card-category a:hover {
    color: var(--primary);
}
.post-card-category-icon {
    position: absolute;
    left: 0;
    top: 3px;
    max-width: 12px;
    display: block;
}
.post-card-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.25;
}
.post-card-title a {
    color: var(--primary);
    text-decoration: none;
}
.post-card-title a:hover {
    color: var(--accent);
}
</style>
