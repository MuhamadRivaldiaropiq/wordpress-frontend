<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { wordpressStore } from '@/stores/wordpress'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import ConfirmDelete from '@/components/ConfirmDelete.vue'

const toast = useToast()
const isloading = ref(false)
const store = wordpressStore()
const wordpress = ref([])
const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)
const searchQuery = ref('')

onBeforeMount(async () => {
    isloading.value = true
    await store.getWordpress()
    isloading.value = false
    fetchData()
})
const fetchData = async () => {
    wordpress.value = store.wordpress
}
const Remove = async id => {
    processing.value = true
    try {
        await store.RemoveWp(id, setErrors, processing)
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Wordpress Berhasil Dihapus',
            life: 2000,
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Wordpress Gagal Dihapus!',
            life: 3000,
        })
        console.error('Error updating user:', error)
    } finally {
        processing.value = false
    }
    fetchData()
}
watchEffect(() => {
    fetchData()
})
const header = [
    { key: 'id' },
    { key: 'domain', title: 'Domain' },
    { key: 'username', title: 'Username' },
    { key: 'action', title: 'Action', width: '8px' },
]
</script>
<template>
    <loading-overlay
        :active="isloading"
        :is-full-page="true"
        loader="dots"
        color="#06D001" />
    <AuthenticatedLayout title="List Wordpress Account">
        <div v-if="!isloading">
            <div
                class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
                style="border-radius: 20px 150px 0px 0px">
                <i class="fa-solid fa-bars-staggered text-secondary-3"></i>
                <div class="font-bold text-secondary-3 flex items-center gap-3">
                    Wordpress
                </div>
            </div>
            <div
                class="bg-typography-1 dark:bg-dark-primary-2 rounded-lg rounded-tl-none shadow-lg">
                <div class="flex flex-col-reverse md:flex-row justify-between">
                    <div class="p-6 pb-0 relative">
                        <input
                            type="search"
                            placeholder="search..."
                            v-model="searchQuery"
                            class="h-8 md:w-56 w-full px-8 rounded-lg" />
                        <i
                            class="fa-solid fa-filter absolute top-9 left-9 -translate-y-1 text-gray-500"></i>
                    </div>
                    <div class="px-6 pt-6">
                        <RouterLink
                            :to="{ name: 'admin.wordpress.create' }"
                            class="bg-secondary-3 px-3 py-2 rounded-lg text-typography-1 hover:bg-opacity-90 border shadow-lg">
                            + Add Wordpress
                        </RouterLink>
                    </div>
                </div>
                <div class="p-6">
                    <v-data-table
                        :items="wordpress"
                        :headers="header"
                        :search="searchQuery">
                        <template v-slot:[`header.id`]="{ column }">
                            <v-icon class="mr-2"
                                ><i
                                    class="fa-solid fa-square-check text-secondary-3"></i
                            ></v-icon>
                            {{ column.text }}
                        </template>
                        <template v-slot:[`item.id`]="{ item }">
                            <input
                                type="checkbox"
                                :value="item"
                                v-model="selectedItem"
                                :disabled="item.status == 'publish'" />
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                            <div class="flex gap-1">
                                <ConfirmDelete
                                    :label="'Delete'"
                                    :type="'Wordpress'"
                                    :id="item.id"
                                    :method="Remove"></ConfirmDelete>
                            </div>
                        </template>
                    </v-data-table>
                </div>
            </div>
        </div>
        <Toast />
    </AuthenticatedLayout>
</template>
