<template>
    <div>
        <b-modal
            id="candidates-view"
            v-model="candidatesView"
            hide-footer
            hide-header
            @close="doc = null"
        >
            <template #default>
              <div>
                    <div class="p-3">
                        <div v-show="doc?.customerId" class="alert alert-success">
                            Кандидат подтвержден, id - {{ doc?.customerId }}
                        </div>
                        <div v-show="!doc?.customerId" class="alert alert-info">
                            Кандидат ожидает подтверждения
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right"
                                >{{ $t("CustomerCandidates.Id") }}
                            </div>
                            <div class="col-8">{{ doc?.id }}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.Region") }}</div>
                            <div class="col-8">{{ doc?.regionName }}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.companyName") }}</div>
                            <div class="col-8">{{ doc?.companyName }}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.companyTaxNumber") }}</div>
                            <div class="col-8">{{ doc?.companyTaxNumber }}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.contactEmail") }}</div>
                            <div class="col-8"><a :href="`mailto:${doc?.contactEmail}`">{{
                                    doc?.contactEmail
                                }}</a></div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.contactName") }}</div>
                            <div class="col-8">{{ doc?.contactName }}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.contactPhoneNumber") }}</div>
                            <div class="col-8"><a :href="`tel:${doc?.contactPhoneNumber}`">{{ doc?.contactPhoneNumber }}</a></div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.publicAgree") }}</div>
                            <div class="col-8">{{ doc?.publicAgree ? "Да" : "Нет" }}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4 text-right">{{ $t("CustomerCandidates.taskId") }}</div>
                            <div class="col-8">{{ doc?.taskId }}</div>
                        </div>
                    </div>
              </div>
            </template>
        </b-modal>
    </div>
</template>

<script lang="ts" setup>
import type { ICustomerCandidate } from "~/types/user.interface";

defineProps<{
    clients: ICustomerCandidate[];
}>();
const doc = ref<null | ICustomerCandidate>(null);
const candidatesView = ref<boolean>(false);

useListen("modal:show-customer-candidate", (item) => {
    console.log('modal', item)
    candidatesView.value = true;
    doc.value = item;
});

watch(candidatesView, (val) => {
    console.log('changed to ', val)
}, {
    immediate: true
})
</script>

<style scoped></style>
