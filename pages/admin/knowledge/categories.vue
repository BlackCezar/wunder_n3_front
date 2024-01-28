<script setup lang="ts">
import KnowledgeCreateCategory from "@/components/knowledge/CreateCategory.vue";
import KnowledgeCategoryItem from "@/components/knowledge/CategoryItem.vue";
import {useKnowledgeStore} from "~/store/knowledge";
import { storeToRefs } from "pinia";

const knowledgeStore = useKnowledgeStore();
await useAsyncData('categories', () => knowledgeStore.getCategories())
const {categories} = storeToRefs(knowledgeStore)

useHead({
    title: "Управление категориями базы знаний | Wunder Digital",
})
</script>
<template>
  <div class="page knowledge-page">
    <div class="page-paddings">
      <h1 class="page-title">
        <span class="ui-color-gray">База знаний:</span> управление категориями
      </h1>
    </div>
    <div class="">
      <div class="">
        <KnowledgeCreateCategory />
        <div class="ui-block" v-if="categories && categories.length">
          <div class="ui-block-title">Редактирование категорий</div>
          <KnowledgeCategoryItem
            v-for="item in categories"
            :key="item.id"
            :category="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>