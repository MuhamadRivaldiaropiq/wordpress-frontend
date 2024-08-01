import axiosWp from '@/lib/axiosWp'
import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useToken = defineStore('token', {
    state: () => ({
        tokens: {},
        loading: false,
        error: null,
    }),

    getters: {
        getToken: state => state.tokens,
        isLoading: state => state.loading,
        getError: state => state.error,
        hasTokens: state => Object.keys(state.tokens).length > 0,
    },
    actions: {
        async login(username, password, domain, setErrors, processing) {
            processing.value = true
            try {
                const response = await axiosWp.post(
                    `${domain}/wp-json/jwt-auth/v1/token`,
                    {
                        username: username,
                        password: password,
                    },
                )
                processing.value = false
                this.tokens = response.data
            } catch (error) {
                this.tokens = {}
                console.log(error)
                if (error.response && error.response.status === 422) {
                    setErrors.value = Object.values(
                        error.response.data.code,
                    ).flat()
                } else if (error.response && error.response.status === 403) {
                    setErrors.value = Object.values([
                        error.response.data.code,
                    ]).flat()
                } else if (error.code == 'ERR_NETWORK') {
                    setErrors.value = Object.values(['Csrf Error']).flat()
                } else {
                    throw error
                }
                processing.value = false
            }
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useToken, import.meta.hot))
}
