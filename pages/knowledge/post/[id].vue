<template>
    <div class="page knowledge-page">
        <div class="page-paddings">
            <h1 class="page-title">База знаний</h1>
            <KnowledgeSearch />
        </div>

        <div class="row">
            <div class="col-md-9">
                <KnowledgePost :post="post" />
            </div>

            <div class="col-md-3">
                <KnowledgeNav :activeCategory="post?.categoryID" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KnowledgeSearch from "@/components/knowledge/Search.vue";
import KnowledgeNav from "@/components/knowledge/Nav.vue";
import KnowledgePost from "@/components/knowledge/Post.vue";
import { useKnowledgeStore } from "~/store/knowledge";
import { storeToRefs } from "pinia";

const route = useRoute();
const knowledgeStore = useKnowledgeStore();
const { post } = storeToRefs(knowledgeStore);

if (route.params.id) knowledgeStore.fetchPost(Number(route.params.id));

useHead({
    title: `${post.value?.title ?? ""} | База знаний Wunder Pay`,
});
</script>
