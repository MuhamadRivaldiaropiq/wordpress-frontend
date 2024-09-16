
<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { onMounted, ref, computed, watchEffect, onBeforeUnmount, onBeforeMount, } from 'vue'
import { useArticleStore } from '@/stores/article';
import { useRouter } from 'vue-router';
import { wordpressStore } from '@/stores/wordpress'
import { defineProps } from 'vue';
import LoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const isloading = ref(true)
const stores = wordpressStore()
const router = useRouter()
const store = useArticleStore();
const articles = ref([])
const wordpress = ref([])
const searchQuery = ref([])
const dropdownIndex = ref(null)
const route = useRoute()
const id = computed(() => route.params.id)

onBeforeMount(async () => {
  await stores.getWordpressById(id.value)
  const { domain, token } = wordpress.value
  // try {
    //  await store.getArticleByDomain(domain, token)
     await store.getArticleByDomain(wordpress.value)
    //  console.log('success');
//   } catch (error) {
//     if (error.response) {
//       if (error.response.status === 403) {
//         // await  router.push({ name: 'login'})
//       }
//       console.log('Error 403 terdeteksi!');
//       }
// }
  isloading.value = false
  fetchData();
});

onBeforeUnmount(() => {
  articles.value = []
  // console.log(articles.value);

})

const fetchData = async () => {
  articles.value = store.articles
  wordpress.value = stores.wordpress
}
const submitArticle = async item => {
  const formData = new FormData()
  formData.append('status', 'publish')
  const { domain, token } = wordpress.value;
  await store.changeStatus(
    formData,
    setErrors,
    processing,
    domain,
    token,
    item.id
  );
  processing.value = false,
    fetchData()
}
watchEffect(() => {
  fetchData()
})
// console.log(wordpress);

const header = [
  { key: 'id', title: 'id', width: '20px' },
  { key: 'title.rendered', title: 'Title', width: '3000px' },
  { key: 'status', title: 'Status' },
  { key: 'action', title: 'Action' },
]

const processing = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)

const ArticleCheckbox = async selectedItem => {
  for (const articles of selectedItem) {
    const formData = new FormData()
    formData.append('title', articles.title)
    formData.append('content', articles.content)
    formData.append('status', 'publish')
    if (articles.tag) {
      articles.tag.forEach(tag => {
        formData.append('tags[]', tag.wordpress_tag_id)
      });
    }
    if (articles.category) {
      articles.category.forEach(category => {
        formData.append('categories[]', category.wordpress_category_id)
      });
    }
    const { domain, token } = wordpress.value
    await store.PublishArticles(
      formData,
      setErrors,
      processing,
      domain,
      token
    );
    const formDataBackend = new FormData()
    formDataBackend.append('id', articles.id)
    processing.value = true
    await store.changeStatus(formDataBackend, setErrors, processing)
    processing.value = false
    router.push({ name: 'user.article.index' })
    fetchArticles()
  }
}
const getRowClass = (index) => {
  return index % 2 === 0 ? 'even-row' : 'odd-row';
};
const getstatusClass = (status) => {
  if (status === 'publish') {
    return {
      container: 'bg-secondary-3 text-secondary-3 px-2 text-sm font-bold rounded-full inline-flex items-center bg-opacity-30',
      circle: 'fa-duotone fa-solid mr-1 fa-circle-check'
    };
  } else if (status === 'draft') {
    return {
      container: 'bg-blue-500 text-blue-500 px-2 text-sm inline-flex font-bold rounded-full items-center bg-opacity-30',
      circle: 'mr-1 fa-solid fa-circle-exclamation'
    };
  } else if (status === 'future') {
    return {
      container: 'bg-orange-500 text-orange-500 px-2 text-sm inline-flex font-bold rounded-full items-center bg-opacity-30',
      circle: 'fa-solid fa-calendar-days mr-1'
    }
  }
};
const toggleDropdown = (item) => {
  dropdownIndex.value = dropdownIndex.value === item ? null : item
}
const closeDropdown = () => {
  dropdownIndex.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown);
});
const previewItem = (item) => {
  // console.log(item.guid.rendered);
  const url = item.guid.rendered; 
  if (url) {
    window.open(url, '_blank'); 
  } else {
    console.log('URL is not available for preview');
  }
};
const Remove = async (id) => {
  processing.value = true 
  const { domain, token } = wordpress.value
  try {
    await store.RemoveArticle(id, domain, token, setErrors, processing)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Article Berhasil Dihapus', life: 2000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Article Gagal Dihapus', life: 3000 });
        console.error('Error updating user:', error);
    } finally {
        processing.value = false;
    }
}
const Update = async (item) => {
  await router.push({ name: 'user.article.update', params: { id: item.id, idwp: id.value }})
}
// console.log(id);

