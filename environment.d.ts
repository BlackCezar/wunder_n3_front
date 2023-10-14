declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number;
            GTM_ID: string;
            SOCKET_HOST: string;
            BACKEND_HOST: string;
            NODE_ENV: "development" | "production";
            DEFAULT_LOCALE: string;
            LOCALE_CODE: string;
            LOCALE_FILE: string;
            LOCALE_DOMAIN: string;
            BROWSER_API_URL: string;
        }
    }
}

export {};
