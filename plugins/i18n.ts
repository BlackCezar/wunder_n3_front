import { createI18n } from "vue-i18n";
import ru from "../locales/ru.json";
import by from "../locales/by.json";
import kz from "../locales/kz.json";

export default defineNuxtPlugin(({ vueApp }) => {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: process.env.DEFAULT_LOCALE ?? "by",
        messages: {
            ru,
            by,
            kz,
        },
    });
    vueApp.use(i18n);
    return {
        provide: {
            $t: i18n.global.t,
            t: i18n.global.t,
            locale: i18n.global.locale,
        },
    };
});
