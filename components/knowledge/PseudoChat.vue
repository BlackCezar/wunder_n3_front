<template>
    <div
        class="helper-wrap"
        v-if="!isHidden && user"
        :class="{ opened: isOpen || isHovered }"
    >
        <div
            class="helper"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
        >
            <div
                class="helper-close"
                @click.prevent="closeHandler"
                v-if="isOpen === true"
            >
                <IBiXCircleFill />
            </div>
            <div class="helper-head" @click.prevent="openForm">
                <div class="helper-head-icon">W</div>
                <div class="helper-head-txts">
                    <div class="helper-head-title">Wunder-помощник</div>
                    <div class="helper-head-subtitle">
                        быстрый поиск по базе знаний
                    </div>
                </div>
            </div>
            <div class="helper-body" v-if="isOpen">
                <div class="helper-results">
                    <div class="helper-results-query" v-if="query.length >= 3">
                        <div class="helper-results-query-title">
                            Ваш запрос:
                        </div>
                        <div class="helper-results-query-query">
                            {{ query }}
                        </div>
                    </div>

                    <div class="helper-results-list">
                        <div class="helper-results-list-title">
                            Wunder-помощник:
                        </div>

                        <div class="helper-initial-hint" v-if="isVirgin">
                            <b-alert show variant="secondary"
                                >Введите свой запрос в форму ниже
                                <IBiEmojiSmile />
                            </b-alert>
                        </div>

                        <div
                            class="helper-results-wrap"
                            v-if="searchResults && searchResults.length"
                        >
                            <div
                                class="helper-result"
                                v-for="item in searchResults"
                                :key="item.id"
                            >
                                <nuxt-link
                                    class="helper-result-link"
                                    :to="'/knowledge/post/' + item.id"
                                    >{{ item.title }}
                                </nuxt-link>
                            </div>
                        </div>

                        <div v-if="!searchResults.length && query.length >= 3">
                            <b-alert show
                                >По Вашему запросу в
                                <nuxt-link to="/knowledge/"
                                    ><strong>базе знаний</strong></nuxt-link
                                >
                                ничего не найдено. Попробуйте изменить критерии
                                поиска
                            </b-alert>
                        </div>
                    </div>
                </div>

                <div class="helper-form">
                    <input
                        type="text"
                        class="helper-form-input ui-input"
                        placeholder="Введите поисковый запрос"
                        v-model.trim="query"
                        @input="searchHandler"
                        @input.once="isVirgin = false"
                    />
                    <button
                        class="helper-form-btn"
                        @click.prevent="searchHandler"
                        :disabled="query.length < 3"
                    >
                        <IBiArrowRightCircle />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from "~/store/knowledge";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";

const { user } = useAuthStore();
const knowledgeStore = useKnowledgeStore();
const { searchResults } = storeToRefs(knowledgeStore);
const query = ref<string>("");
const isOpen = ref<boolean>(false);
const isVirgin = ref<boolean>(true);
const isHidden = ref<boolean>(false);
const isHovered = ref<boolean>(false);
const route = useRoute();

const searchHandler = () => {
    if (query.value.length >= 3) knowledgeStore.fetchSearch(query.value);
};

const openForm = () => (isOpen.value = true);
const closeHandler = () => {
    isOpen.value = false;
    isHovered.value = false;
};

watch(
    route,
    () => {
        isHidden.value = route.path.includes("knowledge");
    },
    {
        deep: true,
    },
);

onMounted(() => {
    if (route.path.includes("knowledge")) isHidden.value = true;
});
</script>

<style lang="css" scoped>
.helper {
    position: relative;
    display: block;
    pointer-events: initial;
    margin-bottom: 20px;
    background-color: transparent;
    border: 1px solid transparent;
    font-size: 16px;
    transition:
        background-color 0.3s,
        padding 0.3s;
}
.helper-head {
    width: 50px;
    height: 50px;
    transition: width 0.3s;
}
.helper-head-icon {
    position: relative;
    z-index: 99;
}
.helper-wrap {
    display: block;
}
.helper-wrap.opened .helper {
    background-color: #fff;
    border: 1px solid #f2f0f4;
    padding: 20px 30px;
}
.helper-wrap.opened .helper-head {
    width: 365px;
}
.helper-wrap.opened .helper-head-txts {
    opacity: 1;
    width: 285px;
    transition: width 0.3s;
    white-space: nowrap;
}
.helper-head {
    display: flex;
    align-items: center;
    line-height: 1;
    cursor: pointer;
}
.helper-head-icon {
    width: 50px;
    flex: 0 0 50px;
    height: 50px;
    border-radius: 25px;
    margin-right: 12px;
    text-align: center;
    line-height: 50px;
    background-color: var(--accent);
    color: #fff;
    font-weight: 500;
    font-size: 24px;
}
.helper-head-txts {
    opacity: 0;
    width: 0;
    transition: opacity 0.3s;
}
.helper-head-title {
    font-size: 18px;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
}
.helper-head-subtitle {
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--lightGray2);
}
.helper-results {
    margin-bottom: 25px;
    height: 280px;
    overflow-y: auto;
    border: 1px solid var(--borderGray2);
    padding: 20px;
}
.helper-results::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #dee2e6;
}
.helper-results::-webkit-scrollbar-thumb {
    width: 6px;
    height: 6px;
    background-color: var(--accent);
}
.helper-body {
    margin: 25px 0 15px;
}
.helper-form {
    position: relative;
}
.helper-form-input {
    display: block;
    width: 100%;
    padding: 0 45px 0 20px;
    border-radius: 0;
}
.helper-form-btn {
    position: absolute;
    right: 15px;
    width: 20px;
    height: 20px;
    top: 50%;
    border: 0;
    padding: 0;
    margin: -10px 0 0 0;
    background-color: transparent;
    font-size: 20px;
    color: var(--primary);
    z-index: 1;
}
.helper-form-btn:disabled {
    color: #a09e9e;
    cursor: not-allowed;
}
.helper-form-btn:hover {
    color: var(--green);
}
.helper-form-btn svg {
    vertical-align: top;
}
.helper-results-query {
    padding-right: 30px;
    margin-bottom: 15px;
}
.helper-results-query-title {
    margin-bottom: 2px;
    font-size: 14px;
}
.helper-results-query-query {
    font-size: 16px;
    font-weight: 600;
    font-style: italic;
}
.helper-results-list {
    padding-left: 30px;
    text-align: right;
}
.helper-results-list-title {
    margin-bottom: 3px;
    font-size: 14px;
}
.helper-results .alert {
    margin-top: 8px;
    font-size: 13px;
    padding: 8px 12px;
    text-align: left;
}
.helper-result {
    margin-bottom: 12px;
}
.helper-result-link {
    color: var(--link);
    text-decoration: none;
}
.helper-result-link:hover {
    color: var(--link);
}
.helper-initial-hint {
    text-align: center;
    font-weight: 500;
}
.helper-close {
    position: absolute;
    z-index: 1;
    width: 22px;
    height: 22px;
    font-size: 22px;
    top: -11px;
    right: -11px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 11px;
}
.helper-close svg {
    vertical-align: top;
    color: var(--accent);
}
@media (max-width: 400px) {
    .helper {
        width: 300px;
        transform: translate(219px, 0);
    }
    .helper-results {
        height: 220px;
        margin-bottom: 18px;
    }
    .helper-body {
        margin-top: 18px;
    }
}
</style>
