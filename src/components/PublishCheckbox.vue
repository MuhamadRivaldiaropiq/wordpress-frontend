<script setup>
import { wordpressStore } from '@/stores/wordpress'
import { ref, onBeforeMount, computed } from 'vue';
import { PublishStore } from '@/stores/publish';
import { useRouter } from 'vue-router';
import ValidationErrors from '@/components/ValidationErrors.vue'
// import Checkbox from './Checkbox.vue';

const publishStore = PublishStore()
const store = wordpressStore()
const router = useRouter()
const selectedWp = ref([])

const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const submitArticle = async () => {

    if (props.item.length > 0) {
        for (const articles of props.item) {
            const formData = new FormData()
            formData.append('title', articles.title)
            formData.append('content', articles.content)
            formData.append('status', 'publish')
            for (const wordpress of selectedWp.value) {
                await publishStore.addArticles(
                    formData,
                    setErrors,
                    processing,
                    wordpress.domain,
                    wordpress.token
                );
            }
        }
    }

    processing.value = false
    router.push({ name: 'user.article.index' })
}


const wordpress = ref([])
onBeforeMount(async () => {
    await store.getWordpress()
    wordpress.value = store.wordpress
})

</script>
<template>
    <!-- {{ wordpress }} -->
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="surface-variant" text="Publish" variant="flat"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <v-form @submit.prevent="submitArticle">
                        <div class="p-3 flex justify-end">
                            <button type="submit"
                                class="px-5 py-1.5 hover:bg-opacity-90 bg-secondary-3 rounded">Submit</button>
                        </div>
                        <ul>
                            <li v-for="(wp, index) in wordpress" :key="index">
                                <div class="flex items-center gap-3">
                                    <input type="checkbox" :value="wp" v-model="selectedWp" :id="'inputMultiple-' + wp.id"
                                        class="rounded-full">
                                    <label :for="'inputMultiple-' + wp.id">{{ wp.domain }}</label>
                                </div>
                            </li>
                        </ul>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>