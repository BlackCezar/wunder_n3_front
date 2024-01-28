<template>
    <div class="admin-customer-contracts-item" v-if="document && document.id">
        <b-icon icon="file-earmark" />
        {{ getDocumentName }}
        <span v-if="documentType === 'act'" class="ml-2">
            <b-icon
                icon="circle-fill"
                v-if="!document.signedDocument"
                color="#dc3545"
            />
            <b-icon
                icon="circle-fill"
                v-else-if="document.signedDocument.status === 'WAITING'"
                color="yellow"
            />
            <b-icon
                icon="circle-fill"
                v-else-if="document.signedDocument.status === 'SIGNED'"
                color="#58c476"
            />
        </span>
        <div class="contract-buttons">
            <b-button
                v-if="documentType === 'bill' && document.isHaveAct"
                @click="generateAct"
                variant="outline-primary"
                :disabled="isLoading"
            >
                <template v-if="isLoading">
                    <span style="margin-right: 5px">{{
                        $t("Documents.GenerateAct")
                    }}</span>
                    <b-spinner small />
                </template>
                <template v-else>
                    <span style="margin-right: 5px">{{
                        $t("Documents.GenerateAct")
                    }}</span>
                    <b-icon icon="file-earmark-post" />
                </template>
            </b-button>
            <a
                v-if="
                    document.signedDocument &&
                    document.signedDocument.fileLink &&
                    document.signedDocument.status === 'SIGNED'
                "
                :href="`/documents/public/edin/${document.signedDocument.fileLink}`"
                target="_blank"
            >
                <b-button variant="outline-primary">
                    <span style="margin-right: 5px">{{
                        $t("Documents.DownloadSignedFile")
                    }}</span>
                    <b-icon icon="download" />
                </b-button>
            </a>
            <a
                :href="`/documents/public/${documentType}s/${document.link}`"
                target="_blank"
            >
                <b-button variant="outline-primary">
                    <span style="margin-right: 5px">{{
                        $t("Documents.Download")
                    }}</span>
                    <b-icon icon="download" />
                </b-button>
            </a>

            <b-button
                @click="$nuxt.$emit('edit', { document, documentType })"
                variant="outline-primary"
            >
                <span style="margin-right: 5px">{{
                    $t("Documents.Change")
                }}</span>
                <b-icon icon="pen" />
            </b-button>
            <b-button
                @click="removeDocument"
                :disabled="isLoading"
                variant="outline-danger"
            >
                <span style="margin-right: 5px">{{
                    $t("Settings.remove")
                }}</span>
                <b-icon icon="trash" />
            </b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminCustomersModalDocumentsListItem",
    props: {
        document: {
            type: Object,
            required: true,
        },
        documentType: String,
    },
    data() {
        return {
            isLoading: false,
        };
    },
    mounted() {
        if (this.$route.query.set_currency) {
            const billId = parseInt(this.$route.query.bill);
            if (
                !isNaN(billId) &&
                this.documentType === "bill" &&
                this.document.id === billId
            ) {
                this.$nuxt.$emit("edit", {
                    document: this.document,
                    documentType: this.documentType,
                });
            }
        } else if (this.$route.query.set_act) {
            const billId = parseInt(this.$route.query.bill);
            if (
                !isNaN(billId) &&
                this.documentType === "act" &&
                this.document.bill &&
                this.document.bill.id === billId
            ) {
                this.$nuxt.$emit("edit", {
                    document: this.document,
                    documentType: this.documentType,
                });
            }
        }
    },

    emits: ["remove", "edit", "generate-act"],
    computed: {
        getDocumentName() {
            if (!this.document) return "";

            if (
                this.document.status === "SIGNED" ||
                this.document.status === "COMPLETED"
            ) {
                return `№${this.document?.invoiceNumber} от ${new Date(
                    this.document.createdAt,
                ).toLocaleDateString()}`;
            }

            return `№${this.document?.invoiceNumber} от ${new Date(
                this.document.createdAt,
            ).toLocaleDateString()}`;
        },
        contractType() {
            return this.contract.contractType === "STANDARD"
                ? this.$t("AccountManagement.Standard")
                : this.$t("AccountManagement.Custom");
        },
        startDate() {
            if (this.contract.startDate) {
                return new Date(this.contract.startDate).toLocaleDateString(
                    this.$i18n.defaultLocale,
                );
            }
            return "";
        },
    },
    methods: {
        removeDocument() {
            this.isLoading = true;
            this.$nuxt.$emit("remove", {
                document: this.document,
                documentType: this.documentType,
                cb: () => {
                    this.isLoading = false;
                },
            });
        },
        generateAct() {
            this.isLoading = true;
            $nuxt.$emit("generate-act", {
                document: this.document,
                cb: () => {
                    this.isLoading = false;
                },
            });
        },
    },
};
</script>

<style scoped lang="css">
.admin-customer-contracts-item {
    display: flex;
    width: 100%;
    align-items: center;
}
@media screen and (max-width: 992px) {
    .admin-customer-contracts-item {
        flex-wrap: wrap;
    }
}
.admin-customer-contracts-item .contract-buttons {
    display: flex;
    margin-left: auto;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    grid-gap: 10px;
}
@media screen and (max-width: 992px) {
    .admin-customer-contracts-item .contract-buttons {
        margin-top: 10px;
    }
}
.admin-customer-contracts-item .contract-buttons > .btn {
    margin-left: var(--elementMargin);
}
.admin-customer-contracts-item .contract-buttons > a {
    margin-left: var(--elementMargin);
}
</style>
