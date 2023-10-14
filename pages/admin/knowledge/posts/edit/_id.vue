<template>
  <div class="page knowledge-page">
    <div class="page-paddings">
      <h1 class="page-title">
        <span class="ui-color-gray">База знаний:</span> редактирование материала
      </h1>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="ui-block">
          <Form v-slot="{ invalid }">
            <form @submit.prevent="savePost(post)">
              <div class="ui-fields">
                <div class="row">
                  <div class="col-md-6">
                    <div class="ui-field">
                      <div class="ui-field-label">Название</div>
                      <ValidationProvider
                        rules="required|max:255"
                        v-slot="{ errors }"
                      >
                        <input
                          type="text"
                          class="ui-input"
                          v-model="post.title"
                        />
                        <div v-if="errors.length" class="ui-field-error">
                          {{ errors[0] }}
                        </div>
                      </ValidationProvider>
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">
                        Выводить материал на главной странице раздела?
                      </div>
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="post.toMain"
                        name="checkbox-1"
                        :value="true"
                        :unchecked-value="false"
                      >
                        Да, выводить
                      </b-form-checkbox>
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">Картинка</div>
                      <div class="ui-image-preview" v-if="image">
                        <img :src="image" alt="image preview" ref="preview" />
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        ref="file"
                        @change="changeHandler"
                      />
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">Категория</div>
                      <select v-model.number="post.categoryID" class="ui-input">
                        <option
                          v-for="item in categories"
                          :key="item.id"
                          :value="item.id"
                        >
                          {{ item.name }}
                        </option>
                      </select>
                    </div>

                    <div class="ui-field">
                      <div class="ui-field-label">Сортировка</div>
                      <div class="row">
                        <div class="col-6">
                          <input
                            type="text"
                            v-model.number="post.sort"
                            class="ui-input"
                          />
                        </div>
                      </div>
                      <div class="ui-field-hint">
                        Чем меньше значение, тем выше в списках будет
                        отображаться категория. Значение по умолчанию: 500
                      </div>
                    </div>
                  </div>
                </div>
                <!--.row-->

                <div class="ui-field">
                  <div class="ui-field-label">Содержимое материала</div>
                  <UiTiny
                    v-model="post.body"
                  />
                </div>
              </div>

              <button class="ui-btn" :disabled="invalid">Сохранить</button>
            </form>
          </Form>
        </div>
        <!--.ui-block-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: isadmin,
  head() {
    return {
      title: "Редактирование материала базы знаний | Wunder Pay",
    };
  },

  async asyncData({ store, params }) {
    const postID = params.id;
    await store.dispatch("knowledge/fetchPost", postID);
    await store.dispatch("knowledge/getCategories");
  },

  data() {
    return {
      image: null,
      isChanged: false,
      post: {
        id: "",
        title: "",
        categoryID: "",
        body: "",
        toMain: false,
        sort: 500,
      },
    };
  },

  computed: {
    ...mapGetters({
      categories: "knowledge/getCategories",
      initialPost: "knowledge/getPost",
    }),
  },

  methods: {
    ...mapActions({
      updatePost: "knowledge/updatePost",
      uploadFile: "knowledge/uploadFile",
    }),

    changeHandler() {
      const that = this;

      if (this.$refs.file.files[0]) {
        this.isChanged = true;

        let reader = new FileReader();
        reader.onload = function (e) {
          that.image = e.target.result;
        };
        reader.readAsDataURL(this.$refs.file.files[0]);
      } else {
        this.image = null;
        this.isChanged = false;
      }
    },

    async savePost(data) {
      // if picture changed, upload it
      if (this.isChanged) {
        const file = this.$refs.file.files[0];
        const fd = new FormData();
        fd.append("file", file);

        await this.uploadFile(fd);
      }

      await this.updatePost(data);
    },
  },

  created() {
    this.post.id = this.initialPost.id;
    this.post.title = this.initialPost.title;
    this.post.categoryID = this.initialPost.categoryID;
    this.post.body = this.initialPost.body;
    this.post.toMain = this.initialPost.toMain;
    this.post.sort = this.initialPost.sort;

    if (this.initialPost.preview) {
      this.image = this.initialPost.preview;
    }
  },
};
</script>
