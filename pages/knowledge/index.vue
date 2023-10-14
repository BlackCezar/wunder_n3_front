<template>
    <div class="page knowledge-page">
        <div class="page-paddings">
            <h1 class="page-title">База знаний</h1>
            <KnowledgeSearch />
        </div>

        <div class="row">
            <div class="col-md-9">
                <div v-if="posts && posts.length">
                    <KnowledgePostMain
                        v-for="item in posts"
                        :key="item.id"
                        :post="item"
                    />
                </div>

                <div class="ui-block" v-else>
                    <b-alert show variant="secondary">Нет материалов</b-alert>
                </div>
            </div>

            <div class="col-md-3">
                <KnowledgeNav />
            </div>
        </div>
    </div>
</template>

<script>
import KnowledgeNav from "../../components/knowledge/Nav";
import KnowledgePostMain from "../../components/knowledge/PostMain";
import { useKnowledgeStore } from "@/store/knowledge";

export default {
    components: {
        KnowledgePostMain,
        KnowledgeNav,
    },
    setup() {
        const knowledgeStore = useKnowledgeStore();
        knowledgeStore.fetchMain();

        return {
            knowledgeStore,
        };
    },
    computed: {
        posts() {
            return this.knowledgeStore.posts;
        },
    },
    head() {
        return {
            title: "База знаний | Wunder Pay",
        };
    },

    async asyncData({ store }) {
        await store.dispatch("knowledge/fetchMain");
    },
};
</script>
