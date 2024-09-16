<script setup>
import { wordpressStore } from '@/stores/wordpress'
import { ref, onBeforeMount, computed, watchEffect } from 'vue';
import { PublishStore } from '@/stores/publish';
import { useRouter } from 'vue-router';
import ValidationErrors from '@/components/ValidationErrors.vue'
// import Checkbox from './Checkbox.vue';

const publishStore = PublishStore()
const store = wordpressStore()
const router = useRouter()
const selectedItem = ref([])

const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const props = defineProps({
    // item: Object,
    item: Object
})


const submitArticle = async () => {
    const formData = new FormData()
    formData.append('title', props.item.title)
    formData.append('content', props.item.content)
    formData.append('status', 'publish')
    for (const wordpress of selectedItem.value) {
        await publishStore.addArticles(
            formData,
            setErrors,
            processing,
            wordpress.domain,
            wordpress.token
        );

    }
    processing.value = false
    fetchData()
}

const wordpress = ref([])
onBeforeMount(async () => {
    fetchData()
})
const fetchData = async () => {
    await store.getWordpress()
    wordpress.value = store.wordpress
}

// watchEffect({
//     fetchData()
// })

</script>
<template>
    <!-- {{ wordpress }} -->
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="surface-variant" text="Publish" variant="flat"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                {{ props.item }}
                <v-card-text>
                    <v-form @submit.prevent="submitArticle">
                        <div class="p-3 flex justify-end">
                            <button type="submit"
                                class="px-5 py-1 bg-secondary-3 rounded hover:bg-opacity-90">Submit</button>
                        </div>
                        <ul>
                            <li v-for="(item, index) in wordpress" :key="index">
                                <div class="flex items-center gap-3">
                                    <input type="checkbox" :value="item" v-model="selectedItem" id="input-{{ item.id }}"
                                        class="rounded-full">
                                    <label for="input-{{ item.id }}">{{ item.domain }}</label>
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