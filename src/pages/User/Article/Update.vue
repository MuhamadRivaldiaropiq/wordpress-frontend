<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { useArticleStore } from '@/stores/article'
import { wordpressStore } from '@/stores/wordpress'
import { ref, computed, onBeforeMount, watchEffect, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Dropdown from '../../../components/Dropdown.vue'

const toast = useToast()
const route = useRoute()
const wordpress = ref('')
const store = useArticleStore()
const stores = wordpressStore()
const isloading = ref(true)
const tags = ref([])
const selectedTags = ref([])
const DateArticle = ref('')
const article = ref('')
const title = ref('')
const content = ref('')
const isDropdownStatus = ref(false)
const isDropdownDate = ref(false)
const SelectedStatus = ref('')
const idwp = computed(() => route.params.idwp)
const IsoDate = computed(() => {
    if (!DateArticle.value) return new Date().toISOString()
    const localDate = new Date(DateArticle.value)
    const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    )
    return utcDate.toISOString()
})
const IsoDateDraft = computed(() => {
    return new Date(DateArticle.value).toISOString()
})

// category
const AddCategory = newcategory => {
    const category = {
        name: newcategory,
    }
    Categorys.value.push(category)
    SelectedCategory.value.push(category)
}
const SelectedCategory = ref([])
const Categorys = ref([])

// tags
const addtags = newTag => {
    const tag = {
        name: newTag,
    }
    tags.value.push(tag)
    selectedTags.value.push(tag)
}

const id = computed(() => route.params.id)
onBeforeMount(async () => {
    await stores.getWordpressById(idwp.value)
    const { domain, token } = stores.wordpress
    wordpress.value = stores.wordpress
    await store.getArticleById(id.value, domain, token)
    article.value = store.articles
    await store.getTagsbyDomain(domain)
    tags.value = store.Tags
    await store.getCategoryByDomain(domain)
    Categorys.value = store.Category
    isloading.value = false
    fetchData()
})

const fetchData = async () => {
    title.value = article.value?.title?.rendered || ''
    content.value = article.value?.content?.rendered || ''
    selectedTags.value = article.value?.tags?.map(tagId => {
        return (
            tags.value.find(tag => tag.id === tagId) || {
                id: tagId,
                name: `Tag ID ${tagId}`,
            }
        )
    })
    SelectedCategory.value = article.value?.categories?.map(categoryId => {
        return (
            Categorys.value.find(category => category.id === categoryId) || {
                id: categoryId,
                name: `Tak Berkategori`,
            }
        )
    })
}

