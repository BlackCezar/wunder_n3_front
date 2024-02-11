<template>
    <div class="post-manage" v-if="isAdmin">
        <nuxt-link
            :to="'/admin/knowledge/posts/edit/' + postID"
            class="ui-btn ui-btn-bordered"
        >
            <i-bi-pencil style="margin-right: 5px" />Редактировать
        </nuxt-link>
        <a
            href="#"
            class="ui-btn ui-btn-red"
            @click.prevent="deleteModal = true"
        >
            <i-bi-trash icon="trash" style="margin-right: 5px" />Удалить статью
        </a>

        <b-modal
            v-model="deleteModal"
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

<script setup lang="ts">

import { useKnowledgeStore } from "~/store/knowledge";
import { useAuthStore } from "~/store/auth";
import { storeToRefs } from "pinia";
import { IUserRole } from "~/types/user.interface";

defineProps<{
    postID: number
}>()

const knowledgeStore = useKnowledgeStore()
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)

const deleteModal = ref(false)

async function deleteHandler(id: number) {
    await knowledgeStore.deletePost(id);

    deleteModal.value = false;
}

const isAdmin = computed(() => user.value?.role === IUserRole.ADMIN)
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
