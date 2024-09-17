<script setup>
import DialogImage from '@/components/Form_Article/DialogImage.vue'
import { ref, defineEmits } from 'vue'
const DialogOpen = ref(false)
const SelectedMedia = ref('')


const OpenDialog = async () => {
    DialogOpen.value = true 
}
const emit = defineEmits(['update:visible', 'selectedMedia']);
const SendMedia = (media) => {
    SelectedMedia.value = media
  emit('selectedMedia', media);
};
const RemoveSelect = () => {
    SelectedMedia.value = ''
    emit('selectedMedia', '')
}
</script>
<template>
    <div class="bg-white shadow-xl mt-5 rounded">
        <div class="p-3">
            <label for="">Gambar Andalan</label>
            <hr class="mb-3 mt-1">
            <!-- {{ SelectedMedia }} -->
              <div class="p-2" v-if="SelectedMedia">
                  <img :src="SelectedMedia.source_url" alt="">
              </div>
              <div v-if="SelectedMedia"> 
                <button type="button" class="p-2 bg-red-500 rounded text-xs !text-typography-1" @click="RemoveSelect">Hapus</button>
              </div>
              <div v-else>
                  <button type="button" class="p-2 bg-secondary-3 rounded text-xs !text-typography-1" @click="OpenDialog">Pilih Image</button>
              </div>
            <DialogImage v-model:visible="DialogOpen" @selectedMedia="SendMedia"/>
        </div>
    </div>
</template>