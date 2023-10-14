<template>
  <div>
	<b-modal
		hide-header
		hide-footer
		id="edit-document-modal"
		ref="edit-document-modal"
		@hidden="hideDocumentEditModal"
	>
		<div class="admin-customer-documents-modal">
			<ValidationObserver
				v-if="doc && 'id' in doc"
				tag="form"
				ref="documentObserver"
				slim
				@submit.prevent="saveDocument"
			>
				<div class="top-up-tab active m-auto">
					{{ documentName }}
				</div>
				<div class="p-4 w-100">
					<template v-if="documentType === 'act'">
						<b-form-group
							class="input-container"
							label-cols-lg="3"
							content-cols-lg="9"
							:label="$t('EditClient.Bill')"
							label-align-sm="right"
							label-for="billId"
							:invalid-feedback="invalidFeedback"
						>
							<b-form-select
								id="billId"
								class="form-input m-0"
								v-model="doc.billId"
								:options="billsSelect"
							/>
						</b-form-group>
						<ValidationProvider
							slim
							:rules="{ required: true }"
							v-slot="validationContext"
						>
							<b-form-group
								class="input-container"
								label-cols-lg="3"
								content-cols-lg="9"
								:label="$t('Documents.Number')"
								label-align-sm="right"
								label-for="number"
								:invalid-feedback="invalidFeedback"
							>
								<b-form-input
									id="number"
									class="form-input m-0"
									v-model="doc.bill.number"
								/>
							</b-form-group>
						</ValidationProvider>

						<b-form-group
							class="input-container"
							label-cols-lg="3"
							content-cols-lg="9"
							:label="$t('Documents.IsVisible')"
							label-align-sm="right"
							label-for="isVisible"
							:invalid-feedback="invalidFeedback"
						>
							<b-form-checkbox
								id="isVisible"
								class="m-0"
								v-model="doc.isVisible"
							/>
						</b-form-group>
                        <b-form-group
                            class="input-container"
                            label-cols-lg="3"
                            content-cols-lg="9"
                            :label="$t('Documents.hasOriginal')"
                            label-align-sm="right"
                            label-for="hasOriginal"
                            :invalid-feedback="invalidFeedback"
                        >
                            <b-form-checkbox
                                id="hasOriginal"
                                class="m-0"
                                v-model="doc.hasOriginal"
                            />
                        </b-form-group>
						<b-form-group
							class="input-container"
							label-cols-lg="3"
							content-cols-lg="9"
							:label="$t('Documents.isSigned')"
							label-align-sm="right"
							label-for="isSigned"
							:invalid-feedback="invalidFeedback"
						>
							<b-form-checkbox
								id="isSigned"
								class="m-0"
								v-model="doc.isSigned"
							/>
						</b-form-group>
						<b-form-group
							class="input-container"
							label-cols-lg="3"
							content-cols-lg="9"
							:label="$t('Documents.isClosed')"
							label-align-sm="right"
							label-for="isClosed"
							:invalid-feedback="invalidFeedback"
						>
							<b-form-checkbox
								id="isClosed"
								class="m-0"
								v-model="doc.closed"
							/>
						</b-form-group>
						<b-form-group
							class="input-container"
							label-cols-lg="3"
							content-cols-lg="9"
							:label="$t('Documents.Document')"
							label-align-sm="right"
							label-for="file"
							:invalid-feedback="invalidFeedback"
						>
							<b-form-file
								id="file"
								:placeholder="$t('Documents.ChoseFile')"
								:browse-text="$t('Settings.ChoseFile')"
								class="form-input m-0"
								v-model="doc.file"
							/>
						</b-form-group>

						<b-form-group
							v-if="!doc.isSigned"
							class="input-container"
							label-cols-lg="3"
							content-cols-lg="9"
							:label="$t('Documents.Signedfile')"
							label-align-sm="right"
							label-for="signedfile"
							:invalid-feedback="invalidFeedback"
						>
							<b-form-file
								id="signedfile"
								:placeholder="$t('Documents.ChoseFile')"
								:browse-text="$t('Settings.ChoseFile')"
								class="form-input m-0"
								v-model="doc.signedfile"
							/>
						</b-form-group>
						<b-button
							:disabled="doc.isSigned || isSigning"
							class="col-offet-4"
							type="button"
							@click="signNewFile"
							v-if="!doc.isSigned"
							variant="primary"
							block
						>
							<template v-if="isSigning">
								{{ $t("Documents.SendFileToSign") }}
								<b-spinner variant="white ml-3" />
							</template>
							<template v-else>
								{{ $t("Documents.SendFileToSign") }}
							</template>
						</b-button>
					</template>
					<template v-else>
						<ValidationProvider
							:rules="{ required: true }"
							v-slot="validationContext"
						>
							<b-form-group
								class="input-container"
								label-cols-lg="3"
								content-cols-lg="9"
								:label="$t('Documents.Number')"
								label-align-sm="right"
								label-for="number"
								:invalid-feedback="invalidFeedback"
							>
								<b-form-input
									id="number"
									:state="
										getValidationState(validationContext)
									"
									class="form-input m-0"
									v-model="doc.number"
								/>
							</b-form-group>
						</ValidationProvider>
						<b-form-group
							class="input-container"
							label-cols-lg="3"
							content-cols-lg="9"
							:label="$t('EditClient.Paid')"
							label-align-sm="right"
							label-for="paid"
							:invalid-feedback="invalidFeedback"
						>
							<b-form-checkbox
								id="paid"
								class="m-0"
								v-model="doc.paid"
							/>
						</b-form-group>
						<ValidationProvider
							v-slot="validationContext"
						>
							<b-form-group
								class="input-container"
								label-cols-lg="3"
								content-cols-lg="9"
								:label="$t('Documents.rubRate')"
								label-align-sm="right"
								label-for="rubRate"
								:invalid-feedback="invalidFeedback"
							>
								<b-form-input
									id="rubRate"
                                    type="number"
                                    min="0.00000"
                                    step="0.00001"
									:state="getValidationState(validationContext)"
									class="form-input m-0"
									v-model="doc.rubRate"
								/>
							</b-form-group>
						</ValidationProvider>
						<ValidationProvider
							v-slot="validationContext"
						>
							<b-form-group
								class="input-container"
								label-cols-lg="3"
								content-cols-lg="9"
								:label="$t('Documents.usdRate')"
								label-align-sm="right"
								label-for="usdRate"
								:invalid-feedback="invalidFeedback"
							>
								<b-form-input
									id="usdRate"
                                    type="number"
                                    min="0.00000"
                                    step="0.00001"
									:state="getValidationState(validationContext)"
									class="form-input m-0"
									v-model="doc.usdRate"
								/>
							</b-form-group>
						</ValidationProvider>
						<ValidationProvider
							v-slot="validationContext"
						>
							<b-form-group
								class="input-container"
								label-cols-lg="3"
								content-cols-lg="9"
								:label="$t('Documents.eurRate')"
								label-align-sm="right"
								label-for="eurRate"
								:invalid-feedback="invalidFeedback"
							>
								<b-form-input
									id="eurRate"
                                    min="0.00000"
                                    step="0.00001"
                                    type="number"
									:state="getValidationState(validationContext)"
									class="form-input m-0"
									v-model="doc.eurRate"
								/>
							</b-form-group>
							<b-form-group
								class="input-container"
								label-cols-lg="3"
								content-cols-lg="9"
								:label="$t('Documents.Document')"
								label-align-sm="right"
								label-for="file"
								:invalid-feedback="invalidFeedback"
							>
								<b-form-file
									id="file"
									:placeholder="$t('Documents.ChoseFile')"
									:browse-text="$t('Settings.ChoseFile')"
									class="form-input m-0"
									v-model="doc.file"
								/>
							</b-form-group>
						</ValidationProvider>
					</template>
				</div>
                <b-button @click="$bvModal.show('edit-bill-lines')" class="edit-btn" variant="outline-info">
                    {{ $t("EditClient.EditBillLines") }}
                </b-button>

                <b-button @click="$bvModal.hide('edit-document-modal')" class="cancel-btn" variant="outline-danger">
                    {{ $t("common.cancel") }}
                </b-button>

                <b-button
					style="height: 59px"
					type="submit"
					:disabled="isLoading"
					block
					variant="danger"
				>
					<template v-if="isLoading">
						{{ $t("AccountManagement.Save") }}
						<b-spinner variant="white ml-3" />
					</template>
					<template v-else>
						{{ $t("AccountManagement.Save") }}
					</template>
				</b-button>
			</ValidationObserver>
		</div>
	</b-modal>
    <AdminCustomersModalDocumentsBillLines
        @save-edit-bill-lines="saveBillLines"
        v-if="doc"
        :lines="documentType === 'act' ? doc.bill.lines : doc.lines"
    />
  </div>
