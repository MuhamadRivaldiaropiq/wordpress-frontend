<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router';
import { userStore } from '@/stores/userstore';
import { useRoute } from 'vue-router'
import LoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const isloading = ref(false)
const route = useRoute()
const router = useRouter()
const store = userStore()
const username = ref('')
const email = ref('')
const password = ref('')
const User = ref('')
const id = computed(() => route.params.id)

const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const Updateusers = async () => {
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('username', username.value)
    formData.append('email', email.value)
    if (password.value) {
        formData.append('password', password.value)
    }
    // const { id } = store.user
    processing.value = true 
    try {
        await store.UpdateUsers(formData, id.value, setErrors, processing)
        toast.add({ severity: 'success', summary: 'Success', detail: 'User Berhasil Diupdate', life: 2000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'User Gagal Diupdate!', life: 3000 });
        console.error('Error updating user:', error);
    } finally {
        processing.value = false;
    }
}

onBeforeMount(async () => {
    isloading.value = true 
    await store.getUserById(id.value)
    User.value = store.user
    isloading.value = false
    fetchData()
})
const fetchData = async () => {
    username.value = User.value?.username || ''
    email.value = User.value?.email || ''
    password.value = ''
}
</script>
<template>
        <loading-overlay :active="isloading" :is-full-page="true" loader="dots" color="#06D001"/>
    <AuthenticatedLayout title="Update User">
        <v-container v-if="!isloading">
            <v-card>
                <!-- {{ username }} -->
                <div class="flex justify-end">
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
                </div>
                <div class="p-5">
                    <form @submit.prevent="Updateusers">
                        <label for="theme"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
                        <input type="text" v-model="username"
                            class="bg-gray-50 border border-gray-300 mb-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                        <label for="theme"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" v-model="email"
                            class="bg-gray-50 border border-gray-300 mb-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                        <button type="submit"
                            class="mt-4 flex gap-3 px-3 py-1 items-center justify-center bg-secondary-3 rounded text-white">
                            <p>Save</p>
                        </button>
                    </form>
                </div>
            </v-card>
        </v-container>
        <Toast />
    </AuthenticatedLayout>
</template>
