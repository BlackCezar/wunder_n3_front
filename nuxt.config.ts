// https://nuxt.com/docs/configuration/nuxt-config
import svgLoader from "vite-svg-loader";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";

export default defineNuxtConfig({
    css: [
        "~/assets/css/main.css",
        "~/assets/css/ui.css",
    ],
    runtimeConfig: {
        public: {
            gtmId: process.env.GTM_ID,
            gtmEnabled: false,
        },
    },
    nitro: {
        routeRules: {
            '/api/**': {
                proxy:  process.env.BACKEND_HOST + '/api/**',      // 配置你要请求的 API 服务器地址
            }
        }
    },
    vite: {
        server: {
            // С версии 3.7.4 не нужно
            // host: "0.0.0.0",
            // hmr: {
            //     protocol: "wss",
            //     clientPort: 443,
            //     path: "hmr/",
            // }
            //     port: 443,
            //     hmr: {
            //         protocol: 'wss'
            //     },
            //     https: {
            //         key: '/etc/letsencrypt/live/wunder.pwd.by/privkey.pem',
            //         cert: '/etc/letsencrypt/live/wunder.pwd.by/fullchain.pem'
            //     },
        },
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
    // auth: {
    //     globalMiddleware: true,
    //     strategies: {
    //         local: {
    //             scheme: "refresh",
    //             token: {
    //                 property: "access_token",
    //                 maxAge: 60 * 15,
    //                 global: true,
    //                 type: "Bearer",
    //             },
    //             refreshToken: {
    //                 property: "refresh_token",
    //                 data: "refresh_token",
    //                 maxAge: 60 * 60 * 24 * 7,
    //             },
    //             user: {
    //                 property: "",
    //             },
    //             endpoints: {
    //                 login: { url: "/auth/signin", method: "post" },
    //                 refresh: { url: "/auth/refresh", method: "post" },
    //                 user: {
    //                     url: "/auth/me",
    //                     method: "get",
    //                     propertyName: "",
    //                 },
    //                 logout: false,
    //             },
    //             redirect: {
    //                 login: "/login",
    //                 logout: "/login",
    //                 home: "/admin",
    //             },
    //             logoutRedirectUri: "/login",
    //         },
    //     },
    // },
    modules: [
        "@vee-validate/nuxt",
        // "@nuxt-alt/auth",
        [
            "unplugin-icons/nuxt",
            {
                autoInstall: true,
            },
        ],
        "@pinia/nuxt",
        '@pinia-plugin-persistedstate/nuxt',
        "@bootstrap-vue-next/nuxt",
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
          sameSite: 'strict',
        },
        storage: 'cookies'
    },

    // io: {
    // module options
    // sockets: [
    //   {
    //     url: process.env.SOCKET_HOST,
    //     name: "main",
    //     default: true,
    //     namespaces: "main",
    //   },
    // ],
    // },
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
