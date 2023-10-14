<template>
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
</template>

<script>
import { useKnowledgeStore } from "@/store/knowledge";
import { mapActions } from "pinia";
import icon from "~/assets/img/search.svg";

export default {
    name: "KnowledgeSearch",
    components: {
        icon,
    },

    data() {
        return {
            query: "",
        };
    },

    methods: {
        ...mapActions(useKnowledgeStore, {
            search: "fetchSearch",
        }),

        searchHandler(query) {
            this.$router.push("/knowledge/search/?keyword=" + query);
        },
    },
};
</script>

<style lang="css">
.knowledge-search {
    width: 700px;
    position: relative;
    max-width: 100%;
    margin-bottom: 50px;
}
.knowledge-search-input {
    display: block;
    width: 100%;
    padding: 0px 45px 0px 15px;
}
.knowledge-search-btn {
    position: absolute;
    right: 15px;
    top: 50%;
    margin: -8px 0 0 0;
    width: 16px;
    height: 16px;
    border: 0;
    padding: 0;
    background: transparent;
    outline: none;
}
.knowledge-search-btn svg {
    display: block;
    width: 100%;
}
</style>
