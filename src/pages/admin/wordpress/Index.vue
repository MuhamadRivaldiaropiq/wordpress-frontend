<script setup>
import { ref, onBeforeMount } from 'vue'
import { RouterLink } from 'vue-router'
import { wordpressStore } from '@/stores/wordpress'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const store = wordpressStore()
const wordpress = ref([])

onBeforeMount(async () => {
    await store.getWordpress()
    wordpress.value = store.wordpress
})
</script>
<template>
    <AuthenticatedLayout title="Wordpress Account">
        <RouterLink
            :to="{ name: 'admin.wordpress.create' }"
            class="bg-secondary-3 px-3 py-2 rounded-lg text-white hover:bg-opacity-90 border shadow-lg">
            Add Wordpress Account
        </RouterLink>
        <div>
            <table class="w-full">
                <thead>
                    <tr>
                        <td>Domain</td>
                        <td>Username</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in wordpress" :key="index">
                        <td>{{ item.domain }}</td>
                        <td>{{ item.username }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AuthenticatedLayout>
</template>
