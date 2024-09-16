<script setup>
import { computed, onBeforeMount, ref, defineEmits, watch } from 'vue';
import { wordpressStore } from '@/stores/wordpress'
import { useArticleStore } from '@/stores/article'
import { useRoute } from 'vue-router'

const store = useArticleStore();
const stores = wordpressStore();
const route = useRoute()

const wordpress = ref([])
const Categorys = ref([])
const SelectedCategorys = ref([])

const emit = defineEmits(['SelectedCategorys']);
const id = computed(() => route.params.id)
onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    wordpress.value = stores.wordpress
    const { domain } = stores.wordpress
    await store.getCategoryByDomain(domain)
    Categorys.value = store.Category
})

watch(SelectedCategorys, (newValue) => {
    emit('SelectedCategorys', newValue);
});
const AddCategory = (newcategory) => {
    const category = {
        name: newcategory
    }
    Categorys.value.push(category)
    SelectedCategorys.value.push(category)
    emit('SelectedCategorys', SelectedCategorys.value)
}

</script>

<template>
    <div class="bg-white shadow-xl rounded">
        <div class="p-3">
            <label>Category</label>
            <!-- {{ SelectedTags }} -->
            <hr class="mb-3 mt-1">
            <multiselect v-model="SelectedCategorys" :options="Categorys" :multiple="true" :close-on-select="false"
                :clear-on-select="false" placeholder="Pilih tag" label="name" :taggable="true" @tag="AddCategory"
                track-by="name"></multiselect>
        </div>
    </div>
</template>