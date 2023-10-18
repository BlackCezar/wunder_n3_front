<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContractStore } from '../store/contracts';
import { DocumentsTabs, ContractType } from '~/types/contract.interface'
import FormSelectSearch from '~/components/ui/FormSelectSearch.vue'
import FormSearch from '~/components/ui/FormSearch.vue'


const { t } = useI18n()
const contractStore = useContractStore()
const { list: contracts, filters } = storeToRefs(contractStore)
const activeTab = ref<DocumentsTabs>(DocumentsTabs.finances)
const tabs = markRaw([
    {
        text: t("Documents.FinancesTitle"),
        key: DocumentsTabs.finances,
    },
    {
        text: t("Documents.ClosureTitle"),
        key: DocumentsTabs.closure,
    },
    {
        text: t("Documents.ContractsTitle"),
        key: DocumentsTabs.contracts,
    },
]);

const mappedContracts = computed(() => {
    const list = [{ key: '', label: 'Все договора' }]

    if (contracts.value.length === 0) return list;

    for (const contract of contracts.value) {
        list.push({
            key: contract.id.toString(),
            label: `${contract.contractType === ContractType.STANDARD ? 'Публичный' : 'Уникальный'} договор от ${new Date(contract.startDate).toLocaleDateString()}`
        })
    }

    return contracts
})

onMounted(() => {
    contractStore.loadContracts()
})
</script>
<template>
    <div class="documents">
        <div class="page-header-3">
            {{ $t("Navigation.DocumentManagement").toUpperCase() }}
        </div>
        <div class="row">
            <div class="documents-links">
                <ul>
                    <li v-for="link in tabs" :class="{ active: activeTab === link.key }" :key="link.key"
                        @click="activeTab = link.key; filters.page = 1">
                        <span>
                            {{ link.text }}</span>
                    </li>
                </ul>
            </div>
            <div class="documents-filters">
                <Form>
                    <div class="closure-contract-filter">
                        <Field name="contractId" v-slot="{ value, handleChange }">
                            <FormSelectSearch :placeholder="$t('Documents.EnterContract')" inputId="contract"
                                inputType="select" :input-model="value" :items="mappedContracts"
                                @update:inputModel="handleChange" :feedback="''" />
                        </Field>
                    </div>
                    <div class="closure-period-filter">
                        <b-form-group class="date-input-container">
                            <Field name="fromDate" v-slot="{ value, handleChange }">
                                <b-form-input type="date" :placeholder="$t('Documents.FromDate')" id="fromDate"
                                    class="form-input" :model-value="value" @update:model-value="handleChange" />
                            </Field>
                            <Field name="endDate" v-slot="{ value, handleChange }">
                                <b-form-input type="date" :placeholder="$t('Documents.EndDate')" id="endDate"
                                    class="form-input" :model-value="value" @update:model-value="handleChange" />
                            </Field>
                        </b-form-group>
                    </div>
                    <div class="closure-search-filter">
                        <FormSearch :placeholder="$t('Documents.EnterSearch')" inputId="search" type="search" />
                    </div>
                </Form>
            </div>
        </div>
        <div class="documents-container">
            <div class="documents-content" v-if="contracts.length">
                <DocumentsFinances v-if="activeTab === 'finances'" :filters="filters" :contracts="contracts" />
                <DocumentsClosure v-else-if="activeTab === 'closure'" :filters="filters" :contracts="contracts" />
                <DocumentsContracts v-else-if="activeTab === 'contracts'" :filters="filters" :contracts="contracts" />
            </div>
        </div>
    </div>
</template>
<style>
@import "~/assets/css/documents.css";
</style>