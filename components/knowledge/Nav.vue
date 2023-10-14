<template>
    <div class="ui-block knowledge-nav" v-if="nav && nav.length">
        <div class="ui-block-title --dashed">Рубрикатор</div>

        <ul class="knowledge-nav-nav">
            <li
                v-for="(item, index) in nav"
                :key="item.id"
                :class="{
                    active:
                        item.id === activeCategory ||
                        (activeCategory === 0 && index === 0),
                }"
                class="knowledge-nav-cat"
            >
                <nuxt-link
                    class="knowledge-nav-cat-link"
                    :to="'/knowledge/category/' + item.id"
                >
                    {{ item.name }}
                    <b-icon
                        class="knowledge-nav-cat-icon"
                        icon="chevron-down"
                        style="color: #000"
                    />
                </nuxt-link>

                <ul
                    v-if="
                        (item.posts.length && item.id === activeCategory) ||
                        (activeCategory === 0 && index === 0)
                    "
                    class="knowledge-nav-posts"
                >
                    <li
                        v-for="post in item.posts"
                        :key="post.id"
                        class="knowledge-nav-post"
                    >
                        <nuxt-link
                            class="knowledge-nav-post-link"
                            :to="'/knowledge/post/' + post.id"
                            >{{ post.title }}</nuxt-link
                        >
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import { useKnowledgeStore } from "@/store/knowledge";

export default {
    name: "KnowledgeNav",
    props: {
        activeCategory: {
            type: Number,
            default: 0,
        },
    },
    setup() {
        const knowledgeStore = useKnowledgeStore();
        return {
            knowledgeStore,
        };
    },
    async fetch() {
        await this.$store.dispatch("knowledge/fetchNav");
    },

    computed: {
        nav() {
            return this.knowledgeStore.nav;
        },
    },
};
</script>

<style lang="css" scoped>
.knowledge-nav ul {
    margin: 0;
    padding: 0;
}

.knowledge-nav ul,
.knowledge-nav li {
    list-style: none;
}

.knowledge-nav-cat {
    display: block;
    margin-bottom: 25px;
}
.knowledge-nav-cat-link {
    display: block;
    padding-right: 35px;
    position: relative;
    font-size: 22px;
    color: var(--primary);
    font-weight: 500;
    line-height: 1.18;
    text-decoration: none;
}
.knowledge-nav-cat-link:hover {
    color: var(--accent);
}
.knowledge-nav-cat-icon {
    position: absolute;
    right: 0;
    top: 4px;
    transition: transform 0.1s;
}
.knowledge-nav-cat.active .knowledge-nav-cat-icon {
    transform: rotate(180deg);
}

.knowledge-nav-posts {
    padding-top: 15px !important;
    padding-right: 15px;
    max-height: 160px;
    overflow-y: auto;
}
.knowledge-nav-posts::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #dee2e6;
}
.knowledge-nav-posts::-webkit-scrollbar-thumb {
    width: 6px;
    height: 6px;
    background-color: var(--accent);
}

.knowledge-nav-post {
    margin-bottom: 12px;
    display: block;
}
.knowledge-nav-post-link {
    color: #868686;
    font-size: 18px;
    line-height: 1.2;
    text-decoration: none;
    display: inline-block;
}
.knowledge-nav-post-link:hover {
    color: var(--accent);
}
.knowledge-nav-post-link.nuxt-link-active {
    font-weight: 500;
    position: relative;
    padding-left: 10px;
}
.knowledge-nav-post-link.nuxt-link-active:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.5em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--accent);
}
</style>
