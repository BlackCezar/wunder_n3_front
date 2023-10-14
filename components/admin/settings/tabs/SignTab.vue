<script setup lang="ts">
import { useFileService, ref } from "#imports";

const props = defineProps<{
    sign?: string;
    regionId: number;
    signValue?: string | File;
}>();

const isLoading = ref<boolean>(false);
const emit = defineEmits(["file-uploaded"]);
const { uploadSignFile, downloadFile } = useFileService();
const uploadImg = async () => {
    isLoading.value = true;
    try {
        let formData = new FormData();
        formData.append("file", props.signValue);
        const link = await uploadSignFile(formData, props.regionId);
        emit("file-uploaded", link);
    } catch (e) {
        console.error(e);
    }
    isLoading.value = false;
};

let previewDefault = ref(null);

downloadFile(props.sign, "sign").then((file) => {
    previewDefault.value.src = URL.createObjectURL(file);
});
</script>

<template>
    <div>
        <b-row v-if="sign">
            <b-col cols="3" style="text-align: right">
                {{ $t("Settings.SignTab") }}
            </b-col>
            <b-col>
                <img
                    alt="Загруженная подпись"
                    ref="previewDefault"
                    id="sign-img"
                    src="#"
                />
            </b-col>
        </b-row>
        <UiTableInputFile
            :label="$t('Documents.Document')"
            :placeholder="$t('Documents.ChoseFile')"
            :browse-text="$t('Settings.ChoseFile')"
            :drop-placeholder="$t('Documents.DropFile')"
            :no-drop-placeholder="$t('Settings.NotAllowed')"
            accept=".jpg, .png, .gif"
            name="sign"
        />
        <b-row v-if="signValue && typeof signValue !== 'string'">
            <b-col cols="3" style="text-align: right">
                {{ $t("Settings.Preview") }}
            </b-col>
            <b-col>
                <img
                    ref="preview"
                    id="sign-img"
                    :src="signValue.webkitRelativePath"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col offset="3">
                {{ $t("Settings.SignHelper") }}
            </b-col>
        </b-row>
        <b-row>
            <b-col offset="3" class="d-flex">
                <b-button
                    variant="secondary"
                    @click="region.sign = null"
                    class="mt-2 mr-3"
                    >{{ $t("Settings.Clear") }}</b-button
                >
                <b-button
                    :disabled="isLoading"
                    variant="primary"
                    @click="uploadImg"
                    class="mt-2"
                    >{{ $t("Settings.Upload") }}</b-button
                >
            </b-col>
        </b-row>
    </div>
</template>
