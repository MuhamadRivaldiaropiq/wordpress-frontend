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
                    .get('/api/wordpress')
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
            axios
                .post('/api/wordpress', form)
                .then(response => {
                    processing.value = false
                    console.log(response)
                    this.wordpress.push(response.data)
                    this.router.push({ name: 'admin.wordpress.index' })
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
        async productById(slug, id) {
            this.loading = true
            try {
                const response = await axios.get(`/api/product/${slug}/${id}`)
                if (response.status === 200) {
                    this.singleData = response.data
                } else {
                    this.singleData = {}
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    this.singleData = {}
                } else {
                    this.error = error
                }
            } finally {
                this.loading = false
            }
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
        async deleteProduct(id, processing) {
            await csrf()
            processing.value = true
            try {
                const response = await axios.delete(`/api/product/${id}`)
                console.log(response)
                processing.value = false
            } catch (error) {
                this.error = error
                console.log(this.error)
                processing.value = false
            } finally {
                processing.value = false
            }
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(wordpressStore, import.meta.hot))
}
