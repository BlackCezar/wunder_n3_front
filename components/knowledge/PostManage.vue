<template>
    <div class="post-manage" v-if="$auth && $auth.user.role === 'ADMIN'">
        <nuxt-link
            :to="'/knowledge/admin/posts/edit/' + postID"
            class="ui-btn ui-btn-bordered"
        >
            <b-icon icon="pencil" style="margin-right: 5px" />Редактировать
        </nuxt-link>
        <a
            href="javascript:void(0)"
            class="ui-btn ui-btn-red"
            @click="$bvModal.show('bv-modal-pdelete')"
        >
            <b-icon icon="trash" style="margin-right: 5px" />Удалить статью
        </a>

        <b-modal
            ref="modal"
            id="bv-modal-pdelete"
            hide-footer
            title="Удаление статьи"
        >
            <div class="post-manage-body text-center">
                <p>
                    Вы уверены, что хотите удалить данный материал?<br />Это
                    действие необратимо, данные будут потеряны.
                </p>
                <br />
                <a
                    href="#"
                    class="ui-btn ui-btn-red"
                    @click.prevent="deleteHandler(postID)"
                    >Да, удалить статью</a
                >
            </div>
        </b-modal>
    </div>
</template>

<script>
import { useKnowledgeStore } from "@/store/knowledge";
import { mapActions } from "pinia";

export default {
    name: "KnowledgePostManage",
    props: {
        postID: {
            required: true,
            type: Number,
        },
    },
    methods: {
        ...mapActions(useKnowledgeStore, {
            deletePost: "deletePost",
        }),

        async deleteHandler(id) {
            await this.deletePost(id);

            this.$refs["modal"].hide();
        },
    },
};
</script>

<style lang="css" scoped>
.post-manage {
    margin-bottom: 30px;
    padding-bottom: 30px;
    margin-top: -20px;
    border-bottom: 1px solid #dee2e6;
}
@media screen and (max-width: 992px) {
    .post-manage {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 1fr 1fr;
    }
}
.post-manage .ui-btn {
    margin-right: 15px;
}
.post-manage-body {
    padding: 2.5rem 1rem 3rem;
}
</style>
