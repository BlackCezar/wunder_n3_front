import {Context} from "@nuxt/types";
import { Router } from "vue-router";

export default defineNuxtPlugin(({$pinia, $router, $http}: Context) => {
    $pinia.use(({store}) => {
        store.router = $router;
        store.$http = $http
    })
})

interface PluginInjections {
    $router: Router
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