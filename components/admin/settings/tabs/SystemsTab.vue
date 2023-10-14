<script setup lang="ts">
import { ref } from "#imports";
import SystemItemLineForm from "~/components/admin/settings/forms/SystemItemLineForm.vue";
import SystemItemForm from "~/components/admin/settings/forms/SystemItemForm.vue";
import { IRegionSystemSettings } from "~/types/region.interface";

const showEditLineModal = ref<boolean>(false);
const selectedSystemName = ref<string | null>(null);
const selectedSystemCodeName = ref<string | null>(null);

const props = defineProps<{
    list: IRegionSystemSettings[];
    resetLines: any;
}>();

const editSystemSettingLine = (name: string, systemName: string) => {
    selectedSystemName.value = name;
    selectedSystemCodeName.value = systemName;
    showEditLineModal.value = true;
};

const cancelSystemSettingsLines = () => {
    props.resetLines(`${selectedSystemName.value}.lines`);
    showEditLineModal.value = false;
    setTimeout(() => {
        selectedSystemName.value = null;
        selectedSystemCodeName.value = null;
    }, 200);
};
</script>

<template>
    <div>
        <div class="system-settings-container">
            <FieldArray name="systemSettings" v-slot="{ fields }">
                <div
                    class="system-setting"
                    v-for="(systemSettings, index) in fields"
                    :key="systemSettings.key"
                >
                    <SystemItemForm
                        :system-settings="systemSettings"
                        :index="Number(index)"
                        @edit-lines="
                            editSystemSettingLine(
                                $event,
                                systemSettings.value.systemName,
                            )
                        "
                    />
                </div>
            </FieldArray>
        </div>
        <ClientOnly>
            <b-modal
                hide-header
                hide-footer
                v-model="showEditLineModal"
                id="edit-systems-modal"
            >
                <SystemItemLineForm
                    :name="selectedSystemName"
                    :system-name="selectedSystemCodeName"
                    @cancel="cancelSystemSettingsLines"
                />
            </b-modal>
        </ClientOnly>
    </div>
</template>
