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
const Tags = ref([])
const FormTags = ref({
    Name: '',
    Slug: '',
    Deskripsi: '',
})
onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    const { domain } = stores.wordpress
    await store.getTagsbyDomain(domain)
    console.log(Tags.value);
    fetchData()
})
const fetchData = async () => {
    wordpress.value = stores.wordpress
    Tags.value = store.Tags
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
    <AuthenticatedLayout>
        <div class="flex justify-between gap-5">
            <div class="w-2/5">
                <div class="text-xl font-semibold mb-5">Tambah Tag Baru</div>
                <div class="bg-typography-1 p-4 rounded-lg">
                    <form @submit.prevent="login" class="space-y-2 py-5">
                        <div class="flex flex-col gap-1">
                            <label for="">Nama</label>
                            <input type="url" v-model="domain" class="rounded-lg" autocomplete="new-domain" required />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="">Slug</label>
                            <input type="text" v-model="username" class="rounded-lg" autocomplete="new-username"
                                required />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="">Deskripsi</label>
                            <textarea type="text" v-model="password" class="rounded-lg" autocomplete="new-password"
                                required></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button class="px-5 py-1 hover:bg-opacity-90 rounded bg-secondary-3 text-typography-1 mt-5">
                                + Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="w-3/5">
                <v-data-table :items="Tags" :headers="header" hide-default-footer="true">
                    <template v-slot:[`item.action`]>
                        <!-- <button>Delete</button> -->
                    </template>
                </v-data-table>
                <!-- {{ Tags }} -->
            </div>
        </div>
    </AuthenticatedLayout>
</template>