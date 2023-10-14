<template>
    <div class="admin-customer-documents">
        <div class="local-tabs">
            <div
                class="top-up-tab w-100"
                :class="activeTab === 'bills' && 'active'"
                @click="activeTab = 'bills'"
            >
                {{ $t("EditClient.Bills") }}
            </div>
            <div
                class="top-up-tab w-100"
                :class="activeTab === 'acts' && 'active'"
                @click="activeTab = 'acts'"
            >
                {{ $t("EditClient.Acts") }}
            </div>
        </div>

        <template v-if="isLoading">
            <b-spinner class="mx-auto d-block my-4" variant="ml-3" />
        </template>
        <template v-else>
            <div v-if="activeTab === 'bills'" class="p-4 w-100">
                <h3 style="text-align: center" v-if="bills.length === 0">
                    {{ $t("EditClient.NoBills") }}
                </h3>
                <AdminCustomersModalDocumentsList
                    :list="bills"
                    document-type="bill"
                />
            </div>
            <div v-if="activeTab === 'acts'" class="p-4 w-100">
                <h3 style="text-align: center" v-if="acts.length === 0">
                    {{ $t("EditClient.NoActs") }}
                </h3>
                <AdminCustomerDocumentsList :list="acts" document-type="act" />
            </div>
        </template>
        <AdminCustomerDocumentsEditModal :bills="bills" />
        <b-button
            class="modal-close"
            @click="$bvModal.hide('edit-documents-modal')"
            variant="outline-danger"
            >{{ $t("common.cancel") }}</b-button
        >
    </div>
</template>

<script>
export default {
    name: "AdminCustomerDocuments",
    props: {
        customerId: Number,
    },
    data() {
        return {
            isLoading: false,
            activeTab: "bills",
            totalBills: 0,
            totalActs: 0,
            bills: [],
            acts: [],
        };
    },
    mounted() {
        this.$nuxt.$on("remove", this.removeDocument);
        this.$nuxt.$on("save-document", this.editDocument);
        this.$nuxt.$on("sign-manual", this.signDocument);
        this.$nuxt.$on("generate-act", this.generateAct);
        if (this.$route.query.set_act) this.activeTab = "acts";
    },
    destroyed() {
        this.$off("remove");
        this.$off("generate-act");
        this.$off("sign-manual");
        this.$off("edit");
    },
    methods: {
        async signDocument({ document, cb }) {
            try {
                if (!document.newFile) cb(false);
                else {
                    let formData = new FormData();
                    formData.append("file", document.newFile);
                    const response =
                        await this.$fileService.uploadSignDoc(formData);
                    cb(true, response.filename);
                }
            } catch (err) {
                console.log(err, err.response.data.message);
                if (err.response?.data?.message === "NO_ACTIVE_KEYS") {
                    cb(false, "NO_ACTIVE_KEYS");
                } else cb(false);
            }
        },
        async removeDocument({ document, documentType, cb }) {
            if (documentType === "act") {
                await this.$billService.deleteAct(document.id);
                this.acts = this.acts.filter((act) => act.id !== document.id);
            } else {
                await this.$billService.deleteBill(document.id);
                console.log("Deleted");
                this.acts = this.bills.filter(
                    (act) => act.bill?.id !== document.id,
                );
                console.log("Deleted 2");
                this.bills = this.bills.filter(
                    (bill) => bill.id !== document.id,
                );
                console.log("Deleted 3");
            }
            if (cb) cb();
        },
        async generateAct({ document, cb }) {
            const act = await this.$billService.generateAct(document);
            this.acts.push(act);
            this.bills = this.bills.map((bill) =>
                bill.id === document.id
                    ? {
                          ...bill,
                          isHaveAct: false,
                      }
                    : bill,
            );
            this.totalActs++;
            cb && cb();
        },
        async editDocument({ document, type, cb }) {
            try {
                if (type === "act") {
                    if (document.file) {
                        let formData = new FormData();
                        formData.append("file", document.file);
                        document.link =
                            await this.$fileService.uploadAct(formData);
                    }
                    const act = await this.$billService.updateAct(document);
                    this.acts = this.acts.map((ac) => {
                        return ac.id === act.id ? act : ac;
                    });
                    console.log(document.file);
                } else {
                    if (document.file) {
                        let formData = new FormData();
                        formData.append("file", document.file);
                        document.link =
                            await this.$fileService.uploadBill(formData);
                    }
                    const bill = await this.$billService.updateBill(document);
                    this.bills = this.bills.map((b) => {
                        return b.id === bill.id ? bill : b;
                    });
                }
            } catch (err) {
                this.$bvToast.toast(this.$t("Validation.CheckForm"), {
                    title: this.$t("Validation.Error"),
                    autoHideDelay: 5000,
                    solid: true,
                    variant: "danger",
                });
                console.error(err);
            }
            if (cb) cb();
        },
        async loadBills() {
            const [count, bills] = await this.$billService.getList({
                customerId: this.customerId,
                filters: { limit: 100000, skip: 0 },
            });
            this.totalBills = count;
            this.bills = bills.map((bill) => {
                const act = this.acts.find(
                    (act) => act.bill && act.bill.id === bill.id,
                );
                return {
                    ...bill,
                    isHaveAct: !act,
                };
            });
        },
        async loadActs() {
            const acts = await this.$billService.fetchActs({
                customerId: this.customerId,
                filters: { limit: 100000, skip: 0 },
            });
            this.totalActs = acts[0];
            this.acts = acts[1];
        },
    },
    watch: {
        customerId: {
            immediate: true,
            async handler() {
                this.isLoading = true;
                await this.loadActs();
                await this.loadBills();
                this.isLoading = false;
            },
        },
    },
};
</script>
<style scoped lang="css">
.local-tabs {
    display: flex;
}
@media screen and (max-width: 768px) {
    .local-tabs .top-up-tab {
        padding: 10px;
    }
    .local-tabs h3 {
        font-size: 20px;
    }
}
</style>
