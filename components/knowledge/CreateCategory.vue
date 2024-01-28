<script setup lang="ts">
import * as yup from 'yup'
import { useKnowledgeStore } from "~/store/knowledge";

const {handleSubmit, resetForm, meta} = useForm({
    validationSchema: {
        name: yup.string().required().min(3).max(64),
        sort: yup.number().required()
    }, initialValues: {
        name: '',
        sort: 500
    }
})

const knowledgeStore = useKnowledgeStore()
const processForm = handleSubmit(async (values) => {
    await knowledgeStore.createCategory(values)
    resetForm()
    await knowledgeStore.getCategories()
})
</script>
<template>
    <div class="ui-block">
        <div class="ui-block-title">Создание категории</div>
        <form @submit.prevent="processForm">
                <div class="row ui-last-negative">
                    <div class="col-sm-6">
                        <div class="ui-field">
                            <div class="ui-field-label">Название</div>
                            <Field
                                name="name"
                                v-slot="{ errors, field }"
                            >
                                <input
                                    type="text"
                                    name="name"
                                    class="ui-input"
                                    v-bind="field"
                                    placeholder="Введите название"
                                    :class="{ 'ui-invalid': errors.length }"
                                />
                                <div
                                    v-if="errors.length"
                                    class="ui-field-error"
                                >
                                    {{ errors[0] }}
                                </div>
                            </Field>
                        </div>
                    </div>

                    <div class="col-sm-6">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="ui-field">
                                    <div class="ui-field-label">Сортировка</div>
                                    <Field
                                        name="sort"
                                        v-slot="{ errors, field }"
                                    >
                                        <input
                                            type="number"
                                            class="ui-input"
                                            v-bind="field"
                                            name="sort"
                                            placeholder="Целое число"
                                        />
                                        <div
                                            v-if="errors.length"
                                            class="ui-field-error"
                                        >
                                            {{ errors[0] }}
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            <div class="col-sm-8">
                                <div class="ui-field-label ui-invisible">
                                    Кнопка
                                </div>
                                <button class="ui-btn" :disabled="!meta.valid">
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
            </form>
    </div>
</template>
<style scoped lang="css">
.ui-field-hint {
    margin-top: -30px;
    margin-bottom: 20px;
    max-width: 350px;
}
@media screen and (max-width: 992px) {
    .ui-field-hint {
        margin-top: 0;
    }
}
</style>
