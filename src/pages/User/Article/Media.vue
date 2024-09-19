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
const Media = ref([])
onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    const { domain } = stores.wordpress
    await store.getMediaByDomain(domain)
    // console.log(Tags.value);
    fetchData()
})
const fetchData = async () => {
    wordpress.value = stores.wordpress
    Media.value = store.Media
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
const Addtags = async () => {
    const formData = new FormData()
    formData.append('name', FormTags.value.Name)
    if (FormTags.value.Slug) {
        formData.append('name', FormTags.value.Slug)
    }
    if (FormTags.value.Deskripsi) {
        formData.append('name', FormTags.value.Deskripsi)
    }
    // await store.

}
</script>
<template>
    <AuthenticatedLayout title="Pustaka Media">
        <div>
            <div>
                <button
                    class="p-2 bg-typography-4 rounded text-sm text-typography-3 mb-2 border border-secondary-3">Tambahkan
                    Media Baru</button>
            </div>
            <div class="flex justify-between p-4 bg-typography-1 rounded-lg">
                <div class="space-x-4">
                    <select name="" id="" class="h-9 text-sm rounded">
                        <option value="Semua Berkas Media">Semua Berkas Media</option>
                    </select>
                    <select name="" id="" class="h-9 text-sm rounded">
                        <option value="">Semua Tanggal</option>
                    </select>
                </div>
                <div class="space-x-3">
                    <label for="">Cari Media</label>
                    <input type="text" class="h-9 rounded">
                </div>
            </div>
            <div class="grid grid-cols-7 gap-4 p-3">
                <div v-for="Media in Media" :key="Media.id" class="flex">
                    <img :src="Media.source_url" alt="" class="w-40 h-40 rounded-md">
                    <!-- {{ Media.id }} -->
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>