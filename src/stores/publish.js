import axios from '@/lib/axiosWp'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const PublishStore = defineStore({
    id: 'publish',
    state: () => ({
        articles: [],
        loading: false,
        error: null,
    }),
    getters: {
        allArticle: state => state.articles,
        isLoading: state => state.loading,
        getError: state => state.error,
    },
    actions: {
        async addArticles(form, setErrors, processing, domain, token) {
            // console.log(form,setErrors,processing,domain,token);
            processing.value = true
            
            await axios
                .post(`${domain}/wp-json/wp/v2/posts`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    processing.value = false
                    this.articles.push(response.data)
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                    if (error.response && error.response.status === 422) {
                        setErrors.value = Object.values(
                            error.response.data.code,
                        ).flat()
                    } else if (
                        error.response &&
                        error.response.status === 403
                    ) {
                        setErrors.value = Object.values([
                            error.response.data.code,
                        ]).flat()
                    } else {
                        throw error
                    }
                    processing.value = false
                })
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(PublishStore, import.meta.hot))
}
