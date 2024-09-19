<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { userStore } from '@/stores/userstore'
import ConfirmDelete from '@/components/ConfirmDelete.vue'
import {
    onBeforeMount,
    ref,
    onMounted,
    onBeforeUnmount,
    computed,
    watchEffect,
} from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const toast = useToast()
const store = userStore()
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
    { key: 'username', title: 'Nama' },
    { key: 'email', title: 'Email' },
    { key: 'level', title: 'Level' },
    { key: 'action', title: 'Action', width: '5px' },
]
const getRoleClass = role => {
    if (role === 'admin') {
        return {
            container:
                'bg-secondary-3 text-secondary-3 px-2 text-sm font-bold rounded-full inline-flex items-center gap-1 bg-opacity-30 capitalize',
            circle: 'w-2 h-2 rounded-full mr-0.5 bg-secondary-3',
        }
    } else if (role === 'user') {
        return {
            container:
                'bg-blue-500 text-blue-500 px-2 text-sm inline-flex font-bold rounded-full items-center gap-1 bg-opacity-30 capitalize',
            circle: 'w-2 h-2 p-1 mr-0.5 rounded-full bg-blue-500',
        }
    }
}
const RemoveUsers = async id => {
    processing.value = true
    try {
        await store.Remove(id, setErrors, processing)
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User Berhasil Dihapus',
            life: 2000,
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User Gagal Dihapus!',
            life: 3000,
        })
        console.error('Error updating user:', error)
    } finally {
        processing.value = false
    }
    fetchData()
}
const UpdateUsers = async id => {
    await router.push({ name: 'admin.user.update', params: { id: id } })
}
watchEffect(() => {
    fetchData()
})
</script>
<template>
    <loading-overlay :active="isloading" :is-full-page="true" loader="dots" color="#06D001" />
    <AuthenticatedLayout title="Users">
        <div v-if="!isloading">
            <div class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
                style="border-radius: 20px 150px 0px 0px">
                <i class="fa-solid fa-bars-staggered text-secondary-3"></i>
                <div class="font-bold text-secondary-3 flex items-center gap-3">
                    Users
                </div>
            </div>
            <div class="bg-typography-1 dark:bg-dark-primary-2 rounded-tr-lg">
                <div class="flex py-6 items-center flex-col-reverse md:flex-row justify-between">
                    <div class="p-6 pb-0 relative">
                        <input type="search" placeholder="search..." v-model="searchQuery"
                            class="h-8 md:w-56 w-full px-8 rounded-lg" />
                        <i class="fa-solid fa-filter absolute top-9 left-9 -translate-y-1 text-gray-500"></i>
                    </div>
                    <div class="px-6 pt-6">
                        <RouterLink :to="{ name: 'admin.user.create' }"
                            class="bg-secondary-3 px-3 py-2 rounded-lg text-typography-1 hover:bg-opacity-90 border shadow-lg">
                            + Add Users
                        </RouterLink>
                    </div>
                </div>
                <v-data-table :items="user" :headers="header" class="px-6">
                    <template v-slot:[`item.level`]="{ item }">
                        <span :class="getRoleClass(item.level).container">
                            <span :class="getRoleClass(item.level).circle"></span>
                            {{ item.level }}
                        </span>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                        <div class="flex gap-3 !text-xs">
                            <button @click="UpdateUsers(item.id)"
                                class="flex gap-2 items-center text-white bg-secondary-3 hover:bg-opacity-90 rounded-lg px-3 py-1">
                                <i class="fa-solid fa-pen"></i>
                                <p>Edit</p>
                            </button>
                            <ConfirmDelete v-if="item.level !== 'admin'" :label="'Delete'" :type="'User'" :id="item.id"
                                :method="RemoveUsers"></ConfirmDelete>
                        </div>
                    </template>
                </v-data-table>
            </div>
        </div>
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
