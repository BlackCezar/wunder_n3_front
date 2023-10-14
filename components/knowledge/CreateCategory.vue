<template>
    <div class="ui-block">
        <div class="ui-block-title">Создание категории</div>
        <ValidationObserver v-slot="{ invalid }">
            <form @submit.prevent="createHandler(category)">
                <div class="row ui-last-negative">
                    <div class="col-sm-6">
                        <div class="ui-field">
                            <div class="ui-field-label">Название</div>
                            <ValidationProvider
                                rules="required|min:3|max:64"
                                v-slot="{ errors }"
                            >
                                <input
                                    type="text"
                                    class="ui-input"
                                    v-model.trim="category.name"
                                    placeholder="Введите название"
                                    :class="{ 'ui-invalid': errors.length }"
                                />
                                <div
                                    v-if="errors.length"
                                    class="ui-field-error"
                                >
                                    {{ errors[0] }}
                                </div>
                            </ValidationProvider>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="ui-field">
                                    <div class="ui-field-label">Сортировка</div>
                                    <ValidationProvider
                                        rules="integer"
                                        v-slot="{ errors }"
                                    >
                                        <input
                                            type="text"
                                            class="ui-input"
                                            v-model.number="category.sort"
                                            placeholder="Целое число"
                                        />
                                        <div
                                            v-if="errors.length"
                                            class="ui-field-error"
                                        >
                                            {{ errors[0] }}
                                        </div>
                                    </ValidationProvider>
                                </div>
                            </div>

                            <div class="col-sm-8">
                                <div class="ui-field-label ui-invisible">
                                    Кнопка
                                </div>
                                <button class="ui-btn" :disabled="invalid">
                                    Создать категорию
                                </button>
                            </div>
                        </div>

                        <div class="ui-field-hint">
                            Чем меньше значение, тем выше в списках будет
                            отображаться категория. Значение по умолчанию: 500
                        </div>
                    </div>
                </div>
                <!--.row-->
            </form>
        </ValidationObserver>
    </div>
    <!--.ui-block-->
</template>

<script>
import { mapActions } from "pinia";

export default {
    name: "KnowledgeCreateCategory",
    data() {
        return {
            category: {
                name: "",
                sort: 500,
            },
        };
    },

    methods: {
        ...mapActions({
            createCategory: "createCategory",
        }),

        async createHandler(data) {
            await this.createCategory(data);

            this.category.name = "";
            this.category.sort = 500;
        },
    },
};
</script>
<style scoped lang="css">
.ui-field-hint {
    margin-top: -30px;
    margin-bottom: 20px;
    max-width: 350px;
}
@media screen and (max-width: 768px) {
    .ui-field-hint {
        margin-top: 0;
    }
}
</style>
