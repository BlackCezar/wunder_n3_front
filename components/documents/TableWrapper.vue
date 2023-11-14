<template>
    <div>
        <div class="table-container">
            <b-table
                :busy="isLoading"
                class="my-table"
                sort-icon-left
                :items="items"
                :fields="fields"
            >
                <template #cell(documentType)="data">
                    {{ $t("Documents.BillNumber") }}{{ data.value }}
                    <div v-if="data.item.billClosed" class="textline"></div>
                    <span
                        style="cursor: pointer"
                        :id="`tooltip-${data.item.id}`"
                    >
                        <IBiQuestionCircle />
                    </span>
                    <b-tooltip
                        variant="danger"
                        :target="`tooltip-${data.item.id}`"
                        triggers="hover"
                        placement="bottom"
                    >
                        <template
                            v-if="data.item.contractType === 'STANDARD'"
                            >{{
                                $t("AccountManagement.PublicContract")
                            }}</template
                        >
                        <template v-else>{{
                            $t("AccountManagement.UniqueContract")
                        }}</template>
                    </b-tooltip>
                </template>
                <template #cell(contractType)="data">
                    {{ $t("Documents.AccountNumber")
                    }}{{ data.item.documentType }}
                    <span
                        style="cursor: pointer"
                        :id="`tooltip2-${data.item.id}`"
                    >
                        <IBiQuestionCircle />
                    </span>
                    <b-tooltip
                        variant="danger"
                        :target="`tooltip2-${data.item.id}`"
                        triggers="hover"
                        placement="bottom"
                    >
                        <template v-if="data.value === 'STANDARD'">{{
                            $t("AccountManagement.PublicContract")
                        }}</template>
                        <template v-else>{{
                            $t("AccountManagement.UniqueContract")
                        }}</template>
                    </b-tooltip>
                </template>
                <template #cell(documentEnrolled)="data">
                    <span
                        :id="`tooltip-info-${data.item?.id}`"
                        :class="{ link: !!data.value?.items?.length }"
                    >
                        {{ $t("Documents.watchEnrolled") }}
                    </span>
                    <b-tooltip
                        boundary="viewport"
                        v-if="data.value?.items?.length"
                        class="enrolledTooltip"
                        variant="white"
                        :target="`tooltip-info-${data.item.id}`"
                        triggers="hover"
                        placement="bottom"
                    >
                        <b-table
                            :items="data.value.items"
                            :fields="data.value.fields"
                        />
                    </b-tooltip>
                </template>
                <template #cell(download)="data">
                    <a
                        download
                        target="_blank"
                        :href="data.value"
                        :disabled="data.item.billClosed"
                        v-if="!data.item.type || data.item.type !== 'postpay'"
                        @click.prevent="
                            !data.item.billClosed &&
                                downloadFile(data.value, 'bill')
                        "
                    >
                        {{ $t("Documents.Download") }}
                        <IBiDownload />
                    </a>
                </template>
                <template #cell(downloadDocuments)="data">
                    <template v-for="doc in data.value">
                        <a
                            download
                            :title="doc.comment"
                            @click.prevent="downloadFile(doc.link, 'contract')"
                            target="_blank"
                        >
                            {{ $t("Documents.Download") }}
                            <IBiDownload />
                        </a>
                    </template>
                </template>
                <template #cell(downloadAct)="data">
                    <a
                        target="_blank"
                        :href="data.value"
                        v-if="!data.item.type || data.item.type !== 'postpay'"
                    >
                        {{ $t("Documents.Download") }}
                        <IBiDownload />
                    </a>
                </template>
                <template #cell(hasOriginal)="data">
                    <span v-if="data.value" class="success-text">{{
                        $t("AccountManagement.OriginalSended")
                    }}</span>
                    <span v-else class="danger-text">{{
                        $t("AccountManagement.OriginalNotSended")
                    }}</span>
                </template>
                <template #cell(transfer)="data">
                    <span v-if="data.value.contractType === 'STANDARD'">{{
                        $t("AccountManagement.ComplexService")
                    }}</span>
                    <template v-else>
                        <span
                            class="img-item"
                            v-for="system in data.value.systems"
                        >
                            <img
                                :src="systemsToSmallImg.get(system.systemName)"
                                :alt="system.systemName"
                                :title="system.systemName"
                            />
                        </span>
                    </template>
                </template>
                <template #cell(contractDate)="data">
                    <span v-if="data.item.contractType === 'STANDARD'">{{
                        $t("AccountManagement.OnDemand")
                    }}</span>
                    <span
                        >{{ data.value.startDate }}
                        {{ " - " + data.value.expireDate }}</span
                    >
                </template>
                <template #cell(contractTypeSimple)="data">
                    {{
                        data.value === "STANDARD"
                            ? $t("AccountManagement.PublicContract")
                            : $t("AccountManagement.UniqueContract")
                    }}
                </template>
                <template #cell(contractStatus)="data">
                    <span v-if="data.value" class="success-text"
                        >{{ $t("AccountManagement.Active") }}
                    </span>
                    <span v-else class="danger-text">{{
                        $t("AccountManagement.NotActive")
                    }}</span>
                </template>
                <template #cell(documentLink)="data">
                    <a class="a-link" target="_blank" :href="data.value ?? ''">
                        {{ $t("Documents.Download") }}
                        <IBiDownload />
                    </a>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { systemsToSmallImg } from "~/composables/useSystems";
