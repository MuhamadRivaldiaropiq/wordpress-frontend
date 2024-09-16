<script setup>
import { ref, defineEmits, onBeforeMount, watchEffect, defineProps, computed, watch } from 'vue'
import { useArticleStore } from '@/stores/article'
import { wordpressStore } from '@/stores/wordpress'
import { useRoute } from 'vue-router'
import '@/assets/css/vuetify.css'

const store = useArticleStore();
const stores = wordpressStore();
const route = useRoute()

const props = defineProps({
    visible: Boolean,
});
const emit = defineEmits(['update:visible', 'selectedMedia']);
const dialogVisible = ref(props.visible);

watch(() => props.visible, (newValue) => {
    console.log('props visible', newValue);
    dialogVisible.value = newValue
    if (newValue) {
        activeTab.value = 'two'
        
    }
})
watch(dialogVisible, (newValue) => {
  if (newValue !== props.visible) {
    emit('update:visible', newValue);
  }
});

const fileMedia = ref(null);
const media = ref([])
const activeTab = ref(null);
const MediaSrc = ref('');
const wordpress = ref([])
const selectedMedia = ref(null);
const FormMedia = ref({
    TextAlt: '',
    Judul: '',
    Keterangan: '',
    Deskripsi: ''
})
const processing = ref(false)
const processings = ref(false)
const setErrors = ref([])
const errors = computed(() => setErrors.value)


const id = computed(() => route.params.id)
onBeforeMount(async () => {
    await stores.getWordpressById(id.value)
    wordpress.value = stores.wordpress
    const { domain } = stores.wordpress
    await store.getMediaByDomain(domain)
    fetchMedia()
})

const fetchMedia = async () => {
    media.value = store.Media
}
watchEffect(() => {
    fetchMedia()
})

const Addmedia = async () => {
    const formData = new FormData()
    formData.append('file', fileMedia.value)
    const { domain, token } = stores.wordpress
    processings.value = true
    await store.AddMedia(formData, processings, setErrors, domain, token,)
    processings.value = false
    activeTab.value = 'two'
}
const UpdateDataMedia = async () => {
    const formData = new FormData()
    formData.append('alt_text', FormMedia.value.TextAlt)
    formData.append('title', FormMedia.value.Judul)
    formData.append('caption', FormMedia.value.Keterangan)
    formData.append('description', FormMedia.value.Deskripsi)
    const { id } = selectedMedia.value
    const { domain, token } = stores.wordpress
    processings.value = true
    await store.UpdateMedia(formData, id, domain, token, processing, setErrors)
    processings.value = false
}
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        MediaSrc.value = URL.createObjectURL(file); // Set URL sementara untuk pratinjau
        fileMedia.value = file; // Simpan file untuk diunggah
        // Addmedia(); // Kirim ke API WordPress
    } else {
        alert('Please select an image file.');
    }
};
const selectMedia = (media) => {
    selectedMedia.value = media;
}
const isSelected = (mediaId) => {
    return selectedMedia.value && selectedMedia.value.id === mediaId;
}
const CloseDialog =  () => {
    dialogVisible.value = false
}
const SendMedia = () => {
  if (selectedMedia.value) {
    emit('selectedMedia', selectedMedia.value);
    dialogVisible.value = false; 
  }
};
</script>

