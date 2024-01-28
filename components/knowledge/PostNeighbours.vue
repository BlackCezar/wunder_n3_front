<template>
    <div class="post-neighbours" v-if="neighbours && neighbours.length">
        <div class="post-neighbours-label">Статьи по теме:</div>
        <div class="post-neighbours-links">
            <nuxt-link
                v-for="item in neighbours"
                :key="item.id"
                :to="'/knowledge/post/' + item.id"
                class="post-neighbours-link"
                >{{ item.title }}</nuxt-link
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "KnowledgePostNeighbours",
    props: {
        neighbours: {
            required: true,
            type: Array,
        },
    },
};
</script>

<style lang="css" scoped>
.post-neighbours {
    padding-bottom: 30px;
    margin-bottom: 50px;
    border-bottom: 1px solid var(--lightGray3);
    position: relative;
    padding-left: 150px;
    font-size: 18px;
}
@media screen and (max-width: 992px) {
    .post-neighbours {
        display: flex;
        flex-direction: column;
        padding-left: 0;
    }
}
.post-neighbours-label {
    position: absolute;
    font-weight: 500;
    top: 0;
    left: 0;
    max-width: 140px;
}
@media screen and (max-width: 992px) {
    .post-neighbours-label {
        display: block;
        position: static;
        margin-bottom: 20px;
    }
}
.post-neighbours-link {
    display: inline-block;
    vertical-align: top;
    margin-right: 25px;
    margin-bottom: 20px;
    color: #135898;
    text-decoration: underline;
}
.post-neighbours-link:last-child {
    margin-right: 0;
}
.post-neighbours-link:hover {
    text-decoration: none;
}
</style>
