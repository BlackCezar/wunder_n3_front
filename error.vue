<script lang="ts" setup>
defineProps({
    error: Object,
});
</script>

<template>
    <div class="bg-light text-dark vh-100 p-4 flex flex-col">
        <div class="content">
            <div class="d-flex gap-2 flex-column">
                <div class="d-flex gap-2">
                    <span class="fs-1 font-bold">ОШБИКА</span>
                    <span class="fs-1">{{ error?.statusCode }}</span>
                </div>
                <span class="fs-4">{{ error?.url }}</span>
                <span class="fs-4">{{ error?.message }}</span>
                <span class="fs-4" v-html="error?.stack"></span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.error-page {
    padding: 2.62rem 1rem 2.815rem;
    min-height: 100dvh;
    @media (min-width: 1024px) {
        padding: 4rem 4.375rem;
    }
}

.error-page .logo {
    width: 8.5rem;
    height: 2.625rem;
}

.error-page .content {
    padding-top: 3.5rem;
    margin-top: auto;
    @media (min-width: 1024px) {
        display: flex;
        align-items: flex-start;
        gap: 5rem;
        justify-content: flex-start;
    }
}

.error-page .content p {
    margin-bottom: 1.56rem;
    @media (min-width: 1024px) {
        margin-bottom: 4.81em;
    }
}

.error-page .btn-title {
    font-weight: 400;
}

.error-page .product {
    margin-bottom: 3.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.56rem;
}
</style>
