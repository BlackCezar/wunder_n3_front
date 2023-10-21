import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { ICustomerRole } from "~/types/user.interface";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const { loggedIn, user } = storeToRefs(authStore);
    if (loggedIn.value) {
        await authStore.getProfile();
        console.log("loggedIn", loggedIn.value, user.value);

        if (user.value?.role === ICustomerRole.ADMIN) {
            return true;
        }
        return navigateTo("/accounts");
    }
    return navigateTo("/login");
});
