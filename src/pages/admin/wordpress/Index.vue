<script setup>
import { ref, onBeforeMount, onBeforeUnmount, computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { wordpressStore } from '@/stores/wordpress'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import LoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const isloading = ref(false)
const store = wordpressStore()
const wordpress = ref([])
const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

onBeforeMount(async () => {
    isloading.value = true 
    await store.getWordpress()
    isloading.value = false
    fetchData();
  })
  const fetchData = async () => {
  wordpress.value = store.wordpress
}
const Remove = async (id) => {
  processing.value = true 
  try {
    await store.RemoveWp(id, setErrors, processing)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Wordpress Berhasil Dihapus', life: 2000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Wordpress Gagal Dihapus!', life: 3000 });
    console.error('Error updating user:', error);
  } finally {
    processing.value = false;
  }
  fetchData();
}
// watchEffect (()=> {
//   fetchData();
// })
const header = [
    { key: 'id' },
    { key: 'domain', title: 'Domain' },
    { key: 'username', title: 'Username' },
    { key: 'action',  title: 'Action', width: '8px' },
]
</script>
<template>
    <loading-overlay :active="isloading" :is-full-page="true" loader="dots" color="#06D001"/>
    <AuthenticatedLayout title="Wordpress Account">
        <v-container v-if="!isloading">
            <div>
                <div class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
          style="border-radius: 20px 150px 0px 0px;">
          <i class="fa-solid fa-bars-staggered text-secondary-3"></i>
          <div class="font-bold text-secondary-3 flex items-center gap-3">Wordpress</div>
        </div>
        <div class="bg-typography-1 dark:bg-dark-primary-2 rounded-tr-lg">
            <div class="flex justify-between rounded-tl-lg">
              <div class="p-6 relative">
                <input type="search" placeholder="search..." v-model="searchQuery" class="h-8 w-56 px-8 rounded-full">
                <i class="fa-solid fa-filter absolute top-9 left-9  -translate-y-1 text-gray-500"></i>
              </div>
              <div>
                <div class="p-6">
                  <RouterLink :to="{ name: 'admin.wordpress.create' }"
                    class="bg-secondary-3 px-3 py-2 rounded-lg text-typography-1 hover:bg-opacity-90 border shadow-lg">
                    + Add Wordpress
                  </RouterLink>
                </div>
              </div>
            </div>
                <v-data-table :items="wordpress" :headers="header">
                    <template v-slot:[`header.id`]="{ column }">
          <v-icon class="mr-2"><i class="fa-solid fa-square-check text-secondary-3"></i></v-icon>
          {{ column.text }}
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <input type="checkbox" :value="item" v-model="selectedItem" :disabled="item.status == 'publish'">
        </template>
        <template v-slot:[`item.action`]="{ item }">
            <div class="flex gap-1">
                <button @click="Remove(item.id)" class="p-1 text-md text-typography-1 bg-red-500 rounded-md hover:opacity-90">Remove</button>
            </div>
        </template>
                </v-data-table>
            </div>
            </div>
        </v-container>
        <Toast/>
    </AuthenticatedLayout>
</template>
