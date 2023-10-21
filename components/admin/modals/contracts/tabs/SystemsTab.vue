<script setup lang="ts">
import { Field } from "vee-validate";
import type { IContract } from "~/types/contract.interface";
import { ContractType } from "~/types/contract.interface";
import SystemLineModal from "../SystemLine.vue";
import { useContractStore } from "~/store/contracts";
import { useRegionStore } from "~/store/regions";
import { storeToRefs } from "pinia";

const props = defineProps<{
    contract: IContract;
    contractType: ContractType;
}>();

const showEditLineModal = ref<boolean>(false);
const selectedSystem = ref(null);
const contractStore = useContractStore();
const regionStore = useRegionStore();
const { globalSystemSettings } = storeToRefs(regionStore);

const editSystemSettingLine = (system: any) => {
    selectedSystem.value = system;
    showEditLineModal.value = true;
};

const systemList = computed(() => {
    console.log();
    return props.contract.contractType === ContractType.STANDARD
        ? globalSystemSettings.value
        : props.contract.systemSettings
        ? props.contract.systemSettings.sort((a, b) => (a.id > b.id ? 1 : -1))
        : globalSystemSettings.value.slice();
});

const removeLineFromSystem = () => {};
</script>
<template>
    <div>
        <b-alert
            :model-value="true"
            variant="info"
            v-if="contractType === ContractType.STANDARD"
        >
            Используются данные из глобальных настроек
        </b-alert>
        <template v-if="contractType !== ContractType.STANDARD">
            <div style="padding-left: 5px">
                {{ $t("Settings.MinSums") }}
            </div>
            <div class="system-settings-container">
                <div
                    class="system-setting"
                    v-for="systemSettings in systemList"
                >
                    <b-list-group>
                        <b-list-group-item style="padding: 0 5px">
                            <b-form-checkbox
                                :disabled="
                                    contractType === ContractType.STANDARD
                                "
                                v-model="systemSettings.isActive"
                                name="check-button"
                                type="checkbox"
                            >
                                <img
                                    :src="
                                        systemsToImg.get(
                                            systemSettings.systemName,
                                        )
                                    "
                                    :alt="systemSettings.systemName"
                                />
                            </b-form-checkbox>
                        </b-list-group-item>
                        <b-list-group-item>
                            <Field
                                v-slot="{ meta }"
                                as="div"
                                name="systemSettings.minSum"
                                class="system-settings-amount"
                            >
                                <b-form-input
                                    class="form-input m-0"
                                    v-model="systemSettings.minSum"
                                    type="number"
                                    :disabled="
                                        contractType ===
                                            ContractType.STANDARD ||
                                        !systemSettings.isActive
                                    "
                                    step="0.01"
                                    :inputId="
                                        'minSum' + systemSettings.systemName
                                    "
                                    :state="meta.touched ? meta.valid : null"
                                    :placeholder="$t('Settings.minSum')"
                                />
                                <button
                                    style="
                                        width: 30px;
                                        height: 30px;
                                        margin-left: 10px;
                                    "
                                    @click="
                                        editSystemSettingLine(systemSettings)
                                    "
                                    :disabled="
                                        contractType === ContractType.STANDARD
                                    "
                                    type="button"
                                    class="btn btn-outline-light"
                                >
                                    <IBiPencil variant="primary" />
                                </button>
                            </Field>
                        </b-list-group-item>
                    </b-list-group>
                </div>
            </div>
        </template>
        <ClientOnly>
            <b-modal
                hide-header
                hide-footer
                v-model="showEditLineModal"
                id="edit-systems-modal"
                @hidden="selectedSystem = null"
            >
                <SystemLineModal
                    @update:selectedSystem="contractStore.setContractLines"
                    is-contract-settings
                    @close="showEditLineModal = false"
                    v-if="showEditLineModal && selectedSystem"
                    @remove-line="removeLineFromSystem"
                    :selected-system="selectedSystem"
                />
            </b-modal>
        </ClientOnly>
    </div>
</template>
<style scoped lang="css">
.system-settings-amount {
    display: flex;
    align-items: center;
}
.system-settings-amount .btn-outline-light {
    color: black;
    border: 1px solid black;
}
</style>
