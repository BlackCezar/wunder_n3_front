<script setup lang="ts">
import SearchIcon from "@/assets/img/search.svg";
import ArrowDown from "@/assets/img/arrow-down.svg";

type SelectItem = {
    key: string;
    label: string;
};
const props = defineProps<{
    placeholder?: string;
    inputType?: string;
    inputId: string;
    inputModel?: string;
    feedback?: string;
    items?: SelectItem[];
    defaultItem?: SelectItem;
}>();

const emit = defineEmits<{
    (e: "update:inputModel", value: string): void;
}>();

const { t } = useI18n();
const value = ref<SelectItem | null>(null);
const isOpen = ref<boolean>(false);
const search = ref<string>("");
const searchInput = ref<HTMLInputElement | null>(null);

const getDefault = computed(() => {
    if (props.defaultItem) return props.defaultItem.label;
    if (props.items && props.items.length > 0) return props.items[0].label;
    return "";
});

const getInvalidFeedback = computed(() => {
    if (props.feedback) return props.feedback;
    if (props.inputType === "email") return t("registration.EmailFeedback");
    return t("registration.PhoneFeedback");
});

const filteredItems = computed(() => {
    if (search.value && props.items) {
        return (
            props.items.filter((item) => item.label.includes(search.value)) ??
            []
        );
    }
    return props.items;
});

const selectItem = (val: SelectItem) => {
    value.value = val;
    isOpen.value = false;
    emit("update:inputModel", val.key);
};
const closeList = (ev: MouseEvent) => {
    if (isOpen.value) {
        isOpen.value = false;
    }
};
const openList = (ev: MouseEvent) => {
    ev.stopPropagation();
    isOpen.value = true;
};

const vClickOutside = {
    mounted: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
    },
};
</script>
<template>
    <b-form-group class="select-search">
        <div class="select-search-placeholder" @click="openList">
            <span>{{ value ? value.label : getDefault }}</span>
            <ArrowDown />
        </div>
        <div
            v-if="isOpen"
            class="select-search-menu"
            v-click-outside="closeList"
        >
            <div class="select-search-input">
                <b-form-input
                    ref="searchInput"
                    v-model="search"
                    :placeholder="placeholder ?? ''"
                />
                <SearchIcon />
            </div>
            <ul class="select-search-list">
                <li
                    v-for="item in filteredItems"
                    @click="() => selectItem(item)"
                    :key="item.key"
                    class="select-search-item"
                >
                    {{ item.label }}
                </li>
            </ul>
        </div>
        <b-form-invalid-feedback
            class="form-input-invalid-feedback"
            id="input-live-feedback"
        >
            {{ getInvalidFeedback }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<style lang="css" scoped>
.select-search {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 200px;
}

.select-search-placeholder {
    background: white;
    border: 1px solid var(--primary);
    font-size: 16px;
    color: var(--darkGray);
    height: var(--inputHeight);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 10px 12px;
    min-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
}

.select-search-placeholder svg {
    min-width: 14px;
}

.select-search-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    z-index: 1;
    display: flex;
    background: white;
    box-shadow:
        -6px -6px 15px rgba(204, 185, 185, 0.25),
        6px 6px 15px rgba(204, 185, 185, 0.25);
    flex-direction: column;
}

.select-search-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.select-search-input input {
    padding: 12px;
    padding-right: 30px;
    line-height: 18px;
    height: auto;
}

.select-search-input svg {
    position: absolute;
    right: 13px;
    min-width: 13px;
}

.select-search-list {
    margin: 0;
    padding: 0;
}

.select-search-item {
    min-height: 44px;
    list-style-type: none;
    padding: 12px;
    color: var(--darkGray);
    font-size: 16px;
}

.select-search-item:hover {
    background-color: var(--lightGray3);
    cursor: pointer;
}

.select-search-item--default {
    margin: 0;
    background: var(--lightGray3);
    font-weight: 500;
}

@media (max-width: 992px) {
    .select-search {
        max-width: unset;
        width: 100%;
    }
}
</style>
