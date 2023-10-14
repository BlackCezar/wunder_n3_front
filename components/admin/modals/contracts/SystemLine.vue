<template>
  <div v-if="systemCopy">
    <div class="p-3">
      <b-button
          class="mr-auto ms-auto mb-3"
          variant="info"
          @click="addNewLine"
      >
        {{ $t("Settings.addLine") }}
        <IBiPlus/>
      </b-button>
      <b-list-group>
        <b-list-group-item v-for="(line, index) in lines" :key="index">
          <b-form-group
              :invalid-feedback="invalidFeedback"
              :label="$t('Settings.commission') + ' %'"
              :label-for="'line-' + index"
              class="input-container"
              content-cols-lg="9"
              label-align-sm="right"
              label-cols-lg="3"
          >
            <b-form-input
                v-model.number="line.commission"
                :inputId="'line-' + index"
                class="form-input m-0"
                max="100"
                min="0"
                type="number"
            />
          </b-form-group>
          <b-form-group
              :invalid-feedback="invalidFeedback"
              :label="$t('Settings.discount') + ' %'"
              :label-for="'line-discount-' + index"
              class="input-container"
              content-cols-lg="9"
              label-align-sm="right"
              label-cols-lg="3"
          >
            <b-form-input
                v-model.number="line.discount"
                :inputId="'line-discount-' + index"
                class="form-input m-0"
                type="number"
            />
          </b-form-group>
          <b-form-group
              :invalid-feedback="invalidFeedback"
              :label="$t('Settings.distance')"
              :label-for="'line-discount-' + index"
              class="input-container"
              content-cols-lg="9"
              label-align-sm="right"
              label-cols-lg="3"
          >
            <b-input-group>
              <b-form-input
                  v-model.number="line.fromAmount"
                  :inputId="'line-fromAmount-' + index"
                  :placeholder="$t('Settings.fromAmount') + ' %'"
                  class="form-input m-0 mr-1"
                  type="number"
                  width="30"
              />
              <b-form-input
                  v-model.number="line.toAmount"
                  :inputId="'line-toAmount-' + index"
                  :placeholder="$t('Settings.toAmount') + ' %'"
                  class="form-input m-0 mr-1"
                  type="number"
              />
            </b-input-group>
          </b-form-group>
          <b-row>
            <b-col offset-md="3">
              <b-button
                  :disabled="isLoading"
                  variant="danger"
                  @click="removeLine(index)"
              >
                {{ $t("Settings.remove") }}
                <IBiTrash/>
              </b-button>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </div>
    <div class="mt-3">
      <b-button
          class="cancel-btn"
          variant="outline-danger"
          @click="$emit('close')"
      >{{ $t("common.cancel") }}
      </b-button
      >

      <b-button block variant="primary" @click="save">{{
          $t("AccountManagement.Save")
        }}
      </b-button>
    </div>
  </div>
</template>

<script>
import {useContractStore} from "~/store/contracts";

const defaultLine = {
  commission: 3,
  discount: 0,
  fromAmount: 0,
  toAmount: 100,
};

export default {
  name: "AdminSettingsSystemLineModal",
  props: {
    selectedSystem: {
      type: Object,
    },
    isContractSettings: Boolean,
    region: {
      type: Object,
    },
  },
  emits: ["update:selectedSystem", "remove-line", 'close'],
  setup() {
    const contractStore = useContractStore()
    return {
      contractStore
    }
  },
  data() {
    return {
      invalidFeedback: this.$t("registration.PhoneFeedback"),
      systemCopy: null,
      isLoading: false,
    };
  },
  destroyed() {
    this.systemCopy = null;
  },
  methods: {
    save() {
      this.$emit("update:selectedSystem", this.systemCopy);
      this.$emit('close')
    },
    async removeLine(index) {
      const item = this.systemCopy.lines[index];
      if (item && item.id) {
        this.isLoading = true;
        if (this.isContractSettings) {
          await this.contractStore.removeSystemCustomerLine(item)
          this.systemCopy.lines = this.systemCopy.lines.filter(
              (_, i) => i !== index
          );
        } else {
          await this.contractStore.removeSystemLine(item)
          this.systemCopy.lines = this.systemCopy.lines.filter(
              (_, i) => i !== index
          );
        }
        this.$emit("remove-line", {
          line: item,
          system: this.$props.selectedSystem,
        });
        this.isLoading = false;
      } else
        this.systemCopy.lines = this.systemCopy.lines.filter(
            (_, i) => i !== index
        );
    },
    addNewLine() {
      if (!this.systemCopy.lines) this.systemCopy.lines = [];
      this.systemCopy.lines = [
        ...this.systemCopy.lines,
        Object.assign(
            {},
            {
              ...defaultLine,
              systemName: this.systemCopy.systemName,
            }
        ),
      ];
    },
  },
  computed: {
    lines() {
      console.log(this.systemCopy.lines);
      return this.systemCopy.lines ? this.systemCopy.lines : [];
    },
  },
  mounted() {
    if (this.$props.selectedSystem) {
      this.systemCopy = {...this.$props.selectedSystem};
    }
  },
};
</script>
<style scoped>
.cancel-btn, .btn-primary {
  width: 100%;
}
</style>