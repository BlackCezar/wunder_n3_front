<script setup lang="ts">
import { IRegionSystemSettings } from "~/types/region.interface";

defineProps<{
    index: number;
    systemSettings: {
        key: string;
        value: IRegionSystemSettings;
    };
}>();
const emit = defineEmits(["edit-lines"]);
</script>
<template>
    <b-list-group>
        <b-list-group-item style="padding: 0 5px">
            <Field
                :name="`systemSettings[${index}].isActive`"
                type="checkbox"
                :value="true"
                v-slot="{ field }"
            >
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-bind="field"
                />
                <img
                    :src="systemsToImg.get(systemSettings.value.systemName)"
                    :alt="systemSettings.value.systemName"
                />
            </Field>
        </b-list-group-item>
        <b-list-group-item>
            <div class="system-settings-amount">
                <Field
                    :name="`systemSettings[${index}].minSum`"
                    v-slot="{ field }"
                >
                    <input
                        class="form-input m-0"
                        type="number"
                        step="0.01"
                        :placeholder="$t('Settings.minSum')"
                        :disabled="!systemSettings.value.isActive"
                        v-bind="field"
                    />
                </Field>
                <button
                    @click="emit('edit-lines', `systemSettings[${index}]`)"
                    type="button"
                    class="btn btn-outline-light"
                >
                    <IBiPencil variant="primary" />
                </button>
            </div>
        </b-list-group-item>
    </b-list-group>
</template>
