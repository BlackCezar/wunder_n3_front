<script setup lang="ts">
import TableInput from "~/components/ui/TableInput.vue";
import {
    IInvoice,
    InvoiceDocumentType,
    InvoiceDocumentTypeTranslate,
    InvoiceStatusTranslate,
} from "~/types/invoice.interface";
import * as yup from "yup";
import { CURRENCIES } from "~/types/region.interface";

const props = defineProps<{ invoice: IInvoice | null }>();

const { setValues, values, resetForm } = useForm<IInvoice>({
    validationSchema: yup.object().shape({
        invoiceNumber: yup.string().required(),
        currency: yup.string().required(),
        invoiceDocument: yup.array().of(
            yup.object().shape({
                type: yup.string().required(),
                name: yup.string().optional(),
                link: yup.string().optional(),
                file: yup.mixed().optional(),
            }),
        ),
        rates: yup
            .object()
            .shape({
                rubRate: yup.string().optional(),
                usdRate: yup.string().optional(),
                eurRate: yup.string().optional(),
            })
            .default(null),
    }),
    initialValues: props.invoice ?? {},
});

const statusOptions = computed(() => {
    const list = InvoiceStatusTranslate.entries();
    const options = [];
    for (const item of list) {
        options.push({
            value: item[0].toUpperCase(),
            text: item[1],
        });
    }
    return options;
});
const { hide } = useModal();

watch(
    () => props.invoice,
    () => {
        if (props.invoice) {
            setValues(props.invoice);
        }
    },
);

const newDocument = computed(() => {
    if (
        values.invoiceDocument?.find(
            (item) => item.type !== InvoiceDocumentType.BILL,
        )
    )
        return {
            type: InvoiceDocumentType.BILL,
            name: "",
            link: "",
            file: null,
        };
    if (
        values.invoiceDocument?.find(
            (item) => item.type !== InvoiceDocumentType.SIGNED_BILL,
        )
    )
        return {
            type: InvoiceDocumentType.SIGNED_BILL,
            name: "",
            link: "",
            file: null,
        };
    if (
        values.invoiceDocument?.find(
            (item) => item.type !== InvoiceDocumentType.ACT,
        )
    )
        return {
            type: InvoiceDocumentType.ACT,
            name: "",
            link: "",
            file: null,
        };
    return {
        type: InvoiceDocumentType.SIGNED_ACT,
        name: "",
        file: null,
        link: "",
    };
});

const cancelEdit = () => {
    resetForm();
    hide();
};
</script>

