<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { ref, computed, watchEffect, onBeforeUnmount, onBeforeMount } from 'vue'
import { useArticleStore } from '@/stores/article'
import { wordpressStore } from '@/stores/wordpress'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import '@/assets/css/vuetify.css'

const toast = useToast()
const isloading = ref(true)
const stores = wordpressStore()
const store = useArticleStore()
const articles = ref([])
const wordpress = ref([])
const searchQuery = ref('')
const route = useRoute()
const id = computed(() => route.params.id)
const processing = ref(false)

const pageItem = ref(1)
const itemsPerPage = ref(10)
const pageCount = computed(() => {
    return Math.ceil(filteredItem.value.length / itemsPerPage.value)
})

const filteredItem = computed(() => {
    return articles.value.filter(item => {
        return item.title.rendered.toLowerCase().includes(searchQuery.value)
    })
})

onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    wordpress.value = stores.wordpress
    await store.getArticleByDomain(wordpress.value)
    fetchData()
    isloading.value = false
})
const fetchData = async () => {
    articles.value = store.articles
}

watchEffect(() => {
    fetchData()
})

const header = [
    { key: 'title.rendered', title: 'Title', width: '3000px' },
    { key: 'status', title: 'Status' },
    { key: 'action', title: 'Action', sortable: false },
]

const Remove = async id => {
    processing.value = true
    const { domain, token } = wordpress.value
    try {
        await store.RemoveArticle(id, domain, token, processing)
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Article Berhasil Dihapus',
            life: 2000,
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Article Gagal Dihapus',
            life: 3000,
        })
        console.error('Error updating user:', error)
    } finally {
        processing.value = false
    }
}
</script>
<template>
    <div>
        <loading-overlay :active="isloading" loader="dots" color="#06D001" />
        <AuthenticatedLayout title="Article">
            <div v-if="!isloading">
                <div>
                    <div
                        class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
                        style="border-radius: 20px 150px 0px 0px">
                        <i
                            class="fa-solid fa-bars-staggered text-secondary-3"></i>
                        <div
                            class="font-bold text-secondary-3 flex items-center gap-3">
                            {{ wordpress.domain }}
                        </div>
                        <div>
                            <div>
                                <svg
                                    v-if="processing"
                                    role="status"
                                    class="inline mr-4 ml-4 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-3"
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
                        </div>
                    </div>
                    <div
                        class="bg-typography-1 dark:bg-dark-primary-2 rounded-lg rounded-tl-none shadow-lg">
                        <div
                            class="flex md:flex-row flex-col-reverse justify-between rounded-tl-lg">
                            <div class="p-6 pb-0 relative">
                                <input
                                    type="search"
                                    placeholder="search..."
                                    v-model="searchQuery"
                                    class="h-8 md:w-56 w-full px-8 rounded-lg border" />
                                <i
                                    class="fa-solid fa-filter absolute top-9 left-9 -translate-y-1 text-gray-500"></i>
                            </div>
                            <div>
                                <div class="px-6 pt-6">
                                    <RouterLink
                                        :to="{
                                            name: 'user.article.create',
                                            params: { id: id },
                                        }"
                                        class="bg-secondary-3 px-3 py-2 rounded-lg text-typography-1 hover:bg-opacity-90 border shadow-lg">
                                        + Add Article
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                        <v-data-table
                            :items="articles"
                            v-model:page="pageItem"
                            :headers="header"
                            :search="searchQuery"
                            hide-default-footer
                            :items-per-page="itemsPerPage"
                            class="!p-2 dark:!bg-dark-primary-2 dark-mode dark:!text-typography-1 !rounded-none">
                            <template v-slot:[`item.title.rendered`]="{ item }">
                                <a
                                    class="hover:underline"
                                    target="_blank"
                                    :href="item.guid.rendered">
                                    {{ item.title.rendered }}
                                </a>
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <span
                                    :class="{
                                        'bg-secondary-3 text-secondary-3 ':
                                            item.status === 'publish',
                                        'bg-blue-500 text-blue-500 ':
                                            item.status === 'draft',
                                        'bg-orange-500 text-orange-500 ':
                                            item.status === 'future',
                                    }"
                                    class="px-2 text-sm font-bold rounded-full inline-flex items-center bg-opacity-30">
                                    <span
                                        :class="{
                                            'fa-duotone fa-circle-check':
                                                item.status === 'publish',
                                            'fa-circle-exclamation':
                                                item.status === 'draft',
                                            'fa-calendar-days':
                                                item.status === 'future',
                                        }"
                                        class="fa-solid mr-1"></span>
                                    {{ item.status }}
                                </span>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">
                                <div class="flex items-center justify-center">
                                    <v-menu>
                                        <template v-slot:activator="{ props }">
                                            <button v-bind="props">
                                                <i
                                                    class="fa-solid fa-ellipsis"></i>
                                            </button>
                                        </template>
                                        <v-list
                                            class="!rounded-lg !text-sm !font-semibold !min-w-28">
                                            <ul class="py-1 space-y-1">
                                                <li class="w-full">
                                                    <router-link
                                                        class="!w-full !block py-1 px-3 text-start hover:bg-gray-100"
                                                        :to="{
                                                            name: 'user.article.update',
                                                            params: {
                                                                id: item.id,
                                                                idwp: id,
                                                            },
                                                        }"
                                                        >Edit</router-link
                                                    >
                                                </li>
                                                <li>
                                                    <a
                                                        target="_blank"
                                                        class="!w-full !block py-1 px-3 text-start hover:bg-gray-100"
                                                        :href="
                                                            item.guid.rendered
                                                        "
                                                        :to="{
                                                            name: 'user.article.update',
                                                            params: {
                                                                id: item.id,
                                                                idwp: id,
                                                            },
                                                        }"
                                                        >Preview</a
                                                    >
                                                </li>
                                                <li>
                                                    <button
                                                        class="!w-full !block py-1 px-3 text-start hover:bg-gray-100"
                                                        @click="
                                                            Remove(item.id)
                                                        ">
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </v-list>
                                    </v-menu>
                                </div>
                            </template>
                        </v-data-table>
                        <div class="p-5">
                            <v-pagination
                                v-model="pageItem"
                                :length="pageCount"
                                class="bg-light-primary-2 border !border-typography-2/20 shadow-lg rounded-lg dark:bg-dark-primary-1 dark:text-white"
                                :total-visible="5">
                            </v-pagination>
                        </div>
                    </div>
                </div>
            </div>
            <Toast />
        </AuthenticatedLayout>
    </div>
</template>
