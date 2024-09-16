<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { RouterLink } from 'vue-router'
import { onMounted, ref, onBeforeMount, computed } from 'vue'
import { useArticleStore } from '@/stores/article';
import PublishArticle from '@/components/PublishArticle.vue';
import PublishCheckbox from '@/components/PublishCheckbox.vue';
import LoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const store = useArticleStore();
const isloading = ref(false)
const articles = ref([])
const wordpress = ref([])

onMounted(() => {
  fetchArticles();
});
const fetchArticles = async () => {
  isloading.value = true 
  await store.getArticle()
  articles.value = store.articles
  isloading.value = false
}
const header = [
  { key: 'id', title: 'Id' },
  { key: 'title', title: 'Title' },
  { key: 'status', title: 'Status' },
  // { key: 'Stats', title: 'Domain' }
]
const selectedItem = ref([]);
</script>
<template>
  <AuthenticatedLayout title="Semua Article"> 
    <v-container>
      <loading-overlay :active="isloading" :is-full-page="true" />
      <v-data-table :items="articles" :headers="header">
       <template v-slot:[`item.action`]="{ item }">
          <PublishArticle :item="item" />
        </template>
        <template v-slot:[`item.Stats`]="{ item }">
                {{ item.wordpress.domain }}
        </template>
      </v-data-table>
    </v-container>
  </AuthenticatedLayout>
</template>
<style></style>