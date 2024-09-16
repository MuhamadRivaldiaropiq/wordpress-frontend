import axios from '@/lib/axios'
import { defineStore, acceptHMRUpdate } from 'pinia'

const csrf = () => axios.get('/sanctum/csrf-cookie')

export const userStore = defineStore({
    id: 'user',
    state: () => ({
        user: [],
        loading: false,
        error: null,
        singleData: {},
    }),
    getters: {
        allUser: state => state.user,
        isLoading: state => state.loading,
        getError: state => state.error,
    },
    actions: {
        async getUsers() {
            this.loading = true
            try {
                const response = await axios 
                .get(`/api/users`)
                .then(response => {
                    this.user = response.data
                })
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async AddUser(form, setErrors, processing) {
            await csrf()
            processing.value = true
           await axios
            .post(`/api/users`, form)
            .then(response => {
                processing.value = false
                this.user.push(response.data)
                this.router.push({name: 'admin.user.index'})
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors.value = Object.values(
                    error.response.data.errors,
                ).flat()
                processing.value = false
            })
        },
        async getUserById(id) {
            this.loading = true
            try {
                const response = await axios 
                .get(`/api/users/${id}`)
                .then(response => {
                    this.user = response.data
                })
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async UpdateUsers(form, id, setErrors, processing) {
            
            await csrf()
            processing.value = true
            axios
            .post(`/api/users/${id}`, form)
            .then(response => {
                processing.value = false
                this.router.push({name: 'admin.user.index'})
                console.log(response);
                
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors.value = Object.values(
                    error.response.data.errors,
                ).flat()
                processing.value = false
            })
        },
        async Remove(id, setErrors, processing) {
            processing.value = true
            axios
            .delete(`/api/users/${id}`)
            .then(response => {
                processing.value = false
                this.user = this.user.filter(user => user.id !== id);
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors.value = Object.values(
                    error.response.data.errors,
                ).flat()
                processing.value = false
            })
        }
    }
})