const selectedItem = ref([]);
</script>
<template>
  <loading-overlay :active="isloading" loader="dots" color="#06D001" />
  <AuthenticatedLayout title="Article">
    <v-container v-if="!isloading">
    <!-- {{ articles }} -->
      <div class="mb-7">
        <div class="flex justify-end">
          <svg v-if="processing" role="status"
            class="inline mr-4 ml-4 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-3"
            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
        </div>
      </div>
      <div>
        <div class="bg-typography-1 dark:bg-dark-primary-2 p-4 px-10 rounded-tl-lg inline-flex items-center gap-3 justify-center"
          style="border-radius: 20px 150px 0px 0px;">
          <i class="fa-solid fa-bars-staggered text-secondary-3"></i>
          <div class="font-bold text-secondary-3 flex items-center gap-3">{{ wordpress.domain }}</div>
        </div>
        <div class="bg-typography-1 dark:bg-dark-primary-2 rounded-tr-lg">
            <div class="flex justify-between rounded-tl-lg">
              <div class="p-6 relative">
                <input type="search" placeholder="search..." v-model="searchQuery" class="h-8 w-56 px-8 rounded-full">
                <i class="fa-solid fa-filter absolute top-9 left-9  -translate-y-1 text-gray-500"></i>
              </div>
              <div>
                <div class="p-6">
                  <RouterLink :to="{ name: 'user.article.create', params: { id: id } }"
                    class="bg-secondary-3 px-3 py-2 rounded-lg text-typography-1 hover:bg-opacity-90 border shadow-lg">
                    + Add Article
                  </RouterLink>
                </div>
              </div>
            </div>
      <v-data-table :items="articles" :headers="header" :search="searchQuery" class="!p-2 dark:!bg-dark-primary-2 dark-mode dark:!text-typography-1 !rounded-none">
        <template v-slot:[`header.id`]="{ column }">
          <v-icon class="mr-2"><i class="fa-solid fa-square-check text-secondary-3"></i></v-icon>
          {{ column.text }}
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <input type="checkbox" :value="item" v-model="selectedItem" :disabled="item.status == 'publish'">
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <span :class="getstatusClass(item.status).container">
            <span :class="getstatusClass(item.status).circle"></span>
            {{ item.status }}
          </span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <button @click.stop="toggleDropdown(item)" class="text-gray-500 hover:text-gray-700"> <svg
              xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM10 10a2 2 0 110-4 2 2 0 010 4zM14 10a2 2 0 110-4 2 2 0 010 4z" />
            </svg></button>
            <div v-if="dropdownIndex === item" class="absolute right-0 mt-2 w-32 bg-typography-1 border border-gray-300">
        <ul class="text-left p-2 cursor-pointer dark:bg-dark-primary-2 dark:text-typography-1 py-3">
          <li @click="Update(item)" class="hover:bg-gray-100 dark:hover:bg-dark-primary-1 p-0.5">Update</li>
          <li @click="previewItem(item)" class="hover:bg-gray-100 dark:hover:bg-dark-primary-1 p-0.5">preview</li>
          <li @click="Remove(item.id)" class="hover:bg-gray-100 dark:hover:bg-dark-primary-1 p-0.5">Remove</li>
        </ul>
      </div>
        </template>
      </v-data-table>
    </div>
    </div>
    </v-container>
    <Toast />
  </AuthenticatedLayout>
</template>
<style>
.even-row {
  background-color: #ffffff;
  /* Light gray background for even rows */
}

.odd-row {
  background-color: #ecfdef;
  /* White background for odd rows */
  /* opacity: 0.8; */
}

.v-data-table thead {
  background-color: #ebffef;
}
.dark-mode .v-data-table thead {
  background-color: black;
}
</style>