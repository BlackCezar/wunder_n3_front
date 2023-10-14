<template>
  <div class="page knowledge-page">
    <div class="page-paddings">
      <h1 class="page-title">База знаний</h1>
      <KnowledgeSearch />
    </div>

    <div class="row">
      <div class="col-md-9">
        <div class="ui-block">
          <div class="ui-block-title">{{category?.name}}</div>

          <div class="posts-list">
            <div class="row" v-if="posts && posts.length">
              <KnowledgePostCard
                v-for="item in posts"
                :key="item.id"
                :postCard="item"
              />
            </div>

            <div v-else>
              <div class="row">
                <div class="col-md-6">
                  <b-alert show variant="secondary">В данной категории еще нет материалов</b-alert>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div><!--.col-->

      <div class="col-md-3">
        <KnowledgeNav :activeCategory="category?.id" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import KnowledgeSearch from "@/components/knowledge/Search.vue";
import KnowledgePostCard from "@/components/knowledge/PostCard.vue";
import KnowledgeNav from "@/components/knowledge/Nav.vue";
import { useKnowledgeStore } from "~/store/knowledge";
import {storeToRefs} from 'pinia'

const knowledgeStore = useKnowledgeStore()
const route = useRoute()
const {posts, category} = storeToRefs(knowledgeStore)

if (route.params.categoryID) knowledgeStore.fetchPosts(Number(route.params.categoryID))

useHead({
  title: `${category.value?.name ?? ''} | База знаний Wunder Pay`
})
</script>