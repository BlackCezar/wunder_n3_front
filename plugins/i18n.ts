import { createI18n } from "vue-i18n";
import ru from "../locales/ru.json";
import by from "../locales/by.json";
import kz from "../locales/kz.json";

export default defineNuxtPlugin(({ vueApp }) => {
    const runtimeConfig = useRuntimeConfig().public;

    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: runtimeConfig.defaultLocale ?? "by",
        messages: {
            ru,
            by,
            kz,
        },
    });

    console.log("i18n", i18n.global.locale.value, process.env.DEFAULT_LOCALE);
    vueApp.use(i18n);
    return {
        provide: {
            $t: i18n.global.t,
            t: i18n.global.t,
            locale: i18n.global.locale,
        },
    };
});
