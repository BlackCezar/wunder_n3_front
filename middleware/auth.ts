import { storeToRefs } from "pinia"
import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    const {loggedIn} = storeToRefs(authStore)

    if (!loggedIn.value) {
        return navigateTo('/login')
    }
})