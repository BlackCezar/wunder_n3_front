<script lang="ts" setup>
import {useRegionStore} from "~/store/regions";
import {useAuthStore} from "~/store/auth";
import {storeToRefs} from "pinia";

const regionStore = useRegionStore()
const authStore = useAuthStore()

const {globalSettings} = storeToRefs(regionStore)
const {customerCandidate} = storeToRefs(authStore)
const isLoaded = ref<boolean>(false)

onMounted(() => {
    isLoaded.value = true
})

const isCompleted = computed(() => Boolean(customerCandidate.value?.companyEmail))

definePageMeta({
    layout: 'signup'
})
</script>
<template>
    <div class="sign-in-form-card last">
        <div v-if="isLoaded && customerCandidate" class="form-card-body">
            <h1>Регистрация аккаунта</h1>
            <p>
                Добрый день, <i>{{ customerCandidate?.companyName }}!</i>
            </p>
            <p v-if="isCompleted">
                Мы проверим указанные данные и активируем ваш личный кабинет. Ожидайте
                письмо с доступами на указанной почте.
            </p>
            <p v-else>
                Благодарим Вас за регистрацию в системе <b>Wunder Pay</b>. Для
                получения доступа к личному кабинету необходимо
                <a :href="`/auth/onboarding`"
                >завершить процедуру регистрации</a>.
            </p>
            <p>
                Если у вас есть вопросы по услуге, то
                <nuxt-link :to="globalSettings?.telegramLink">свяжитесь с нами.</nuxt-link>
            </p>
            <p>
                ----<br/>
                С уважением, команда Wunder Pay.
            </p>
        </div>
        <div v-else class="form-card-body">
            <BSpinner class="mx-auto d-block"/>
        </div>
    </div>
</template>