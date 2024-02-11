<template>
    <Field :name="name" v-slot="{value, handleChange}">
        <Editor :api-key="data.key" :init="data.editorConfig" :model-value="value" @update:modelValue="handleChange"
        />
    </Field>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'
import {useKnowledgeStore} from "~/store/knowledge";
import {mark} from "@intlify/shared";

defineProps<{
    name: string
}>()

const knowledgeStore = useKnowledgeStore()
const appConfig = useAppConfig()

const tinyUpload = async (blobInfo, success, failure, progress) => {
    const fd = new FormData()
    fd.append('file', blobInfo.blob())

    await knowledgeStore.uploadFile(fd)
    success({
        value: appConfig.publicAssetsUrl + knowledgeStore.file.file
    })
    knowledgeStore.clearFile()
}

const data = markRaw({
    key: 'my2qm3hoiri3l0rqqt2x5npbjtdw1vel5sf18gv5x4brknds',
    editorConfig: {
        height: 500,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap','preview', 'anchor',
            'searchreplace', 'code', 'fullscreen',
            'media', 'table', 'paste', 'wordcount'
        ],
        toolbar: 'undo redo | styleselect | bold italic | code | alignleft aligncenter alignright alignjustify | bullist numlist | image media link | table template',
        images_upload_handler: tinyUpload,
    }
})


</script>

<style scoped>

</style>