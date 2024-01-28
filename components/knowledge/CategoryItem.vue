<template>
    <div class="category-item">
        <div class="row">
            <div class="col-sm-6">
                <div class="ui-field">
                    <Field name="name"  v-slot="{field}">
                        <input
                            type="text"
                            name="name"
                            class="ui-input"
                            :readonly="!isEditable"
                            v-bind="field"
                        />
                    </Field>
                </div>
            </div>

            <div class="col-sm-2">
                <div class="ui-field">
                    <Field name="sort" :readonly="!isEditable" v-slot="{field}">
                        <input
                            type="number"
                            class="ui-input"
                            name="sort"
                            :readonly="!isEditable"
                            v-bind="field"
                        />
                    </Field>
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
                    <i-bi-x-circle font-scale="1.25"
                                   style="color: #bbb" />
                </a>
                <a
                    href="#"
                    class="ui-iconed-link"
                    v-if="!isEditable"
                    @click.prevent="isEditable = !isEditable"
                    v-b-tooltip.hover
                    title="Редактировать"
                >
                    <i-bi-pencil style="color: var(--primary)"  />
                </a>
                <a
                    href="#"
                    class="ui-iconed-link"
                    v-if="isEditable"
                    @click.prevent="editHandler(cat)"
                    v-b-tooltip.hover
                    title="Сохранить"
                >
                    <i-bi-check style="color: var(--success)" />
                </a>
                <a
                    href="#"
                    class="ui-iconed-link"
                    @click.prevent="knowledgeStore.deleteCategory(category.id)"
                    v-b-tooltip.hover
                    title="Удалить"
                >
                    <i-bi-trash style="color: var(--accent)" />
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from "@/store/knowledge";
import type { IKnowledgeCategory } from "~/types/knowledge.interface";
import * as yup from 'yup'

const props = defineProps<{
    category: IKnowledgeCategory
}>()

const isEditable = ref(false);
const knowledgeStore = useKnowledgeStore()

const {handleSubmit, setValues} = useForm({
    validationSchema: {
        name: yup.string().required(),
        sort: yup.number().required()
    }, initialValues: {
        name: '',
        sort: 500
    }
})

const editHandler = handleSubmit(async (values) => {
    await knowledgeStore.updateCategory({
        id: props.category.id,
        ...values
    })
    isEditable.value = false;
})

onMounted(() => {
    setValues({
        name: props.category.name,
        sort: props.category.sort
    })
})
</script>

<style scoped lang="css">
.category-item:not(:last-child) {
    margin-bottom: 30px;
    border-bottom: 1px solid var(--borderGray2);
}
</style>
