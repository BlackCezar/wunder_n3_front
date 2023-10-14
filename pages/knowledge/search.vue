<template>
    <div class="page knowledge-page">
        <div class="page-paddings">
            <h1 class="page-title">База знаний</h1>

            <div class="knowledge-search">
                <form @submit.prevent="searchHandler(query)">
                    <input
                        type="text"
                        class="ui-input knowledge-search-input"
                        placeholder="Введите поисковый запрос"
                        v-model.trim="query"
                    />
                    <button class="knowledge-search-btn"><icon /></button>
                </form>
            </div>
        </div>

        <div class="row">
            <div class="col-md-9">
                <div class="ui-block">
                    <div class="ui-block-title">Результаты поиска</div>

                    <div v-if="searchResults && searchResults.length">
                        <div class="search-results-title">
                            По вашему запросу
                            <span class="ui-color-red">”{{ query }}”</span>
                            найдено результатов:
                            <strong class="ui-color-black">{{
                                searchResults.length
                            }}</strong>
                        </div>

                        <div class="search-results">
                            <div class="row">
                                <KnowledgePostCard
                                    v-for="item in searchResults"
                                    :key="item.id"
                                    :postCard="item"
                                    :isCategory="true"
                                />
                            </div>
                        </div>
                    </div>

                    <div v-else>
                        <b-alert show variant="secondary"
                            >По вашему запросу ничего не найдено. Попробуйте
                            изменить критерии поиска</b-alert
                        >
                    </div>

                    <KnowledgeConsult />
                </div>
            </div>

            <div class="col-md-3">
                <KnowledgeNav />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import icon from "~/assets/img/search.svg";
import KnowledgeNav from "@/components/knowledge/Nav.vue";
import KnowledgePostCard from "@/components/knowledge/PostCard.vue";
import KnowledgeConsult from "@/components/knowledge/Consult.vue";
import { useKnowledgeStore } from "~/store/knowledge";
import { storeToRefs } from "pinia";

const knowledgeStore = useKnowledgeStore();
const { searchResults } = storeToRefs(knowledgeStore);
const query = ref("");
const router = useRouter();

const { data: key } = useAsyncData(() =>
    knowledgeStore.fetchSearch(query.value),
);

useHead({
    title: `Результаты поиска: ${key.value} | База знаний Wunder Pay`,
});

const searchHandler = async (query: string) => {
    await knowledgeStore.fetchSearch(query);
    router.push({
        query: { keyword: query },
    });
};
</script>

<style lang="css">
.search-results-title {
    font-size: 22px;
    margin-bottom: 45px;
    color: #868686;
}
.search-results-title span {
    font-weight: 500;
}
</style>