<template>
    <div class="invoice-edit-item">
        <div class="invoice-edit-main">
            <BFormGroup label="Основные данные">
                <TableInput
                    name="invoiceNumber"
                    :label="$t('Documents.Number')"
                    type="text"
                />
                <TableInput
                    name="currency"
                    :label="$t('Settings.DefaultCurrency')"
                    type="select"
                    :options="Object.values(CURRENCIES)"
                />
                <TableInput
                    name="status"
                    :label="$t('Invoices.Status')"
                    type="select"
                    :options="statusOptions"
                />
            </BFormGroup>
            <BFormGroup label="Курсы валют">
                <TableInput
                    name="rates.rubRate"
                    :label="$t('Documents.rubRate')"
                    min="0.00000"
                    step="0.00001"
                    type="number"
                />
                <TableInput
                    name="rates.usdRate"
                    :label="$t('Documents.usdRate')"
                    min="0.00000"
                    step="0.00001"
                    type="number"
                />
                <TableInput
                    name="rates.eurRates"
                    :label="$t('Documents.eurRate')"
                    min="0.00000"
                    step="0.00001"
                    type="number"
                />
            </BFormGroup>
        </div>
        <BFormGroup label="Документы">
            <BListGroup>
                <FieldArray
                    name="invoiceDocument"
                    v-slot="{ push, remove, fields }"
                >
                    <BListGroupItem v-for="(item, idx) of fields" :key="idx">
                        <div class="invoice-document">
                            <Field
                                :name="`invoiceDocument[${idx}].type`"
                                v-slot="{ value, handleChange }"
                            >
                                <BDropdown
                                    split
                                    split-variant="outline-primary"
                                    variant="primary"
                                >
                                    <template #button-content>
                                        <span class="invoice-document-type">{{
                                            InvoiceDocumentTypeTranslate.get(
                                                value.toUpperCase(),
                                            )
                                        }}</span>
                                    </template>
                                    <BDropdownItem
                                        v-for="docType of InvoiceDocumentTypeTranslate.entries()"
                                        :key="docType[0]"
                                        @click="handleChange(docType[0])"
                                    >
                                        {{ docType[1] }}
                                    </BDropdownItem>
                                </BDropdown>
                            </Field>
                            <Field
                                type="input"
                                :placeholder="$t('Invoices.DocumentName')"
                                :name="`invoiceDocument[${idx}].name`"
                                class="form-control"
                            />
                            <Field
                                :name="`invoiceDocument[${idx}].file`"
                                v-slot="{ handleChange, handleBlur }"
                                :placeholder="$t('Invoices.DocumentLink')"
                            >
                                <b-form-file
                                    @change="handleChange"
                                    @blur="handleBlur"
                                />
                            </Field>
                            <BLink
                                class="invoice-document-link"
                                v-if="item.value?.link"
                            >
                                <IBiDownload />
                            </BLink>
                            <BButton
                                class="invoice-document-remove"
                                variant="outline-danger"
                                @click="remove(idx)"
                                ><IBiTrash
                            /></BButton>
                        </div>
                    </BListGroupItem>
                    <BButton
                        variant="outline-secondary"
                        @click="push(newDocument)"
                        ><span>{{ $t("Documents.AddDocument") }}</span
                        ><IBiPlus
                    /></BButton>
                </FieldArray>
            </BListGroup>
        </BFormGroup>
        <div class="invoice-edit-main">
            <BRow>
                <BCol lg="3">
                    <span class="w-100 d-block text-sm-right"
                        >Ссылка на PF</span
                    >
                </BCol>
                <BCol lg="9">
                    <BLink
                        v-if="invoice?.taskId"
                        target="_blank"
                        :href="`https://wunder-digital.planfix.ru/task/${invoice.taskId}`"
                        class="d-flex gap-1 align-items-center"
                    >
                        <span>Открыть</span> <IBiBoxArrowUpRight />
                    </BLink>
                </BCol>
            </BRow>
            <BRow>
                <BCol lg="3">
                    <span class="w-100 d-block text-sm-right">Позиции</span>
                </BCol>
                <BCol lg="9">
                    <BButton variant="outline-primary" @click="">
                        <span>
                            {{ $t("EditClient.EditBillLines") }}
                        </span>
                    </BButton>
                </BCol>
            </BRow>
        </div>
        <div class="d-flex mt-3">
            <BButton variant="outline-danger" @click="cancelEdit">
                <span>
                    {{ $t("common.cancel") }}
                </span>
            </BButton>
            <BButton variant="danger"
                ><span>
                    {{ $t("Settings.Save") }}
                </span></BButton
            >
        </div>
    </div>
</template>

<style lang="css">
.invoice-edit-item {
    min-width: 100vw;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
@media (min-width: 500px) {
    .invoice-edit-item {
        min-width: 500px;
    }
}
#edit-invoice .modal-header h3 {
    text-align: center;
    width: 100%;
}
.invoice-document {
    display: grid;
    align-items: center;
    gap: 0.25rem;
    grid-template-columns: 1fr 1fr;
}
.invoice-edit-main {
    display: grid;
    grid-template-columns: 1fr;
    align-items: start;
}

.invoice-document .badge {
    text-wrap: normal;
}
.invoice-document-type {
    font-size: 0.75rem;
}
.invoice-document .dropdown-toggle-split {
    width: 50px;
}
.invoice-document-link,
.invoice-document-remove {
    padding-left: 0;
    padding-right: 0;
    grid-row-start: 3;
    margin-left: auto;
}
.invoice-document-link svg,
.invoice-document-remove svg {
    min-width: 20px;
}
.invoice-document input[type="file"] {
    grid-row-start: 2;
    grid-column: 2 span;
}

@media screen and (min-width: 1024px) {
    .invoice-document-link,
    .invoice-document-remove {
        grid-row-start: auto;
    }
    .invoice-document input[type="file"] {
        grid-row-start: auto;
        grid-column: auto;
    }
    .invoice-edit-main {
        grid-template-columns: 1fr 1fr;
    }
    .invoice-document {
        grid-template-columns: 150px 1fr 1fr 26px 26px;
        gap: 1rem;
    }
    .invoice-edit-item {
        row-gap: 2rem;
    }
}
</style>
