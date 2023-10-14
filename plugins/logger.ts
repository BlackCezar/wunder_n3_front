import { createLogger } from 'vue-logger-plugin'

export default defineNuxtPlugin((nuxt) => {
    const logger = createLogger({
        enabled: true,
        callerInfo: true,
        level: 'debug',
    })

    nuxt.vueApp.use(logger)
})