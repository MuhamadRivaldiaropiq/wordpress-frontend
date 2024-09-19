<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import { useArticleStore } from '@/stores/article'
import { wordpressStore } from '@/stores/wordpress'
import { ref, onBeforeMount, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const store = useArticleStore()
const stores = wordpressStore()
const route = useRoute()

const id = computed(() => route.params.id)
const wordpress = ref([])
const Category = ref([])
const FormCategory = ref({
    Name: '',
    Slug: '',
    Deskripsi: '',
})
onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    const { domain } = stores.wordpress
    await store.getCategoryByDomain(domain)
    fetchData()
})
const fetchData = async () => {
    wordpress.value = stores.wordpress
    Category.value = store.Category
}
watchEffect(() => {
    fetchData()
})
const header = [
    { key: 'name', title: 'Name', width: '200px' },
    { key: 'description', title: 'Deskripsi', width: '200px' },
    // { key: 'slug', title: 'Slug', width: '100px' },
    { key: 'count', title: 'Jumlah', width: '100px' },
    { key: 'action', title: 'Action' }
]
const AddCategory = async () => {
    const formData = new FormData()
    formData.append('name', FormCategory.value.Name)
    if (FormCategory.value.Slug) {
        formData.append('slug', FormCategory.value.Slug)
    }
    if (FormCategory.value.Deskripsi) {
        formData.append('description', FormCategory.value.Deskripsi)
    }
    // await store.

}
</script>
<template>
    <AuthenticatedLayout>
        <div class="flex justify-between gap-5">
            <div class="w-2/5">
                <!-- {{ Category }} -->
                <div class="text-xl font-semibold mb-5">Tambah Category Baru</div>
                <div class="bg-typography-1 p-4 rounded-lg">
                    <form @submit.prevent="AddCategory" class="space-y-2 py-5">
                        <div class="flex flex-col gap-1">
                            <label for="">Nama</label>
                            <input type="url" v-model="Name" class="rounded-lg" autocomplete="new-Name" required />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="">Slug</label>
                            <input type="text" v-model="Slug" class="rounded-lg" autocomplete="new-Slug" required />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="">Deskripsi</label>
                            <textarea type="text" v-model="Deskripsi" class="rounded-lg" autocomplete="new-Deskripsi"
                                required></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit"
                                class="px-5 py-1 hover:bg-opacity-90 rounded bg-secondary-3 text-typography-1 mt-5">
                                + Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="w-3/5">
                <v-data-table :items="Category" :headers="header" hide-default-footer="true">
                </v-data-table>
            </div>
        </div>
    </AuthenticatedLayout>
</template>