import { useFileService } from "~/composables/useFileService";

const { downloadFile: fsDownload } = useFileService();

defineProps<{
    isLoading: boolean;
    fields: any[];
    items: any[];
}>();

const downloadFile = async (fileName: string, type: string) => {
    let file = null;
    if (type === "bill") {
        file = await fsDownload(fileName, "bills");
    } else if (type === "act") {
        file = await fsDownload(fileName, "acts");
    } else {
        file = await fsDownload(fileName, "contracts");
    }

    const href = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName); //or any other extension
    document.body.appendChild(link);
    link.click();
};
</script>

<style>
.table-container {
    border-radius: 0 0 5px 5px;
    transition: 0.3s ease;
    padding-bottom: 1em;
}

.table-container .success-text {
    color: var(--green);
}

.table-container .danger-text {
    color: var(--accent);
}

.table-container table th {
    text-align: left;
    background-image: none !important;
}

.table-container table th div {
    position: relative;
    display: inline-block;
}

.table-container td {
    color: var(--paragraphColor);
    padding-left: calc(0.75rem + 0.65em);
}

.table-container .table.b-table > thead > tr > [aria-sort="none"] div::after,
.table.b-table > tfoot > tr > [aria-sort="none"] div::after {
    content: "";
    width: 2em;
    height: 1em;
    font-size: var(--pFontSize);
    line-height: 1;
    background-position: left calc(0.75rem / 2) center;
    background-repeat: no-repeat;
    background-size: 0.65em 1em;
    position: absolute;
    background-image: url('data:image/svg+xml,%3csvg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3e%3cpath d="M6 3L6 21M6 3L10 7M6 3L2 7" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/%3e%3cpath d="M18 21L18 3M18 21L22 17M18 21L14 17" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/%3e%3c/svg%3e');
}

.table-container
    .table.b-table
    > thead
    > tr
    > [aria-sort="descending"]
    div::after,
.table.b-table > tfoot > tr > [aria-sort="descending"] div::after {
    content: "";
    width: 2em;
    height: 1em;
    font-size: var(--pFontSize);
    line-height: 1;
    background-position: left calc(0.75rem / 2) center;
    background-repeat: no-repeat;
    background-size: 0.65em 1em;
    position: absolute;
    background-image: url('data:image/svg+xml,%3csvg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3e%3cpath d="M6 3L6 21M6 3L10 7M6 3L2 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/%3e%3cpath d="M18 21L18 3M18 21L22 17M18 21L14 17" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/%3e%3c/svg%3e');
}

.table-container
    .table.b-table
    > thead
    > tr
    > [aria-sort="ascending"]
    div::after,
.table-container
    .table.b-table
    > tfoot
    > tr
    > [aria-sort="ascending"]
    div::after {
    content: "";
    width: 2em;
    height: 1em;
    font-size: var(--pFontSize);
    line-height: 1;
    background-position: left calc(0.75rem / 2) center;
    background-repeat: no-repeat;
    background-size: 0.65em 1em;
    position: absolute;
    background-image: url('data:image/svg+xml,%3csvg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3e%3cpath d="M6 3L6 21M6 3L10 7M6 3L2 7" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/%3e%3cpath d="M18 21L18 3M18 21L22 17M18 21L14 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/%3e%3c/svg%3e');
}

.table-container .link {
    color: var(--link);
    line-height: 23px;
    font-size: 16px;
    cursor: pointer;
    border-bottom: 1px dotted var(--link);
}

.table-container .link + svg {
    cursor: pointer;
}

.table-container .document-download a {
    color: var(--link);
    cursor: pointer;
    display: flex;
}

.table-container .document-download a svg {
    margin-left: 5px;
    margin-right: 5px;
}

.b-tooltip-white {
    opacity: 1 !important;
}

.b-tooltip-white.arrow::before {
    border-top-color: white !important;
    border-bottom-color: white !important;
}

.b-tooltip-white .tooltip-inner {
    background-color: white;
    box-shadow:
        -6px -6px 15px rgba(204, 185, 185, 0.25),
        6px 6px 15px rgba(204, 185, 185, 0.25);
    padding: 17px 22px;
    max-width: unset;
}

@media screen and (max-width: 768px) {
    .b-tooltip-white .tooltip-inner {
        max-width: 80vw;
        overflow: auto;
        padding: 10px;
    }
}

.b-tooltip-white .tooltip-inner table {
    margin-bottom: 0;
}

.b-tooltip-white .tooltip-inner thead th {
    padding: 0 10px 10px 00px;
    border-top: 0;
}

.b-tooltip-white .tooltip-inner td {
    color: var(--paragraphColor);
}

.img-item img {
    width: 30px;
    margin-right: 5px;
}
</style>
