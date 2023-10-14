<template>
    <div>
        <b-modal
                id="candidates-view"
                v-model="candidatesView"
                hide-footer
                hide-header
                @hidden="doc = null"
        >
            <div v-if="doc" class="p-3">
                <b-alert  :model-value="doc.customerId" variant="success" >Кандидат подтвержден, id - {{doc.customerId}}</b-alert>
                <b-alert  :model-value="!doc.customerId" variant="secondary" >Кандидат ожидает подтверждения</b-alert>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.Id")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.id }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.Region")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.regionName }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.companyName")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.companyName }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.companyTaxNumber")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.companyTaxNumber }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.contactEmail")
                        }}
                    </b-col>
                    <b-col cols="8"
                    ><a :href="`mailto:${doc.contactEmail}`">{{
                        doc.contactEmail
                        }}</a></b-col
                    >
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.contactName")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.contactName }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.contactPhoneNumber")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.contactPhoneNumber }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.publicAgree")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.publicAgree ? "Да" : "Нет" }}</b-col>
                </b-row>
                <b-row class="mb-2">
                    <b-col class="text-right" cols="4">{{
                        $t("CustomerCandidates.taskId")
                        }}
                    </b-col>
                    <b-col cols="8">{{ doc.taskId }}</b-col>
                </b-row>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts" setup>
import {ICustomerCandidate} from "~/types/user.interface";

defineProps<{
    clients: ICustomerCandidate[]
}>()
const doc = ref<null | ICustomerCandidate>(null);
const candidatesView = ref<boolean>(false)

useListen('modal:show-customer-candidate', item => {
    doc.value = item;
    candidatesView.value = true;
})

const openModal = (client) => {
    if (client) {
        doc.value = client;
        candidatesView.value = true;
    }
}
</script>

<style scoped></style>
