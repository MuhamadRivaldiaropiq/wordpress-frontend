<script setup>
import { ref, onBeforeMount } from 'vue'
import { RouterLink } from 'vue-router'
import { wordpressStore } from '@/stores/wordpress'
import { useUsers } from '@/stores/user'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import ConfirmDelete from '@/components/ConfirmDelete.vue'

const stores = useUsers()
const store = wordpressStore()
const wordpress = ref([])
const isloading = ref(false)
const searchQuery = ref([])
const User = ref()

onBeforeMount(async () => {
    isloading.value = true
    await store.getWordpress()
    wordpress.value = store.wordpress
    if (!stores.hasUserData) {
        stores.getData()
    }
    User.value = stores.userData
    isloading.value = false
})
const header = [
    { key: 'domain', title: 'Domain' },
    { key: 'username', title: 'Username' },
    { key: 'action', title: 'Action', width: '20px' },
]
</script>
<template>
    <AuthenticatedLayout title="">
        <loading-overlay :active="isloading" loader="dots" color="#06D001" />
        <v-container v-if="!isloading">
            <!-- {{ User }} -->
            <div>
                <div class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
                    style="border-radius: 20px 150px 0px 0px">
                    <i class="fa-solid fa-bars-staggered text-secondary-3"></i>
                    <div class="font-bold text-secondary-3 flex items-center gap-3">
                        wordpress
                    </div>
                </div>
                <div class="bg-typography-1 dark:bg-dark-primary-2 rounded-tr-lg">
                    <div class="flex py-6 items-center flex-col-reverse md:flex-row justify-between">
                        <div class="p-6 pb-0 relative">
                            <input type="search" placeholder="search..." v-model="searchQuery"
                                class="h-8 md:w-56 w-full px-8 rounded-lg" />
                            <i class="fa-solid fa-filter absolute top-9 left-9 -translate-y-1 text-gray-500"></i>
                        </div>
                        <div class="px-6 pt-6" v-if="User.level == 'admin'">
                            <RouterLink :to="{ name: 'admin.wordpress.create' }"
                                class="bg-secondary-3 px-3 py-2 rounded-lg text-typography-1 hover:bg-opacity-90 border shadow-lg">
                                + Add Wordpress
                            </RouterLink>
                        </div>
                    </div>
                    <v-data-table :items="wordpress" :headers="header" :search="searchQuery" class="px-6">
                        <template v-slot:[`item.action`]="{ item }">
                            <div class="flex gap-2">
                                <RouterLink :to="{
                                    name: 'wordpresss',
                                    params: { id: item.id },
                                }"
                                    class="text-typography-1 bg-secondary-3 hover:bg-opacity-90 rounded-lg px-3 py-1 flex items-center gap-2">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    Open
                                </RouterLink>
                                <ConfirmDelete v-if="User.level == 'admin'" :label="'Delete'" :type="'Wordpress'"
                                    :id="item.id" :method="Remove">
                                </ConfirmDelete>
                            </div>
                        </template>

                    </v-data-table>
                </div>
            </div>
        </v-container>
    </AuthenticatedLayout>
</template>