// const props = defineProps({
//     item: Object,
// })
const router = useRouter()
const storeArticle = useArticleStore()
const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const addArticleDraft = async () => {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('content', content.value)
    formData.append('status', 'draft')
    if (DateArticle.value) {
        formData.append('date', IsoDateDraft.value)
    }
    selectedTags.value.forEach(tag => {
        formData.append('tagName[]', tag.name)
    })
    SelectedCategory.value.forEach(category => {
        formData.append('name_category[]', category.name)
    })
    processing.value = true
    // const { domain, token } = wordpress.value
    await storeArticle.PublishArticles(
        formData,
        setErrors,
        processing,
        domain,
        token,
    )
    router.push({ name: 'user.article.index' })
}
const UpdateArticle = async () => {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('content', content.value)
    if (SelectedStatus.value) {
        formData.append('status', SelectedStatus.value)
    } else {
        formData.append('status', 'publish')
    }
    if (DateArticle.value) {
        formData.append('date', IsoDateDraft.value)
    }
    selectedTags.value.forEach(tag => {
        formData.append('tagName[]', tag.name)
    })
    SelectedCategory.value.forEach(category => {
        formData.append('name_category[]', category.name)
    })
    processing.value = true
    const { id } = article.value
    const { domain, token } = wordpress.value
    console.log(id)
    try {
        await storeArticle.UpdateArticles(
            formData,
            setErrors,
            processing,
            domain,
            token,
            id,
        )
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Article Berhasil Diupdate',
            life: 2000,
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Article Gagal Diupdate!',
            life: 3000,
        })
        console.error('Error updating user:', error)
    } finally {
        processing.value = false
        // router.push({ name: 'user.article.index' })
    }
}
const DropdownStatus = async () => {
    isDropdownStatus.value = !isDropdownStatus.value
}
const NoDropdownStatus = async () => {
    isDropdownStatus.value = false
}
const DropdownDate = async () => {
    isDropdownDate.value = !isDropdownDate.value
}
const NoDropdownDate = async () => {
    isDropdownDate.value = false
}
const formatDate = isoDate => {
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} pukul ${hours}:${minutes}`
}
const formattedDate = computed({
    get() {
        return formatDate(article.value.date)
    },
    set(value) {
        const [datePart, timePart] = value.split(' pukul ')
        article.value.date = new Date(
            `${datePart}T${timePart}:00`,
        ).toISOString()
    },
})
const previewItem = () => {
    //   console.log(article.guid.rendered);
    const url = article.value.guid?.rendered
    if (url) {
        window.open(url, '_blank')
    } else {
        console.log('URL is not available for preview')
    }
}
const ButtonLabel = computed(() => {
    const currentDate = new Date()
    const articleDate = new Date(DateArticle.value)
    const articleDates = new Date(article.value.date)
    if (article.value.status === 'publish') {
        if (!DateArticle.value) {
            return 'Perbarui'
        }
        if (articleDate.getTime() <= currentDate.getTime()) {
            return 'Perbarui'
        } else {
            return 'Jadwalkan'
        }
    }
    if (article.value.status == 'draft') {
        // if (!DateArticle.value) {
        //     return "Terbitkan"
        // }
        if (articleDate.getTime() <= currentDate.getTime()) {
            return 'Terbitkan'
        } else if (articleDates >= currentDate.getTime()) {
            return 'Jadwalkan'
        } else {
            return 'Terbitkan'
        }
    }
    if (article.value.status == 'future') {
        if (articleDate.getTime() <= currentDate.getTime()) {
            return 'Terbitkan'
        } else if (articleDate.getTime() >= currentDate.getTime()) {
            return 'Jadwalkan'
        } else {
            return 'Perbarui'
        }
    }
})

const TextDate = computed(() => {
    if (article.value.status === 'publish') {
        return 'Diterbitkan Pada :'
    }
    if (article.value.status === 'draft') {
        // if (articleDate.getTime() <= currentDate.getTime()) {
        //     return "p"
        // }
        return 'Terbitkan Pada :'
    }
    if (article.value.status === 'future') {
        return 'Dijadwalkan pada :'
    }
})
</script>

<template>
    <loading-overlay
        :active="isloading"
        loader="dots"
        color="#06D001"
        :is-full-page="false" />
    <AuthenticatedLayout title="Update Article">
        <form v-if="!isloading">
            <div class="flex flex-col md:flex-row gap-5">
                <div class="w-full">
                    <v-card>
                        <!-- {{ article.status }} -->
                        <div class="flex justify-end">
                            <svg
                                v-if="processing"
                                role="status"
                                class="inline mr-4 mt-4 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-3"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                            </svg>
                        </div>
                        <div class="p-5">
                            <label
                                for="theme"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >Title</label
                            >
                            <input
                                type="text"
                                v-model="title"
                                class="bg-gray-50 border border-gray-300 mb-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required />
                            <label
                                for="theme"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >Content</label
                            >
                            <QuillEditor
                                v-model:content="content"
                                contentType="html"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                style="height: 30rem"
                                required />
                        </div>
                    </v-card>
                </div>
                <div class="w-full md:w-1/3">
                    <div class="bg-white shadow-xl rounded">
                        <div class="p-3">
                            <label>Tag</label>
                            <hr class="mb-3 mt-1" />
                            <multiselect
                                v-model="selectedTags"
                                :options="tags"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                placeholder="Pilih tag"
                                label="name"
                                :taggable="true"
                                @tag="addtags"
                                track-by="name"></multiselect>
                        </div>
                    </div>
                    <div class="bg-white shadow-xl mt-5 rounded">
                        <div class="p-3">
                            <label for="">Kategori</label>
                            <hr class="mb-3 mt-1" />
                            <multiselect
                                v-model="SelectedCategory"
                                :options="Categorys"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                placeholder="Pilih Category"
                                label="name"
                                :taggable="true"
                                @tag="AddCategory"
                                track-by="name"></multiselect>
                        </div>
                    </div>
                    <div class="bg-white shadow-xl mt-5 rounded">
                        <div class="p-3">
                            <label for="">Terbitkan</label>
                            <hr class="mb-1 mt-2" />
                            <div class="p-2">
                                <div class="flex items-center">
                                    <div class="flex-1">
                                        <button
                                            v-if="article.status == 'draft'"
                                            class="bg-typography-4 text-sm rounded p-2 border border-secondary-3">
                                            Simpan Draf
                                        </button>
                                    </div>
                                    <div class="flex-1 text-right">
                                        <button
                                            @click="previewItem"
                                            class="bg-typography-4 text-sm rounded p-2 border border-secondary-3">
                                            Pratinjau
                                        </button>
                                    </div>
                                </div>

                                <div class="mt-2 text-base">
                                    <div>
                                        Status :
                                        <span class="font-semibold">{{
                                            article.status
                                        }}</span>
                                        <span
                                            class="text-sm cursor-pointer text-secondary-3 underline"
                                            @click="DropdownStatus"
                                            v-if="isDropdownStatus == false"
                                            >Edit</span
                                        >
                                    </div>
                                    <div v-if="isDropdownStatus" class="flex">
                                        <select
                                            v-model="SelectedStatus"
                                            class="w-full rounded-lg">
                                            <option value="">
                                                {{ article.status }}
                                            </option>
                                            <option
                                                v-if="
                                                    article.status ==
                                                        'publish' ||
                                                    article.status == 'future'
                                                "
                                                value="draft">
                                                Draf
                                            </option>
                                        </select>
                                        <p
                                            class="text-sm mt-1 cursor-pointer text-red-500 ml-2 flex items-center"
                                            @click="NoDropdownStatus">
                                            <i
                                                class="fa-solid fa-circle-xmark"></i>
                                        </p>
                                    </div>
                                </div>
                                <div class="mt-2 text-base">
                                    <!-- <span v-if="article.status == 'draft'">segera</span> -->
                                    <div>
                                        {{ TextDate }}
                                        <span class="font-semibold"
                                            >{{ formattedDate }}
                                        </span>
                                        <span
                                            class="text-sm cursor-pointer text-secondary-3 underline"
                                            @click="DropdownDate"
                                            v-if="isDropdownDate == false"
                                            >Edit</span
                                        >
                                    </div>
                                    <div v-if="isDropdownDate">
                                        <div class="flex">
                                            <input
                                                type="datetime-local"
                                                v-model="DateArticle"
                                                class="w-full rounded-lg" />
                                            <p
                                                class="text-sm mt-1 cursor-pointer text-red-500 ml-2 flex items-center"
                                                @click="NoDropdownDate">
                                                <i
                                                    class="fa-solid fa-circle-xmark"></i>
                                            </p>
                                        </div>
                                        <!-- <div class="flex gap-2 items-center">
                                            </div> -->
                                    </div>
                                </div>
                                <hr class="mb-1 mt-2" />
                                <div class="flex justify-end mt-3">
                                    <button
                                        @click="UpdateArticle"
                                        type="button"
                                        class="text-sm bg-secondary-3 p-2 text-typography-1 rounded">
                                        {{ ButtonLabel }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <!-- </loading-overlay> -->
        <Toast />
    </AuthenticatedLayout>
</template>
<style></style>
