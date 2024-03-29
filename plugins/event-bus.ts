import mitt from "mitt";
import type { IContract } from "~/types/contract.interface";
import { SystemName } from "~/types/region.interface";
import type { ICustomer, ICustomerCandidate } from "~/types/user.interface";
import type { IAccount } from "~/types/account.interface";
import type { IInvoice, IInvoiceLine } from "~/types/invoice.interface";

export type ApplicationEvents = {
    "modal:popup-account": {
        accountId: number;
        system: SystemName;
    } | undefined;
    "modal:edit-documents": {
        id: number;
        customer: ICustomer;
    };
    "modal:edit-invoice": IInvoice;
    "modal:edit-invoice-lines": IInvoiceLine[];
    "modal:edit-invoice:save": IInvoice;
    "modal:edit-client": void;
    "modal:edit-contracts": void;
    "modal:show-customer-candidate": ICustomerCandidate;
    "modal:add-account": void;
    "modal:create-region": void;
    "modal:edit-region": number;
    "modal:edit-contract": { contract: IContract; cb?: () => void };
    "modal:edit-account": {
        accountId: number;
        system: SystemName;
        customerId: number;
    };
    // Close modals
    "modal-close:edit-account": void;
    "modal-close:edit-documents": void;
    "modal-close:edit-contracts": void;
    "modal-close:edit-contract": void;
    "modal-close:edit-client": ICustomer | undefined;
    "modal-close:add-account": void;
    "modal-close:create-region": void;
    "modal-close:edit-region": void;

    "modal:transfer": {
        system: SystemName;
        accountId: number;
    };
    "modal:activate-account": {
        system: SystemName;
        accountId: number;
    };
    // new objects
    "new-account": IAccount;
    'delete:user': number;
    'delete:discount': number;
    'delete:customer-candidate': number;
};

export default defineNuxtPlugin(() => {
    // Then we just inform mitt about our event types
    const emitter = mitt<ApplicationEvents>();

    return {
        provide: {
            event: emitter.emit, // Will emit an event
            listen: emitter.on, // Will register a listener for an event
        },
    };
});
