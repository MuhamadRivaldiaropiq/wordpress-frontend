<script setup>
import { useToken } from '@/stores/token'
import { wordpressStore } from '@/stores/wordpress'
import { ref, computed } from 'vue'
import ValidationErrors from '@/components/ValidationErrors.vue'

const storeToken = useToken()
const storeWordpress = wordpressStore()
const username = ref('ardan')
const password = ref('611525Aa@')
const domain = ref('http://localhost/wordpress')

const token = ref('')
const hasToken = ref(false)

const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const login = async () => {
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
const addWordpress = async () => {
    const formData = new FormData()
    formData.append('domain', domain.value)
    formData.append('username', username.value)
    formData.append('password', password.value)
    formData.append('token', token.value.token)
    await storeWordpress.addWordpress(formData, setErrors, processing)
}
</script>

<template>
    <ValidationErrors class="w-full" :errors="errors" />
    <div class="mx-auto max-w-3xl">
        {{ token }}
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
                <button>Login</button>
            </form>
            <button
                class="border bg-green-500 text-white"
                @click="addWordpress"
                v-if="hasToken">
                Akun dengan email {{ token.user_email }} ditemukan, masukan ke
                database ?
            </button>
        </div>
    </div>
</template>
