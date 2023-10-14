<template>
    <div class="post-main ui-block">
        <div class="post-main-title ui-block-title">{{ post.title }}</div>

        <KnowledgePostManage :postID="post.id" style="margin-top: 0" />

        <div class="post-main-txt" v-html="post.body"></div>
    </div>
</template>

<script>
import KnowledgePostManage from "./PostManage";

export default {
    name: "KnowledgePostMain",
    components: {
        KnowledgePostManage,
    },

    props: {
        post: {
            required: true,
            type: Object,
        },
    },
};
</script>

<style lang="css" scoped>
.post-main-title a {
    text-decoration: none;
}
.post-main-title a:hover {
    color: var(--accent);
}

.post-main-cols {
    display: flex;
}

.post-main-right {
    padding-left: 60px;
    max-width: 50%;
    order: 1;
}

.post-main-img {
    display: block;
    border-radius: 3px;
}

.post-main-txt {
    padding-bottom: 30px;
    border-bottom: 1px solid var(--lightGray3);
}

.post-main .main-post-table tr:not(:last-child) td {
    padding-bottom: 30px;
}
</style>
