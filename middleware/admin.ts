import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { IUserRole } from "~/types/user.interface";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const { loggedIn, user } = storeToRefs(authStore);
    if (loggedIn.value) {
        await authStore.getProfile();
        console.log("loggedIn", loggedIn.value, user.value);

        if (user.value?.role === IUserRole.ADMIN) {
            return true;
        } else if (user.value?.role === IUserRole.GROUP) {
            return navigateTo("/groups");
        }
        return navigateTo("/accounts");
    }
    return navigateTo("/login");
});
