<script setup>
import { computed, onBeforeMount, ref, defineEmits, watch } from 'vue';
import { wordpressStore } from '@/stores/wordpress'
import { useArticleStore } from '@/stores/article'
import { useRoute } from 'vue-router'

const store = useArticleStore();
const stores = wordpressStore();
const route = useRoute()

const wordpress = ref([])
const Tags = ref([])
const SelectedTags = ref([])

const emit = defineEmits(['SelectedTags']);
const id = computed(() => route.params.id)
onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    wordpress.value = stores.wordpress
    const { domain } = stores.wordpress
    await store.getTagsbyDomain(domain)
    Tags.value = store.Tags
})

watch(SelectedTags, (newValue) => {
    emit('SelectedTags', newValue);
});

const addtag = (newTag) => {
    const tag = {
        name: newTag
    }
    Tags.value.push(tag)
    SelectedTags.value.push(tag)
    emit('SelectedTags', SelectedTags.value)
}

</script>

<template>
    <div class="bg-white shadow-xl rounded mb-5">
        <div class="p-3">
            <label>Tag</label>
            <!-- {{ SelectedTags }} -->
            <hr class="mb-3 mt-1">
            <multiselect v-model="SelectedTags" :options="Tags" :multiple="true" :close-on-select="false"
                :clear-on-select="false" placeholder="Pilih tag" label="name" :taggable="true" @tag="addtag"
                track-by="name"></multiselect>
        </div>
    </div>
</template>