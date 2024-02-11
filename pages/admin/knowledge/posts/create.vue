<script setup lang="ts">
import {useKnowledgeStore} from "~/store/knowledge";
import { useAsyncData } from "#app";
import { storeToRefs } from "pinia";
import * as yup from 'yup'

useHead({
    title: 'Создание материала базы знаний | Wunder Digital'
})

const knowledgeStore = useKnowledgeStore()

await useAsyncData(() => knowledgeStore.getCategories())
const {categories} = storeToRefs(knowledgeStore)

const image = ref<string | ArrayBuffer | null>(null)
const isChanged = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const {handleSubmit, meta} = useForm({
    validationSchema: {
        post: yup.object().shape({
            title: yup.string().required().max(255),
            categoryID: yup.string().required(),
            body: yup.string().optional(),
            toMain: yup.boolean().optional(),
            sort: yup.number().optional(),
        })
    }, initialValues: {
        post: {
            title: '',
            categoryID: categories.value?.[0]?.id ?? '',
            body: '',
            toMain: false,
            sort: 500
        }
    }
})

function changeHandler() {
    if (fileInput.value?.files?.length) {
        isChanged.value = true;
        let reader = new FileReader();
        reader.onload = function(e) {
            if (e.target) image.value = e.target.result
        }
        reader.readAsDataURL(fileInput.value.files[0])
    } else {
        image.value = null
        isChanged.value = false;
    }
}

const savePost = handleSubmit(async (data) => {
    if (isChanged.value && fileInput.value?.files?.length) {
        const file = fileInput.value?.files[0];
        const fd = new FormData();
        fd.append("file", file);
        await knowledgeStore.uploadFile(fd);
    }
    await knowledgeStore.createPost({
        ...data.post,
    });
})

</script>
<template>
  <div class="page knowledge-page">
    <div class="page-paddings">
      <h1 class="page-title">
        <span class="ui-color-gray">База знаний:</span> создание материала
      </h1>
    </div>

    <div class="">
      <div class="">
        <div class="ui-block" v-if="categories && categories.length">
            <form @submit.prevent="savePost">
              <div class="ui-fields">
                <div class="row">
                  <div class="col-md-6">
                    <div class="ui-field">
                      <div class="ui-field-label">Название</div>
                        <Field v-slot="{errors, field}" name="post.title">
                            <input
                                type="text"
                                class="ui-input"
                                name="post.title"
                                v-bind="field"
                            />
                            <div v-if="errors.length" class="ui-field-error">
                                {{ errors[0] }}
                            </div>
                        </Field>
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">
                        Выводить материал на главной странице раздела?
                      </div>
                        <Field name="post.toMain" v-slot="{field}" :value="true"
                               :unchecked-value="false" type="checkbox">
                          <b-form-checkbox
                            id="checkbox-1"
                            name="checkbox-1"
                            :value="true"
                            :unchecked-value="false"
                            v-bind="field"
                          >
                            Да, выводить
                          </b-form-checkbox>
                        </Field>
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">Картинка</div>
                      <div class="ui-image-preview" v-if="image">
                        <img :src="image" alt="image preview" ref="preview" />
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        ref="fileInput"
                        @change="changeHandler"
                      />
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">Категория</div>
                        <Field name="post.categoryID" v-slot="{field}">
                          <select v-bind="field" name="post.categoryID" class="ui-input">
                            <option
                              v-for="item in categories"
                              :key="item.id"
                              :value="item.id"
                            >
                              {{ item.name }}
                            </option>
                          </select>
                        </Field>
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">Сортировка</div>
                      <div class="row">
                        <div class="col-6">
                            <Field name="post.sort" v-slot="{field}">
                              <input
                                  name="post.sort"
                                  type="text"
                                  v-bind="field"
                                  class="ui-input"
                              />
                            </Field>
                        </div>
                      </div>
                      <div class="ui-field-hint">
                        Чем меньше значение, тем выше в списках будет
                        отображаться категория. Значение по умолчанию: 500
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ui-field">
                  <div class="ui-field-label">Содержимое материала</div>
                    <ClientOnly>
                      <UiTiny
                          name="post.body"
                      />
                    </ClientOnly>
                </div>
              </div>

              <button class="ui-btn" :disabled="!meta.valid">Сохранить</button>
            </form>
        </div>
        <div class="ui-block" v-else>
          <b-alert variant="danger" :model-value="true"
            >Нельзя добавить материал без категорий. Для начала создайте
            категорию</b-alert
          >
          <nuxt-link class="ui-btn" to="/admin/knowledge/categories"
            >Управление категориями</nuxt-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.form-check:has(#checkbox-1) {
    display: flex;
    align-items: center;
    gap: 6px;
}
</style>