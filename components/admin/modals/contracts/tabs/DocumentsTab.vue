<template>
  <div v-if="contract">
    <b-row v-if="contractType === 'STANDARD'">
      <b-col class="mt-2 pr-1" cols="3" style="text-align: right"
      >{{ $t("Documents.Documents") }}:
      </b-col
      >
      <b-col class="mt-2 pr-1" cols="9"
      ><a
          :href="globalSettings ? globalSettings.publicContract : '#'"
          class="a-link"
      >{{ $t("AccountManagement.PublicContract") }}</a
      ></b-col
      >
    </b-row>
    <b-row v-else class="documents-row">
      <b-col class="mt-2 pr-1" cols="3" style="text-align: right"
      >{{ $t("Documents.Documents") }}:
      </b-col
      >
      <b-col cols="9">
        <b-row class="mt-2 mb-2" style="font-weight: bold">
          <b-col cols="6">
            {{ $t("Documents.Document") }}
          </b-col>
          <b-col cols="4">
            {{ $t("Documents.Comment") }}
          </b-col>
          <b-col cols="2">
            {{ $t("AccountManagement.AdminActions") }}
          </b-col>
        </b-row>
        <b-row
            v-for="(doc, index) in contract.documents"
            :key="'files-' + index"
            class="mt-2 mb-2"
        >
          <b-col class="text-clip" cols="6">{{ doc.name }}</b-col>
          <b-col cols="4">{{ doc.comment }}</b-col>
          <b-col cols="2">
            <div style="display: flex; gap: 10px; flex-direction: row">
              <a
                  :href="'/documents/public/contracts/' +
                                    doc.name
                                "
                  target="_blank"
              >
                <IBiDownload/>
              </a>
              <div
                  class="action-icon active ml-2"
                  @click="
                                    removeDoc(doc.id)
                                "
              >
                <IBiTrash variant="danger"/>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row
            v-for="(line, index) in toUploads"
            :key="index"
            class="mt-3 mb-3"
        >
          <b-col cols="6">
            <b-form-file
                v-model="toUploads[index].file"
                :drop-placeholder="$t('Documents.DropFile')"
                :placeholder="$t('Documents.ChoseFile')"
                :state="Boolean(toUploads[index].file)"
                class="input-height"
            />
          </b-col>
          <b-col cols="4">
            <b-form-input
                v-model="toUploads[index].comment"
                :placeholder="$t('Documents.Comment')"
                class="form-input m-0"
                inputId="line.comment"
            />
          </b-col>
          <b-col class="d-flex" cols="2">
            <b-button
                variant="outline-danger"
                @click="deleteLocalFile(index)"
            >
              <IBiTrash variant="danger"/>
            </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="5">
            <b-button
                class="add-document"
                variant="outline-info"
                @click="addLocalFile"
            >
              + {{ $t("Documents.AddDocument") }}
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col cols="3">
      </b-col>
      <b-col>
        <b-button
            :disabled="isLoading"
            variant="outline-warning"
            @click="saveDocuments"
        >
          + {{ $t("Documents.SaveDocuments") }}
        </b-button>
      </b-col>
    </b-row>

  </div>
</template>
<script lang="ts" setup>
import {useRegionStore} from "@/store/regions";
import {ContractType, IContract} from "@/types/contract.interface";
import {toast} from "vue3-toastify";
import {useContractStore} from "~/store/contracts";

const props = defineProps<{
  contract: IContract;
  contractType: ContractType;
}>();

const {toUploads, deleteRemoteContractFile, deleteLocalFile, addLocalFile, uploadContractFile} =
    useFileService();

const {globalSettings} = useRegionStore();
const contractStore = useContractStore();
const isLoading = ref<boolean>(false)

const removeDoc = async (id: number) => {
  await deleteRemoteContractFile(id)
  contractStore.deleteDocument(id)
  console.log('Contract file deleted ' + id)
}
const saveDocuments = async () => {
  isLoading.value = true;
  try {

    const result = await Promise.all(toUploads.value.map(async item => {
      const formData = new FormData()
      if (item.comment) formData.set('comment', item.comment);
      formData.set('contractId', props.contract.id.toString());
      if (item.file) formData.set('file', item.file);
      return uploadContractFile(formData)
    }));
    toUploads.value = []
    contractStore.updateDocuments(result)
    isLoading.value = false;

    console.log(result)
  } catch (e) {
    console.error(e)
    toast.error(e.message)
  }
}
</script>
