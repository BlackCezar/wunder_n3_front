import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { ICustomerRole } from "~/types/user.interface";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    const { loggedIn, user } = storeToRefs(authStore);
    console.log("loggedIn", loggedIn.value);
    if (loggedIn.value && user.value) {
        if (user.value.role === ICustomerRole.ADMIN) {
            return true;
        }
        return navigateTo("/accounts");
    }
    return navigateTo("/login");
});
