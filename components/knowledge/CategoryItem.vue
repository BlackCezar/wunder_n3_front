<template>
    <div class="category-item">
        <div class="row">
            <div class="col-sm-6">
                <div class="ui-field">
                    <input
                        type="text"
                        class="ui-input"
                        v-model.trim="cat.name"
                        :readonly="!isEditable"
                    />
                </div>
            </div>

            <div class="col-sm-2">
                <div class="ui-field">
                    <input
                        type="text"
                        class="ui-input"
                        v-model.number="cat.sort"
                        :readonly="!isEditable"
                    />
                </div>
            </div>

            <div class="col-sm-4 pt-2">
                <a
                    href="#"
                    class="ui-iconed-link"
                    v-if="isEditable"
                    @click.prevent="isEditable = false"
                    v-b-tooltip.hover
                    title="Отменить"
                >
                    <b-icon
                        icon="x-circle"
                        font-scale="1.25"
                        style="color: #bbb"
                    ></b-icon>
                </a>
                <a
                    href="#"
                    class="ui-iconed-link"
                    v-if="!isEditable"
                    @click.prevent="isEditable = !isEditable"
                    v-b-tooltip.hover
                    title="Редактировать"
                >
                    <b-icon icon="pencil" font-scale="1.25"></b-icon>
                </a>
                <a
                    href="#"
                    class="ui-iconed-link"
                    v-if="isEditable"
                    @click.prevent="editHandler(cat)"
                    v-b-tooltip.hover
                    title="Сохранить"
                >
                    <b-icon icon="check-lg" font-scale="1.25"></b-icon>
                </a>
                <a
                    href="#"
                    class="ui-iconed-link"
                    @click.prevent="deleteCategory(cat.id)"
                    v-b-tooltip.hover
                    title="Удалить"
                >
                    <b-icon
                        icon="trash"
                        font-scale="1.25"
                        variant="danger"
                    ></b-icon>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "pinia";
import { useKnowledgeStore } from "@/store/knowledge";

export default {
    name: "KnowledgeCategoryItem",

    props: {
        category: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            isEditable: false,
            cat: {
                name: "",
                sort: "",
            },
        };
    },

    methods: {
        ...mapActions(useKnowledgeStore, {
            updateCategory: "knowledge/updateCategory",
            deleteCategory: "knowledge/deleteCategory",
        }),

        async editHandler(data) {
            await this.updateCategory(this.cat);
            this.isEditable = false;
            this.cat = { ...this.category };
        },
    },

    created() {
        this.cat = { ...this.category };
    },
};
</script>

<style scoped lang="css">
.category-item:not(:last-child) {
    margin-bottom: 30px;
    border-bottom: 1px solid var(--borderGray2);
}
</style>
