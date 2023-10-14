<template>
    <div class="admin-customers-bill-lines">
        <b-modal
            id="edit-bill-lines"
            ref="edit-bill-lines"
            hide-footer
            hide-header
            @show="setList"
            @hidden="hideBillLinesModal"
        >
            <div class="admin-customers-bill-lines-modal">
                <ValidationObserver
                    v-if="list && list.length"
                    slim
                    tag="form"
                    @submit.prevent="saveBillLinesModal"
                >
                    <div class="admin-customers-bill-lines-modal-wrapper">
                        <div
                            v-for="line of list"
                            :key="line.id"
                            class="admin-customers-bill-lines-modal-line"
                        >
                            <div
                                v-if="line.account && line.account.system"
                                class="admin-customers-bill-lines-modal-img"
                            >
                                <img
                                    :alt="line.account.system.name"
                                    :src="
                                        systemsToImg.get(
                                            line.account.system.name,
                                        )
                                    "
                                />
                            </div>
                            <div
                                class="admin-customers-bill-lines-modal-inputs"
                            >
                                <b-form-group
                                    :label="$t('EditClient.ExpensesAmount')"
                                >
                                    <b-form-input
                                        id="number"
                                        v-model="line.expense"
                                        :placeholder="
                                            $t('EditClient.ExpensesAmount')
                                        "
                                        class="form-input m-0"
                                    />
                                </b-form-group>
                                <b-form-group
                                    :label="$t('EditClient.ClosedAmount')"
                                >
                                    <b-form-input
                                        id="number"
                                        v-model="line.transfered"
                                        :placeholder="
                                            $t('EditClient.ClosedAmount')
                                        "
                                        class="form-input m-0"
                                    />
                                </b-form-group>
                            </div>
                        </div>
                    </div>
                    <b-button
                        class="cancel-btn"
                        variant="outline-danger"
                        @click="$bvModal.hide('edit-bill-lines')"
                    >
                        {{ $t("common.cancel") }}
                    </b-button>

                    <b-button
                        type="submit"
                        block
                        style="height: 59px"
                        variant="danger"
                    >
                        {{ $t("AccountManagement.Save") }}
                    </b-button>
                </ValidationObserver>
            </div>
        </b-modal>
    </div>
</template>

<script>
import systemsToImg from "@/models/systems";

export default {
    name: "AdminCustomersModalDocumentsBillLines",
    props: {
        lines: {
            type: Array,
            required: true,
            default: [],
        },
    },
    data: () => ({
        systemsToImg: systemsToImg,
        list: [],
    }),
    methods: {
        setList() {
            this.list = Array.from(this.lines);
        },
        hideBillLinesModal() {
            this.list = [];
        },
        saveBillLinesModal() {
            this.$emit("save-edit-bill-lines", this.list);
            this.$bvModal.hide("edit-bill-lines");
            this.hideBillLinesModal();
        },
    },
};
</script>

<style lang="css">
.admin-customers-bill-lines-modal {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
}
.admin-customers-bill-lines-modal-wrapper {
    padding: 16px;
}
.admin-customers-bill-lines-modal-line {
    display: grid;
    grid-template-columns: 1fr 2fr;
}
</style>
