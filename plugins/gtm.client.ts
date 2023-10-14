import { createGtm } from "@gtm-support/vue-gtm";

export default defineNuxtPlugin((nuxtApp) => {
    if (useRuntimeConfig().public.appEnv !== 'production') return

    const runtimeConfig = useRuntimeConfig().public;

    nuxtApp.vueApp.use(
        createGtm({
            id: runtimeConfig.gtmId,
            defer: false,
            compatibility: false,
            enabled: runtimeConfig.gtmEnabled,
            debug: true,
            loadScript: true,
            vueRouter: useRouter(),
            trackOnNextTick: false,
        })
    );
});
