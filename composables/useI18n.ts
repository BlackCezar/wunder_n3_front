export const useI18n = () => {
    const app = useNuxtApp();
    return {
        t: app.$$t,
        locale: app.$locale,
    };
};
