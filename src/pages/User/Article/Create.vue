<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { useArticleStore } from '@/stores/article'
import { wordpressStore } from '@/stores/wordpress'
import { ref, computed, onBeforeMount, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import DialogImage from '@/components/DialogImage.vue'
import FeaturedMedia from '@/components/FeaturedMedia.vue'
import Tags from '@/components/Form_Article/Tags.vue'
import Category from '@/components/Form_Article/Category.vue'
import PublishArticle from '@/components/Form_Article/PublishArticle.vue'
import Dialog from 'primevue/dialog'
// import '@/assets/css/vuetify.css'

const toast = useToast()
const route = useRoute()
const store = useArticleStore()
const stores = wordpressStore()

const FormArticle = ref({
    Title: '',
    Content: '',
    Tags: [],
    Categorys: [],
    Status: '',
    Date: '',
    Featured_media: '',
})
const wordpress = ref([])
const isloading = ref(true)
const quillEditor = ref(null)
const Dialog1open = ref(false)
const Dialog2open = ref(false)
const IsoDate = computed(() => {
    if (!DateArticle.value) return new Date().toISOString()
    const localDate = new Date(DateArticle.value)
    const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    )
    return utcDate.toISOString()
})

const id = computed(() => route.params.id)

onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    const { domain } = stores.wordpress

    wordpress.value = stores.wordpress
    isloading.value = false
})

const router = useRouter()
const storeArticle = useArticleStore()
const processing = ref(false)
const processings = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const AddArticle = async status => {
    const formData = new FormData()
    formData.append('title', FormArticle.value.Title)
    formData.append('content', FormArticle.value.Content)
    if (status == 'draft') {
        formData.append('status', 'draft')
    } else {
        formData.append('status', 'publish')
    }
    formData.append('date', FormArticle.value.Date)
    FormArticle.value.Tags.forEach(tag => {
        formData.append('tagName[]', tag.name)
    })
    FormArticle.value.Categorys.forEach(category => {
        formData.append('name_category[]', category.name)
    })
    if (FormArticle.value.Featured_media) {
        formData.append('featured_media', FormArticle.value.Featured_media)
    }
    processing.value = true
    const { domain, token } = wordpress.value
    try {
        await storeArticle.PublishArticles(
            formData,
            setErrors,
            processing,
            domain,
            token,
        )
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User Berhasil Ditambahkan',
            life: 2000,
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Menambahkan user!',
            life: 3000,
        })
        console.error('Error updating user:', error)
    } finally {
        processing.value = false
    }
}

const closemedia = () => {
    isMedia.value = false
}
const OpenDialog = async dialogNumber => {
    if (dialogNumber === 1) {
        Dialog1open.value = true
    } else if (dialogNumber === 2) {
        Dialog2open.value = true
    }
}

const SendMedia = media => {
    FormArticle.value.Featured_media = media.id
    //   console.log("Media yang dipilih:", media);
}
const SendTags = Tags => {
    FormArticle.value.Tags = Tags
}
const SendCategory = Category => {
    FormArticle.value.Categorys = Category
}
const handleFormSubmit = ({ status, date }) => {
    FormArticle.value.Date = date
    console.log(FormArticle.value.Date)

    AddArticle(status)
}

const handleSaveDraft = ({ status, date }) => {
    FormArticle.value.Date = date
    AddArticle(status)
}
</script>

<template>
    <loading-overlay
        :active="isloading"
        loader="dots"
        color="#06D001"
        :is-full-page="false" />
    <AuthenticatedLayout title="Create Article">
        <form v-if="!isloading">
            <div class="flex flex-col md:flex-row gap-5">
                <div class="w-full">
                    <v-card>
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
                                v-model="FormArticle.Title"
                                class="bg-gray-50 border border-gray-300 mb-7 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required />
                            <button
                                @click="OpenDialog(1)"
                                type="button"
                                class="bg-typography-4 rounded p-2 border border-secondary-3 text-xs mb-3">
                                <i
                                    class="fa-solid fa-photo-film text-secondary-3 mr-1"></i
                                >Tambahkan Media
                            </button>
                            <DialogImage v-model:visible="Dialog1open" />
                            <!-- {{ Dialog1open }} -->
                            <div id="quill-editor">
                                <QuillEditor
                                    v-model:content="FormArticle.Content"
                                    ref="quillEditor"
                                    toolbar="full"
                                    contentType="html"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    style="height: 30rem"
                                    required />
                            </div>
                        </div>
                    </v-card>
                </div>
                <div class="md:w-1/3 w-full">
                    <Tags @SelectedTags="SendTags" />
                    <Category @SelectedCategorys="SendCategory" />
                    <featuredMedia @selectedMedia="SendMedia" />
                    <PublishArticle
                        @submitForm="handleFormSubmit"
                        @saveDraft="handleSaveDraft" />
                </div>
            </div>
        </form>
        <Toast />
    </AuthenticatedLayout>
</template>
<style></style>
