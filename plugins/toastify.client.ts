import Vue3Toastify, {toast} from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { Router } from "vue-router";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Vue3Toastify, {
        autoClose: 3000
    })

    return {
        provide: {toast}
    }
})

interface PluginInjections {
    $toast: typeof toast
}

declare module '#app' {
    interface NuxtApp extends PluginInjections {}
}
declare module 'nuxt/dist/app/nuxt' {
    interface NuxtApp extends PluginInjections {}
}
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends PluginInjections {}
}