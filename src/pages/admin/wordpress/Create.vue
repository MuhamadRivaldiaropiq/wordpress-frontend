<script setup>
import { useToken } from '@/stores/token'
import { wordpressStore } from '@/stores/wordpress'
import { userStore } from '@/stores/userstore'
import { ref, computed, onBeforeMount, watch } from 'vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import ValidationErrors from '@/components/ValidationErrors.vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';

const toast = useToast();
const store = userStore();
const router = useRouter()
const storeToken = useToken()
const storeWordpress = wordpressStore()
// const username = ref('ardan')
// const password = ref('611525Aa@')
// const domain = ref('http://localhost/wordpress')
const username = ref('rivaldi')
const password = ref('AAE#)FKFzvvJrechTK')
const domain = ref('http://contoh.test')
const token = ref('')
const hasToken = ref(false)
const user = ref([])
const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const login = async () => {
    processing.value = true
    await storeToken.login(
        username.value,
        password.value,
        domain.value,
        setErrors,
        processing,
    )
    token.value = storeToken.tokens
    hasToken.value = storeToken.hasTokens
}
// console.log(hasToken.value);

const addWordpress = async () => {
    hasToken.value = false
    const formData = new FormData()
    formData.append('domain', domain.value)
    formData.append('username', username.value)
    formData.append('password', password.value)
    formData.append('token', token.value.token)
    processing.value = true
    try {
        await storeWordpress.addWordpress(formData, setErrors, processing);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Wordpress Berhasil Ditambahkan', life: 2000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal Menambahkan Wordpress!', life: 3000 });
        console.error('Error updating user:', error);
    } finally {
        processing.value = false;
    }
}
const closeDialog = () => {
    hasToken.value = false;
}
// const confirmAction = async () => {
//     hasToken.value = false;
//     await addWordpress()
// }
</script>

<template>
    <AuthenticatedLayout title="Create Wordpress">
        <v-container>
            <v-card>
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
                <ValidationErrors class="w-full" :errors="errors" />
                <div class="p-5">
                    {{ selecteduser }}
                    <div>
                        <form @submit.prevent="login">
                            <div class="flex flex-col gap-1">
                                <label for="">Domain</label>
                                <input type="url" v-model="domain" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label for="">Username</label>
                                <input type="text" v-model="username" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label for="">Password</label>
                                <input type="text" v-model="password" />
                            </div>
                            <button class="px-5 py-1 hover:bg-opacity-90 rounded bg-secondary-3 mt-5">Login</button>

                        </form>
                        <Dialog header="notifikasi" :visible="hasToken"  modal @hide="handleHide">
                            <div class="p-fluid">
                                <h2>{{ token.user_email }}</h2>
                                <h3>Akun ditemukan</h3>
                                <p>Apakah Anda ingin memasukkan akun ke dalam database?</p>
                                <div class="flex gap-2 mt-4">
                                    <button @click="addWordpress"
                                        class="px-4 py-2 bg-green-500 text-white rounded">Ya</button>
                                    <button @click="closeDialog"
                                        class="px-4 py-2 bg-gray-500 text-white rounded">Tidak</button>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </div>
            </v-card>
        </v-container>
        <Toast />
    </AuthenticatedLayout>
</template>
