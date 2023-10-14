<template>
    <Editor :api-key="data.key" :init="data.editorConfig"
    />
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'
import {useKnowledgeStore} from "~/store/knowledge";
import {mark} from "@intlify/shared";

const knowledgeStore = useKnowledgeStore()

const template = mark(`  <table class="main-post-table" style="width: 100%; border: 0;"><tbody>
    <tr>
        <td style="width: 47%;">
        </td>
        <td style="width: 6%;">
        </td>
        <td style="width: 47%;">
        </td>
    </tr>
    </tbody></table>`)

const tinyUpload = async (blobInfo, success, failure, progress) => {
    const fd = new FormData()
    fd.append('file', blobInfo.blob())

    await knowledgeStore.uploadFile(fd)
    success(knowledgeStore.file)
    knowledgeStore.clearFile()

}

const data = markRaw({
    key: 'my2qm3hoiri3l0rqqt2x5npbjtdw1vel5sf18gv5x4brknds',
    editorConfig: {
        height: 500,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace code fullscreen',
            'media table paste wordcount template'
        ],
        templates: [
            {
                title: 'Шаблон для материалов на главной',
                description: 'Табличный 2-х колоночный лейаут, предназначенный для отображения материаллов на главной раздела Базы знаний',
                content: template
            }
        ],
        toolbar: 'undo redo | styleselect | bold italic | code | alignleft aligncenter alignright alignjustify | bullist numlist | image media link | table template',
        images_upload_handler: tinyUpload,
        // content_style: "body { font-family: Jose; }"
        content_style: [
            "https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap",
            "body { font-family: Jose;} td, th {vertical-align: top;}"
        ],
    }
})


</script>

<style scoped>

</style>