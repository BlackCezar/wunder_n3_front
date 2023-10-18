<template>
    <Field :name="inputId" v-slot="{ field, value, resetField }">
        <b-form-group class="form-input-search">
            <b-form-input class="form-input" :id="inputId" :name="inputId" type="search" :placeholder="placeholder"
                v-bind="field" />
            <SearchIcon v-if="value?.length === 0" />
            <CloseIcon v-else-if="value?.length" @click="resetField" />
        </b-form-group>
    </Field>
</template>

<script setup lang="ts">
import SearchIcon from "~/assets/img/search.svg";
import CloseIcon from "~/assets/img/close-active.svg";

defineProps<{
    inputId: string;
    placeholder?: string;
}>()
</script>

<style scoped lang="css">
.form-input-search {
    position: relative;
}

.form-input-search .form-input {
    padding-right: 36px;
}

.form-input-search svg {
    position: absolute;
    width: 16px;
    right: 12px;
    cursor: pointer;
}

[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
}
</style>
