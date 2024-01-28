<template>
    <div class="ui-block post">
        <article>
            <header class="post-header">
                <h1 class="post-title">{{ post.title }}</h1>
                <div class="post-date">
                    Опубликовано: {{ dateFormat(post.createdAt) }}
                </div>
            </header>
            <div class="post-inner">
                <KnowledgePostManage :postID="post.id" />

                <div class="post-body" v-html="post.body"></div>

                <KnowledgePostNeighbours :neighbours="post.neighbours" />

                <div class="post-btns">
                    <nuxt-link
                        :to="'/knowledge/category/' + post.categoryID"
                        class="ui-btn ui-btn-red"
                        ><b-icon
                            icon="chevron-left"
                            style="color: #fff; margin-right: 5px"
                        />Назад в категорию</nuxt-link
                    >

                    <div class="post-btns-nav">
                        <nuxt-link
                            v-if="post.prev"
                            :to="'/knowledge/post/' + post.prev.id"
                            class="ui-btn ui-btn-bordered"
                            >Предыдущая статья</nuxt-link
                        >

                        <nuxt-link
                            v-if="post.next"
                            :to="'/knowledge/post/' + post.next.id"
                            class="ui-btn ui-btn-bordered"
                            >Следующая статья</nuxt-link
                        >
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import KnowledgePostManage from "./PostManage";
import KnowledgePostNeighbours from "./PostNeighbours";

export default {
    name: "KnowledgePost",
    components: { KnowledgePostNeighbours, KnowledgePostManage },
    props: {
        post: {
            required: true,
            type: Object,
        },
    },

    methods: {
        dateFormat(dateString) {
            let loc = "ru-RU";
            const d = new Date(dateString);
            d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
            const date = new Intl.DateTimeFormat(loc, {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(d);
            return date;
        },
    },
};
</script>

<style lang="css">
.post-header {
    position: relative;
    padding-right: 270px;
    margin-bottom: 50px;
}
@media screen and (max-width: 992px) {
    .post-header {
        padding-right: 0;
    }
}

.post-date {
    position: absolute;
    right: 0;
    top: 13px;
    font-size: 16px;
    color: #868686;
}
@media screen and (max-width: 992px) {
    .post-date {
        position: static;
    }
}

.post-title {
    font-size: 32px;
    margin-top: 0;
    margin-bottom: 20px;
}
@media screen and (max-width: 992px) {
    .post-title {
        margin-bottom: 10px;
    }
}

.post-inner {
    width: 80%;
    max-width: 920px;
    margin: 0 auto;
}
@media (max-width: 599px) {
    .post-inner {
        width: 100%;
    }
}

.post-body {
    padding-bottom: 80px;
    margin-bottom: 50px;
    border-bottom: 1px solid var(--lightGray3);
}

.post-btns {
    display: flex;
    justify-content: space-between;
}
@media screen and (max-width: 992px) {
    .post-btns {
        flex-direction: column;
    }
}
@media screen and (max-width: 992px) {
    .post-btns .ui-btn-red {
        display: flex;
        justify-content: center;
    }
}
.post-btns-nav {
    padding-left: 25px;
}
@media screen and (max-width: 992px) {
    .post-btns-nav {
        padding-left: 0;
    }
}
.post-btns-nav .ui-btn {
    margin-left: 5px;
}
@media screen and (max-width: 992px) {
    .post-btns-nav .ui-btn {
        padding-left: 0;
        width: 100%;
        text-align: center;
        margin-top: 10px;
    }
}
</style>
