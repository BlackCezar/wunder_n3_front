<template>
    <div class="page knowledge-page">
        <div class="page-paddings">
            <h1 class="page-title">База знаний</h1>
            <KnowledgeSearch />
        </div>

        <div class="row">
            <div class="col-md-9">
                <div v-if="main && main.length">
                    <KnowledgePostMain
                        v-for="item in main"
                        :key="item.id"
                        :post="item"
                    />
                </div>

                <div class="ui-block" v-else>
                    <b-alert :model-value="true" variant="secondary">Нет материалов</b-alert>
                </div>
            </div>

            <div class="col-md-3">
                <KnowledgeNav />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import KnowledgeNav from "../../components/knowledge/Nav.vue";
import KnowledgePostMain from "../../components/knowledge/PostMain.vue";
import { useKnowledgeStore } from "@/store/knowledge";
import { storeToRefs } from "pinia";

const knowledgeStore = useKnowledgeStore();
const {main} = storeToRefs(knowledgeStore)
useAsyncData(() => knowledgeStore.fetchMain())


useHead({
    title: 'База знаний | Wunder Pay'
})

</script>
