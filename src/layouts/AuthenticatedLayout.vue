<script setup>
import { ref, watchEffect, provide, onBeforeMount } from 'vue'
import Navigation from '@/components/AdminNavigation.vue'
import { useUsers } from '@/stores/user'

const store = useUsers()
const props = defineProps({
    title: String,
})

onBeforeMount(() => {
    if (!store.hasUserData) {
        store.getData()
    }
})
const isDark = ref(localStorage.getItem('isDark') === 'true')
watchEffect(() => {
    localStorage.setItem('isDark', isDark.value)
})

const toggleDarkMode = () => {
    isDark.value = !isDark.value
}
const rail = ref(false)
provide('rail', rail)
</script>
<template>
    <v-app
        class="!bg-light-primary-2 dark:!bg-dark-primary-1 font-inter !transition-colors !duration-500"
        :class="isDark ? 'dark' : ''">
        <Navigation />
        <v-main>
            <v-container class="!py-0 !max-w-none">
                <div class="py-5 px-10">
                    <div class="w-full flex justify-between items-center mb-5">
                        <p
                            class="text-2xl font-bold dark:font-medium text-ezzora-900 dark:text-white">
                            {{ title }}
                        </p>
                        <div class="flex gap-10 items-center">
                            <div class="flex justify-center gap-2 items-center">
                                <i
                                    class="fa-light fa-sun-bright text-gray-900 dark:text-gray-600"></i>
                                <div id="page">
                                    <input
                                        @click="toggleDarkMode"
                                        type="checkbox"
                                        id="theme-toggle"
                                        v-model="isDark" />
                                    <label for="theme-toggle"
                                        ><span></span
                                    ></label>
                                </div>
                                <i
                                    class="fa-light fa-moon text-gray-300 dark:text-white"></i>
                            </div>
                            <div class="flex gap-3 items-center">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP3jfOPCgGScFht2teS6zF4P3_NFVrfe1IhQ&s"
                                    class="rounded-full h-10 border w-10 object-cover"
                                    alt="" />
                                <p class="text-sm dark:text-typography-2">
                                    {{ store.userData.name }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <slot />
                </div>
            </v-container>
        </v-main>
    </v-app>
</template>
