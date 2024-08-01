<script setup>
import { useToken } from '@/stores/token'
import { ref, computed } from 'vue'
import ValidationErrors from '@/components/ValidationErrors.vue'

const store = useToken()
const username = ref('')
const password = ref('')

const token = ref('')

const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const login = async () => {
    await store.login(username.value, password.value, setErrors, processing)
    token.value = store.tokens
}
</script>

<template>
    <ValidationErrors class="w-full" :errors="errors" />
    <div>
        <form @submit.prevent="login">
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
        {{ token }}
    </div>
</template>
