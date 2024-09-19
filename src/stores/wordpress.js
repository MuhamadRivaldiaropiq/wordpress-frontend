import axios from '@/lib/axios'
import { defineStore, acceptHMRUpdate } from 'pinia'

const csrf = () => axios.get('/sanctum/csrf-cookie')

export const wordpressStore = defineStore({
    id: 'wordpress',
    state: () => ({
        wordpress: [],
        loading: false,
        error: null,
        singleData: {},
    }),
    getters: {
        allWordpress: state => state.wordpress,
        isLoading: state => state.loading,
        getError: state => state.error,
    },
    actions: {
        async getWordpress() {
            this.loading = true
            try {
                const response = await axios
                    .get(`/api/wordpress`)
                    .then(response => {
                        this.wordpress = response.data
                    })
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async addWordpress(form, setErrors, processing) {
            await csrf()
            processing.value = true
            // const url = import.meta.env.VITE_PUBLIC_BACKEND_URL
            await axios
                .post(`/api/wordpress`, form)
                .then(response => {
                    processing.value = false
                    // console.log(response)
                    this.wordpress.push(response.data)
                    this.router.push({ name: 'wordpress' })
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },
        async editProduct(updateProduct, setErrors, processing, id) {
            await csrf()
            processing.value = true
            axios
                .post(`/api/product/${id}`, updateProduct)
                .then(response => {
                    processing.value = false
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },
        async RemoveWp(id, setErrors, processing) {
            // const url = import.meta.env.VITE_PUBLIC_BACKEND_URL
            processing.value = true
            try {
                const response = await axios.delete(`/api/wordpress/${id}`)
                console.log(response)
                processing.value = false
                this.wordpress = this.wordpress.filter(
                    wordpress => wordpress.id !== id,
                )
            } catch (error) {
                this.error = error
                console.log(this.error)
                processing.value = false
            } finally {
                processing.value = false
            }
        },
        async getWordpressById(id) {
            this.loading = true
            try {
                const response = await axios
                    .get(`/api/wordpress/wordpress-by-id/${id}`)
                    .then(response => {
                        this.wordpress = response.data
                    })
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(wordpressStore, import.meta.hot))
}
