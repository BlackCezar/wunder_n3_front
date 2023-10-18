<template>
    <b-form-group class="select-search">
        <div class="select-search-placeholder" @click="openList">
            <span>{{ value ? value.label : getDefault }}</span>
            <ArrowDown />
        </div>
        <div v-if="isOpen" class="select-search-menu" v-click-outside="closeList">
            <div class="select-search-input">
                <b-form-input ref="searchInput" v-model="search" :placeholder="placeholder" />
                <SearchIcon />
            </div>
            <ul class="select-search-list">
                <li v-for="item in filteredItems" @click="() => selectItem(item)" :key="item.key"
                    class="select-search-item">{{ item.label }}</li>
            </ul>
        </div>
        <b-form-invalid-feedback class="form-input-invalid-feedback" id="input-live-feedback">
            {{ getInvalidFeedback }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script>
import SearchIcon from '@/assets/img/search.svg'
import ArrowDown from '@/assets/img/arrow-down.svg'

export default {
    name: 'FormSelectSearch',
    props: {
        placeholder: String,
        inputId: String,
        inputModel: String,
        validation: Object,
        feedback: String,
        default: Object,
        items: Array
    },
    components: {
        SearchIcon, ArrowDown
    },
    data() {
        return {
            value: '',
            isOpen: false,
            search: ''
        }
    },
    computed: {
        getDefault() {
            if (this.$props.default) {
                return this.$props.default.label
            }
            if (this.items && this.items.length) {
                return this.items[0].label
            }
            return null
        },
        getInvalidFeedback() {
            if (this.feedback && this.feedback.length > 0) return this.feedback;
            if (this.inputType === "email") {
                return this.$t("registration.EmailFeedback")
            } else return this.$t("registration.PhoneFeedback")
        },
        getValidationRules() {
            if (this.$props.inputType === "email") {
                return { required: true, email: true }
            } else if (this.$props.inputType === "password") {
                return { required: true, min: 8 }
            } else return { required: true }
        },
        filteredItems() {
            if (this.search) {
                return this.items.filter(item => item.label.search(this.search) !== -1)
            }
            return this.items
        }
    },
    methods: {
        selectItem(value) {
            this.value = value
            this.$emit('update:inputModel', value.key)
            this.isOpen = false
        },
        closeList(ev) {
            console.log(this.$refs.searchInput.$el)
            if (ev.target !== this.$refs.searchInput.$el) {
                if (this.isOpen) this.isOpen = false
            }
        },
        openList(ev) {
            this.isOpen = true
            ev.stopPropagation()
        }
    },
    directives: {
        clickOutside: {
            bind: function (el, binding, vnode) {
                el.clickOutsideEvent = function (event) {
                    if (!(el == event.target || el.contains(event.target))) {
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener('click', el.clickOutsideEvent)
            },
            unbind: function (el) {
                document.body.removeEventListener('click', el.clickOutsideEvent)
            },
        }
    },
}
</script>

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
    box-shadow: -6px -6px 15px rgba(204, 185, 185, 0.25), 6px 6px 15px rgba(204, 185, 185, 0.25);
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

@media (max-width: 768px) {
    .select-search {
        max-width: unset;
        width: 100%;
    }
}</style>