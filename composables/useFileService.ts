import type { IInvoiceDocument } from "~/types/invoice.interface";

type DocumentTypes = "contracts" | "sign" | "bills" | "acts" | "documents";
export const useFileService = () => {
    const documentsToUploads = ref<
        {
            comment?: string;
            file: File | null;
        }[]
    >([]);
    const { apiClient } = useClient();

    const deleteRemoteContractFile = async (id: string | number) => {
        return apiClient.delete(`/documents/contracts`, {
            query: {
                id,
            },
        });
    };

    const deleteLocalFile = (index: number) => {
        documentsToUploads.value.splice(index, 1);
    };

    const addLocalFile = () => {
        documentsToUploads.value.push({
            comment: "",
            file: null,
        });
    };

    const uploadContractFile = async (data: FormData) => {
        return apiClient.post("/documents/upload/contract", data);
    };

    const uploadSignFile = async (data: FormData, id: string | number) => {
        return apiClient.post("/documents/upload/sign/?regionId=" + id, data);
    };

    const uploadFileToSign = async (data: FormData) => {
        return apiClient.post("/edin/sign", data);
    };

    const uploadAct = async (data: FormData) => {
        return apiClient.post("/invoices/acts/upload/", data);
    };

    const uploadBill = async (data: FormData) => {
        return apiClient.post("/invoices/bill/upload/", data);
    };

    const uploadInvoiceDocument = async (
        file: FileList,
        data: Pick<IInvoiceDocument, "name" | "type" | "invoiceId">,
    ) => {
        const fm = new FormData();
        fm.append("file", file);
        fm.append("type", data.type);
        fm.append("name", data.name);
        fm.append("invoiceId", data.invoiceId.toString());

        return apiClient.post(
            "/invoices/documents/upload?type=" + data.type,
            fm,
        );
    };

    const downloadFile = async (filename: string, type: DocumentTypes) => {
        return apiClient(`/documents/download/${type}/${filename}`, {
            responseType: "blob",
        });
    };

    return {
        deleteRemoteContractFile,
        uploadContractFile,
        toUploads: documentsToUploads,
        uploadAct,
        downloadFile,
        uploadBill,
        uploadFileToSign,
        uploadSignFile,
        uploadInvoiceDocument,
        deleteLocalFile,
        addLocalFile,
    };
};
