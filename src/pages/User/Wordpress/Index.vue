<script setup>
import { ref, onBeforeMount } from 'vue'
import { RouterLink } from 'vue-router'
import { wordpressStore } from '@/stores/wordpress'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import LoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const store = wordpressStore()
const wordpress = ref([])
const isloading = ref(false)
const searchQuery = ref ([])

onBeforeMount(async () => {
    isloading.value = true
    await store.getWordpress()
    wordpress.value = store.wordpress
    isloading.value = false 
})
const header = [
    { key: 'domain', title: 'Domain' },
    { key: 'username', title: 'Username' },
    { key: 'action', title: 'Action' },
]
</script>
<template>
    <AuthenticatedLayout title="">
        <loading-overlay :active="isloading" loader="dots" color="#06D001" />
        <v-container v-if="!isloading">
            <div>
                <div class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
          style="border-radius: 20px 150px 0px 0px;">
          <i class="fa-solid fa-bars-staggered text-secondary-3"></i>
          <div class="font-bold text-secondary-3 flex items-center gap-3">wordpress</div>
        </div>
        <div class="bg-typography-1 dark:bg-dark-primary-2 rounded-tr-lg">
            <div class="flex justify-between rounded-tl-lg">
              <div class="p-6 relative">
                <input type="search" placeholder="search..." v-model="searchQuery" class="h-8 w-56 px-8 rounded-full">
                <i class="fa-solid fa-filter absolute top-9 left-9  -translate-y-1 text-gray-500"></i>
              </div>
            </div>
                <v-data-table :items="wordpress" :headers="header" :search="searchQuery"> 
                    <template v-slot:[`item.action`]="{ item }">
                        <RouterLink :to="{ name: 'user.article.index', params: { id: item.id } }"
                            class="bg-secondary-3 px-5 py-2 text-white rounded-lg hover:bg-opacity-90">Open</RouterLink>
                    </template>
                </v-data-table>
            </div>
            </div>
        </v-container>
    </AuthenticatedLayout>
</template>
