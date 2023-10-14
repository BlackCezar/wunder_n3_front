<template>
    <b-form-group class="form-input-search">
        <b-form-input
            class="form-input"
            @input.native="doUpdate"
            @click.native="doUpdate"
            :id="inputId"
            :name="inputId"
            :value="inputModel"
            type="search"
            :placeholder="placeholder"
        />
        <SearchIcon v-if="inputModel.length === 0" />
        <CloseIcon @click="clearValue" v-else />
    </b-form-group>
</template>

<script>
import SearchIcon from "~/assets/img/search.svg";
import CloseIcon from "~/assets/img/close-active.svg";

export default {
    name: "FormSearch",
    components: {
        CloseIcon,
        SearchIcon,
    },
    data() {
        return {
            value: "",
        };
    },
    props: {
        placeholder: String,
        inputId: String,
        inputModel: {
            type: String,
            required: true,
        },
    },
    methods: {
        async doUpdate(e) {
            this.$emit("input", e.target.value);
        },
        clearValue() {
            this.$emit("input", "");
        },
    },
    emits: ["update:inputModal"],
};
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
