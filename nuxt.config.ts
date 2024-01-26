// https://nuxt.com/docs/configuration/nuxt-config
import svgLoader from "vite-svg-loader";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";

export default defineNuxtConfig({
    css: ["~/assets/css/main.css", "~/assets/css/ui.css"],
    runtimeConfig: {
        public: {
            gtmId: process.env.GTM_ID,
            gtmEnabled: false,
            defaultLocale: process.env.DEFAULT_LOCALE,
        },
    },
    typescript: {
        includeWorkspace: true,
        tsConfig: {
            include: ["../store/*.ts"],
            compilerOptions: {
                lib: ["dom", "esnext"],
                types: [
                    "@types/node",
                    "~/types/*.ts",
                    "@nuxt/types",
                    "vue3-toastify/global",
                    "unplugin-icons/types/vue",
                ],
                paths: {
                    "~/stores/*": ["./stores/*"],
                },
            },
        },
    },
    nitro: {
        routeRules: {
            "/api/**": {
                proxy: process.env.BACKEND_HOST + "/api/**", // 配置你要请求的 API 服务器地址
            },
        },
    },
    vite: {
        plugins: [
            svgLoader(),
            Components({
                resolvers: [IconsResolver()],
            }),
            Icons({
                autoInstall: true,
            }),
        ],
    },
    plugins: [{ src: "~/plugins/toastify.client.ts", mode: "client" }],
    modules: [
        "@vee-validate/nuxt",
        [
            "unplugin-icons/nuxt",
            {
                autoInstall: true,
            },
        ],
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@bootstrap-vue-next/nuxt",
        'nuxt-socket-io',
        [
            "@nuxtjs/google-fonts",
            {
                families: {
                    Jost: [400, 500, 600, 700],
                    download: true,
                    inject: true,
                },
            },
        ],
    ],
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: "strict",
        },
        storage: "cookies",
    },
    io: {
        sockets: [{
            url: process.env.SOCKET_HOST,
            name: 'main',
            default: true,
            namespace: 'main'
        }]
    },
    // i18n: {
    //     strategy: "no_prefix",
    //     langDir: "./locales/",
    //     detectBrowserLanguage: false,
    //     defaultLocale: process.env.DEFAULT_LOCALE,
    //     locales: [
    //         {
    //             code: process.env.LOCALE_CODE,
    //             file: process.env.LOCALE_FILE,
    //             domain: process.env.LOCALE_DOMAIN,
    //         },
    //     ],
    //     differentDomains: false,
    // },
});
