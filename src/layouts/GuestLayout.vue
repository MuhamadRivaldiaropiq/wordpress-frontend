<script setup>
import ApplicationLogo from '@/assets/images/logo.png'
</script>

<template>
    <div
        class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 px-5 md:px-0 bg-gray-100">
        <div>
            <router-link to="/">
                <img :src="ApplicationLogo" alt="" />
            </router-link>
        </div>

        <div
            class="w-full sm:max-w-md md:mt-6 px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg">
            <slot />
        </div>
    </div>
</template>
