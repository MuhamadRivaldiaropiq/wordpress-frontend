import axios from '@/lib/axios'
import axiosWp from '@/lib/axiosWp'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useToken } from '@/stores/token'
import { ref } from 'vue'

const csrf = () => axios.get('/sanctum/csrf-cookie')

export const useArticleStore = defineStore({
    id: 'article',
    state: () => ({
        articles: [],
        Tags: [],
        Category: [],
        Media: [],
        tokens: null,
        loading: false,
        error: null,
    }),
    getters: {
        allArticle: state => state.articles,
        isLoading: state => state.loading,
        getError: state => state.error,
    },
    actions: {
        async getArticleByDomain(wordpress, totalPages, total) {
            this.loading = true
            try {
                const response = await axiosWp
                    .get(`${wordpress.domain}/wp-json/wp/v2/posts`, {
                        params: { status: 'any' },
                        headers: {
                            Authorization: `Bearer ${wordpress.token}`,
                        },
                    })
                    .then(response => {
                        totalPages.value =
                            response.headers.get('X-WP-TotalPages')
                        total.value = response.headers.get('X-WP-Total')

                        this.articles = response.data
                    })
            } catch (error) {
                console.log(error)

                if (error.response.data.message == 'Expired token') {
                    this.refreshToken(wordpress)
                    console.log(error.response.data.data.status)
                }
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async refreshToken(wordpress) {
            // const tokenStore = useToken()
            try {
                const response = await axiosWp.post(
                    `${wordpress.domain}/wp-json/jwt-auth/v1/token`,
                    {
                        username: wordpress.username,
                        password: '42VWNJ&**d$XR5tAyi',
                    },
                )
                // processing.value = false
                console.log('token sucses')
                this.tokens = response.data
                // console.log(this.tokens);
                this.UpdateTokenWordpress(wordpress)
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
                // processing.value = false
                // console.log(Media);
            }
        },
        async UpdateTokenWordpress(wordpress) {
            // console.log(wordpress.id);
            const formData = new FormData()
            formData.append('_method', 'PUT')
            formData.append('token', this.tokens.token)
            // console.log(this.tokens.token);

            axios
                .post(`/api/wordpress/${wordpress.id}`, formData)
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error
                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                })
        },
        async PublishArticles(form, setErrors, processing, domain, token) {
            processing.value = true
            const Tags = form.getAll('tagName[]')
            const Categorys = form.getAll('name_category[]')
            if (Tags) {
                for (const tag of Tags) {
                    let TagExists = false
                    const response = await axiosWp.get(
                        `${domain}/wp-json/wp/v2/tags`,
                        {
                            params: { search: tag },
                        },
                    )
                    for (const data of response.data) {
                        if (data.name === tag) {
                            const TagId = parseInt(data.id)
                            form.append('tags[]', TagId)
                            TagExists = true
                            break
                        }
                    }
                    if (!TagExists) {
                        const Createresponse = await axiosWp.post(
                            `${domain}/wp-json/wp/v2/tags`,
                            {
                                name: tag,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        const newTagId = parseInt(Createresponse.data.id)
                        form.append('tags[]', newTagId)
                    }
                }
            }
            if (Categorys) {
                for (const Category of Categorys) {
                    let CategoryExists = false
                    const response = await axiosWp.get(
                        `${domain}/wp-json/wp/v2/categories`,
                        {
                            params: { search: Category },
                        },
                    )
                    for (const data of response.data) {
                        if (data.name === Category) {
                            const CategoryId = parseInt(data.id)
                            form.append('categories[]', CategoryId)
                            CategoryExists = true
                            break
                        }
                    }
                    if (!CategoryExists) {
                        const Createsresponse = await axiosWp.post(
                            `${domain}/wp-json/wp/v2/categories`,
                            {
                                name: Category,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        const newCategoryId = parseInt(Createsresponse.data.id)
                        form.append('categories[]', newCategoryId)
                    }
                }
            }

            await axiosWp
                .post(`${domain}/wp-json/wp/v2/posts`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    for (let [key, value] of form) {
                        console.log(`${key}: ${value}`)
                    }
                    processing.value = false
                    console.log(response)
                    this.router.push({ name: 'user.article.index' })
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
        async changeStatus(form, setErrors, processing, domain, token, id) {
            processing.value = true
            await axiosWp
                .post(`${domain}/wp-json/wp/v2/posts/${id}`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    console.log(response)
                    processing.value = false
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
        async getTagsbyDomain(domain) {
            this.loading = true
            try {
                const response = await axiosWp
                    .get(`${domain}/wp-json/wp/v2/tags`)
                    .then(response => {
                        this.Tags = response.data
                    })
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async getArticleById(id, domain, token) {
            // console.log(wordpress.token);
            this.loading = true
            try {
                const response = await axiosWp.get(
                    `${domain}/wp-json/wp/v2/posts/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                this.articles = response.data
                // console.log(response);
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async getCategoryByDomain(domain) {
            this.loading = true
            try {
                const response = await axiosWp
                    .get(`${domain}/wp-json/wp/v2/categories`)
                    .then(response => {
                        this.Category = response.data
                    })
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async getMediaByDomain(domain) {
            this.loading = true
            try {
                const response = await axiosWp
                    .get(`${domain}/wp-json/wp/v2/media`)
                    .then(response => {
                        this.Media = response.data
                    })
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }
        },
        async RemoveArticle(id, domain, token, setErrors, processing) {
            this.loading = true
            processing.value = true
            await axiosWp
                .delete(`${domain}/wp-json/wp/v2/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    // for (let [key, value] of form) {
                    //     console.log(`${key}: ${value}`)
                    // }
                    processing.value = false
                    this.articles = this.articles.filter(
                        articles => articles.id !== id,
                    )
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
        async UpdateArticles(form, setErrors, processing, domain, token, id) {
            processing.value = true
            const Tags = form.getAll('tagName[]')
            const Categorys = form.getAll('name_category[]')
            if (Tags) {
                for (const tag of Tags) {
                    let TagExists = false
                    const response = await axiosWp.get(
                        `${domain}/wp-json/wp/v2/tags`,
                        {
                            params: { search: tag },
                        },
                    )
                    for (const data of response.data) {
                        if (data.name === tag) {
                            const TagId = parseInt(data.id)
                            form.append('tags[]', TagId)
                            TagExists = true
                            break
                        }
                    }
                    if (!TagExists) {
                        const Createresponse = await axiosWp.post(
                            `${domain}/wp-json/wp/v2/tags`,
                            {
                                name: tag,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        const newTagId = parseInt(Createresponse.data.id)
                        form.append('tags[]', newTagId)
                    }
                }
            }
            if (Categorys) {
                for (const Category of Categorys) {
                    let CategoryExists = false
                    const response = await axiosWp.get(
                        `${domain}/wp-json/wp/v2/categories`,
                        {
                            params: { search: Category },
                        },
                    )
                    for (const data of response.data) {
                        if (data.name === Category) {
                            const CategoryId = parseInt(data.id)
                            form.append('categories[]', CategoryId)
                            CategoryExists = true
                            break
                        }
                    }
                    if (!CategoryExists) {
                        const Createsresponse = await axiosWp.post(
                            `${domain}/wp-json/wp/v2/categories`,
                            {
                                name: Category,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        const newCategoryId = parseInt(Createsresponse.data.id)
                        form.append('categories[]', newCategoryId)
                    }
                }
            }

            await axiosWp
                .post(`${domain}/wp-json/wp/v2/posts/${id}`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    // for (let [key, value] of form) {
                    //     console.log(`${key}: ${value}`)
                    // }
                    processing.value = false
                    console.log(response)
                    // this.router.push({ name: 'user.article.index' })
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
        async AddMedia(form, setErrors, processings, domain, token) {
            processings.value = true
            await axiosWp
                .post(`${domain}/wp-json/wp/v2/media`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    // for (let [key, value] of form) {
                    //     console.log(`${key}: ${value}`)
                    // }
                    this.Media.push(response.data)
                    processings.value = false
                    console.log(response)
                    // this.router.push({ name: 'user.article.index' })
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
                    processings.value = false
                })
        },
        async UpdateMedia(form, id, domain, token, processings, setErrors) {
            processings.value = true
            await axiosWp
                .post(`${domain}/wp-json/wp/v2/media/${id}`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    // for (let [key, value] of form) {
                    //     console.log(`${key}: ${value}`)
                    // }
                    processings.value = false
                    console.log(response)
                    // this.router.push({ name: 'user.article.index' })
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
                    processings.value = false
                })
        },
    },
})
