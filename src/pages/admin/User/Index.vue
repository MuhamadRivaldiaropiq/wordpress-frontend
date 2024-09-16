<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { userStore } from '@/stores/userstore'
import { onBeforeMount, ref, onMounted,onBeforeUnmount, computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router';
import LoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const store = userStore();
const user = ref([])
const isloading = ref(false)
const dropdownIndex = ref(null)
const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)
const router = useRouter()


onBeforeMount(async () => {
    isloading.value = true
    await store.getUsers()
    isloading.value = false
    fetchData()
  })
  const fetchData = async () => {
    user.value = store.user
}
const header = [
    { key: 'id', title: 'Id' },
    { key: 'username', title: 'Nama' },
    { key: 'email', title: 'Email' },
    { key: 'level', title: 'Level' },
    { key: 'action', title: 'Action', width: '5px' }
]
const getRowClass = (index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
};
const getRoleClass = (role) => {
    if (role === 'admin') {
        return {
           container: 'bg-secondary-3 text-secondary-3 px-2 text-sm font-bold rounded-full inline-flex items-center bg-opacity-30',
            circle: 'w-2 h-2 rounded-full mr-0.5 bg-secondary-3'
        };
    } else if (role === 'user') {
        return {
           container: 'bg-blue-500 text-blue-500 px-2 text-sm inline-flex font-bold rounded-full items-center bg-opacity-30',
            circle: 'w-2 h-2 p-1 mr-0.5 rounded-full bg-blue-500'
        };
    }
};
const RemoveUsers = async (id) => {
  processing.value = true 
  try {
    await store.Remove(id, setErrors, processing)
        toast.add({ severity: 'success', summary: 'Success', detail: 'User Berhasil Dihapus', life: 2000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'User Gagal Dihapus!', life: 3000 });
        console.error('Error updating user:', error);
    } finally {
        processing.value = false;
    }
fetchData();
}
const UpdateUsers = async (id) => {
  await router.push({ name: 'admin.user.update', params: { id: id } })
}
watchEffect(()=>  {
  fetchData();
})
</script>
<template>
    <loading-overlay :active="isloading" :is-full-page="true" loader="dots" color="#06D001"/>
    <AuthenticatedLayout title="Users">
        <v-container v-if="!isloading">
            <div>
                <div class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
          style="border-radius: 20px 150px 0px 0px;">
          <i class="fa-solid fa-bars-staggered text-secondary-3"></i>
          <div class="font-bold text-secondary-3 flex items-center gap-3">Users</div>
        </div>
        <div class="bg-typography-1 dark:bg-dark-primary-2 rounded-tr-lg">
            <div class="flex justify-between rounded-tl-lg">
              <div class="p-6 relative">
                <input type="search" placeholder="search..." v-model="searchQuery" class="h-8 w-56 px-8 rounded-full">
                <i class="fa-solid fa-filter absolute top-9 left-9  -translate-y-1 text-gray-500"></i>
              </div>
              <div class="flex">
                    <svg v-if="processing" role="status"
                        class="inline mr-4 mt-4 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-3"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>
                <div class="p-6">
                  <RouterLink :to="{ name: 'admin.user.create' }"
                    class="bg-secondary-3 px-3 py-2 rounded-lg text-typography-1 hover:bg-opacity-90 border shadow-lg">
                    + Add Users
                  </RouterLink>
                </div>
              </div>
            </div>
                <v-data-table :items="user" :headers="header">
                    <template v-slot:[`header.id`]="{ column }">
          <v-icon class="mr-2"><i class="fa-solid fa-square-check text-secondary-3"></i></v-icon>
          {{ column.text }}
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <input type="checkbox" :value="item" v-model="selectedItem" :disabled="item.status == 'publish'">
        </template>
        <template v-slot:[`item.level`]="{ item }">
          <span :class="getRoleClass(item.level).container">
            <span :class="getRoleClass(item.level).circle"></span>
            {{ item.level }}
          </span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
            <div class="flex gap-1">
                <button @click="UpdateUsers(item.id)" class="p-1 text-md text-typography-1 bg-secondary-3 rounded-md hover:opacity-90">Update</button>
                <button @click="RemoveUsers(item.id)" class="p-1 text-md text-typography-1 bg-red-500 rounded-md hover:opacity-90" :item="item">Remove</button>
            </div>
        </template>
                </v-data-table>
            </div>
            </div>
        </v-container>
        <Toast />
    </AuthenticatedLayout>
</template>
<style>
.even-row {
    background-color: #ffffff;
    /* Light gray background for even rows */
}

.odd-row {
    background-color: #ecfdef;
    /* White background for odd rows */
    /* opacity: 0.8; */
}
</style>