<template>
    <v-dialog v-model="dialogVisible" width="auto">
        <v-card width="1150" height="500" prepend-icon="mdi-update">
            <!-- {{ selectedMedia.id }} -->
            <template v-slot:item>
                <div class="flex justify-between">
                    <div class="text-2xl">Tambahkan Media </div>
                    <div>
                        <svg v-if="processings" role="status"
                            class="inline absolute right-20 top-6 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-secondary-3"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                        <button class="text-end p-3" @click="CloseDialog"><i class="fa-solid fa-x"></i></button>
                    </div>
                </div>
            </template>
            <v-tabs v-model="activeTab">
                <!-- {{ selectedMedia.id }} -->
                <v-tab value="one">Unggah Berkas</v-tab>
                <v-tab value="two">Pustaka Media</v-tab>
            </v-tabs>
            <v-tabs-items v-model="activeTab">
                <v-tab-item v-if="activeTab == 'one'">
                    <div class="h-[20rem]">
                        <div v-if="MediaSrc" class="p-3">
                            <img :src="MediaSrc" alt="Uploaded Image" class="w-32 h-32 border border-secondary-3" />
                        </div>
                        <div class="flex flex-col justify-center items-center h-80" v-if="!MediaSrc">
                            <h3 class="text-center">Unggah Berkas</h3>
                            <input type="file" @change="handleFileUpload" />
                        </div>
                        <div class="absolute bottom-0 p-5 right-0">
                            <button type="button" @click="Addmedia"
                                class="py-1 px-2 items-center rounded bg-secondary-3 text-typography-1 mr-9">Masukan</button>
                        </div>
                    </div>
                </v-tab-item>
                <v-tab-item v-if="activeTab == 'two'">
                    <div class="flex justify-between h-[23rem]">
                        <div class="w-3/4 relative overflow-auto">
                            <div class="grid grid-cols-6 p-5 gap-3 h-20">
                                <div class="relative" v-for="media in media" :key="media.id">
                                    <!-- {{ media }} -->
                                    <img :src="media?.source_url" alt=""
                                        class="h-32 w-32 cursor-pointer rounded relative"
                                        :class="{ '!border-4 !border-blue-500': isSelected(media.id) }"
                                        @click="selectMedia(media)">
                                    <input type="radio" class=" absolute top-2 right-2" :value="media" v-model="selectedMedia" >
                                </div>
                            </div>
                            <!-- <v-data-table :items="Media" :headers="header"></v-data-table> -->
                            <div class="absolute bottom-0 right-0 mb-4">
                                <button @click="SendMedia" type="button"
                                    class="bg-secondary-3 p-2 rounded !text-typography-1 mr-3 items-end flex">Sisipkan</button>
                            </div>
                        </div>
                        <div class="w-1/4 bg-typography-4 relative overflow-auto">
                            <div v-if="selectedMedia">
                                <div class="p-3">
                                    <div class="text-lg font-medium p-3 text-center">Detail
                                        Lampiran</div>
                                    <div>
                                        <img :src="selectedMedia.source_url" alt=""
                                            class="h-32 w-32 cursor-pointer mb-3">
                                    </div>
                                    <div>{{ selectedMedia.title.rendered }}</div>
                                    <div>waktu</div>
                                </div>
                                <hr class="mt-3 mb-3">
                                <div class="p-6 text-xs">
                                    <form @submit.prevent="UpdateDataMedia">
                                        <div class="flex gap-5 items-center">
                                            <label for="">Text Alt</label>
                                            <textarea name="" id="" class="w-40 rounded-md"
                                                v-model="FormMedia.TextAlt"></textarea>
                                        </div>
                                        <div class="gap-8 flex items-center mt-3">
                                            <label for="">Judul</label>
                                            <input type="text" class="w-40 rounded-md" v-model="FormMedia.Judul">
                                        </div>
                                        <div class="flex gap-5 items-center mt-3">
                                            <label for="">Keterangan</label>
                                            <textarea name="" id="" class="w-40 rounded-md"
                                                v-model="FormMedia.Keterangan"></textarea>
                                        </div>
                                        <div class="flex gap-5 items-center mt-3">
                                            <label for="">Deskripsi</label>
                                            <textarea name="" id="" class="w-40 rounded-md"
                                                v-model="FormMedia.Deskripsi"></textarea>
                                        </div>
                                        <div class="flex justify-end mt-4">
                                            <button type="submit"
                                                class="bg-secondary-3 p-2 rounded text-typography-1 text-sm">save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-dialog>
</template>