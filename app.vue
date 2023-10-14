<script setup lang="ts">
useHead({
    title: "Wunder Pay",
    htmlAttrs: {
        lang: "ru",
    },
    meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
});
</script>
<template>
    <div>
        <NuxtLayout>
            <div>
                <NuxtLoadingIndicator />
                <NuxtPage />
            </div>
        </NuxtLayout>
    </div>
</template>