</template>

<script>
import {ValidationObserver} from "vee-validate";
import AdminCustomersModalDocumentsBillLines from "./BillLines";

export default {
    name: 'AdminCustomersModalDocumentsEdit',
	props: {
		bills: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			doc: null,
			documentType: "",
			invalidFeedback: this.$t("registration.PhoneFeedback"),
			isLoading: false,
			isSigning: false,
		};
	},
	computed: {
		documentName() {
			if (this.doc) {
				if (this.documentType === "bill")
					return `№${this.doc?.number} от ${new Date(
						this.doc.createdAt
					).toLocaleDateString()}`;
				if (this.documentType === "act")
					return `№${this.doc?.bill.number} от ${new Date(
						this.doc.createdAt
					).toLocaleDateString()}`;
			}
			return "";
		},
		billsSelect() {
			if (this.bills.length === 0 || !this.doc) return [];
			return this.bills.map((bill) => ({
				value: bill.id,
				text: `№${bill?.number} от ${new Date(
					bill.createdAt
				).toLocaleDateString()}`,
			}));
		},
	},
	mounted() {
		this.$nuxt.$on("edit", this.editDocument);
	},
	methods: {
    saveBillLines(list) {
      console.log('list',list)
      this.doc.lines = list.slice()
    },
		saveDocument() {
			this.isLoading = true;
			this.$refs.documentObserver.validate().then((success) => {
				if (success) {
					this.$nuxt.$emit("save-document", {
						document: {
							...this.doc,
							usdRate: this.doc.usdRate
								? parseFloat(this.doc.usdRate)
								: 1,
							rubRate: this.doc.rubRate
								? parseFloat(this.doc.rubRate)
								: 1,
							eurRate: this.doc.eurRate
								? parseFloat(this.doc.eurRate)
								: 1,
						},
						type: this.documentType,
						cb: () => {
							this.isLoading = false;
							this.$bvModal.hide("edit-document-modal");
						},
					});
					console.log("Save");
				} else {
					this.$bvToast.toast(this.$t("Validation.CheckForm"), {
						title: this.$t("Validation.Error"),
						variant: "danger",
					});
					this.isLoading = false;
				}
			});
		},
		signNewFile() {
			this.isSigning = true;
			console.log("Clicked");
			this.$nuxt.$emit("sign-manual", {
				document: {
					...this.doc,
					newFile: this.doc.signedfile,
				},
				cb: (result, msg) => {
					this.isSigning = false;
					if (!result) {
						this.$bvToast.toast(
							msg && msg === "NO_ACTIVE_KEYS"
								? this.$t("Validation.NoActiveKeys")
								: this.$t("Validation.SignDocError"),
							{
								title: this.$t("Validation.Error"),
								variant: "danger",
							}
						);
					} else {
						this.doc.isSigned = true;
						this.doc.signedfile = msg;
						this.$bvToast.toast(
							this.$t("Validation.SignDocSuccess"),
							{
								title: this.$t("Validation.Success"),
							}
						);
					}
				},
			});
		},
		hideDocumentEditModal() {
			this.$bvModal.hide("edit-document-modal");
			this.doc = null;
			this.documentType = "";
		},
		editDocument({ document, documentType }) {
			this.$bvModal.show("edit-document-modal");
			this.doc = { ...document };
			this.documentType = documentType;
		},
		getValidationState({ dirty, validated, valid = null }) {
			return dirty || validated ? valid : null;
		},
	},
	watch: {
		"doc.signedfile": {
			handler() {
				if (this.isSigning) {
					this.isSigning = false;
				}
			},
		},
	},
	components: {AdminCustomersModalDocumentsBillLines, ValidationObserver },
};
</script>

<style>
.admin-customer-documents-modal .invalid-feedback {
	position: absolute;
}

.admin-customer-documents {
	max-height: 95vh;
}

.admin-customer-documents > div:nth-child(2) {
	max-height: calc(95vh - 60px);
	overflow-y: auto;
}
</style>
