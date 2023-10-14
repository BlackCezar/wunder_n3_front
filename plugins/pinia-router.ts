import {Context} from "@nuxt/types";

export default defineNuxtPlugin(({$pinia, $router, $http}: Context) => {
    $pinia.use(({store}) => {
        store.router = $router;
        store.$http = $http
    })
})