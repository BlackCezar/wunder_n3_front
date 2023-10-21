import mitt from "mitt";
import type { IContract } from "~/types/contract.interface";
import { SystemName } from "~/types/region.interface";
import type { ICustomerCandidate } from "~/types/user.interface";
import type { IAccount } from "~/types/account.interface";

export type ApplicationEvents = {
    "modal:popup-account": {
        accountId: number;
        system: SystemName;
    };
    "modal:edit-documents": void;
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
    "modal-close:edit-client": void;
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
