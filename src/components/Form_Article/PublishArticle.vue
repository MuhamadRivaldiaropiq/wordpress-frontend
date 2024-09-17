<script setup>
import { ref, computed, defineEmits } from 'vue'

const isDropdownStatus = ref('')
const isDropdownJadwal = ref(false)
const DateArticle = ref('')
const SelectedStatus = ref('')

const emit = defineEmits(['submitForm', 'saveDraft'])

const IsoDate = computed(() => {
    if (!DateArticle.value) {
        return new Date().toISOString()
    }
    const localDate = new Date(DateArticle.value)
    const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    )
    return utcDate.toISOString()
})

const DropdownStatus = async () => {
    isDropdownStatus.value = !isDropdownStatus.value
}
const NoDropdownStatus = async () => {
    isDropdownStatus.value = false
}
const DropdownJadwal = async () => {
    isDropdownJadwal.value = !isDropdownJadwal.value
}
const NoDropdownJadwal = async () => {
    isDropdownJadwal.value = false
}
const ButtonLabel = computed(() => {
    const datearticle = new Date()
    const currentDate = new Date(DateArticle.value)
    if (currentDate.getTime() >= datearticle.getTime()) {
        return 'Jadwalkan'
    } else {
        return 'Terbitkan'
    }
})

const handleSubmit = () => {
    emit('submitForm', { status: SelectedStatus.value, date: IsoDate.value })
}

const handleSaveDraft = () => {
    emit('saveDraft', { status: 'draft', date: IsoDate.value })
}
</script>
<template>
    <div class="bg-white shadow-xl mt-5 rounded">
        <div class="p-3">
            <label for="">Terbitkan</label>
            <hr class="mb-3 mt-1" />
            <div class="flex justify-between">
                <button
                    class="bg-typography-4 p-2 rounded border border-secondary-3 text-sm"
                    @click.prevent="handleSaveDraft">
                    Simpan Draf
                </button>
                <button
                    class="bg-typography-4 p-2 rounded border border-secondary-3 text-sm">
                    Pratinjau
                </button>
            </div>
            <div class="text-base p-3">
                <div>
                    Status : <span class="font-semibold">Draft</span>
                    <span
                        class="text-sm text-secondary-3 underline cursor-pointer"
                        v-if="isDropdownStatus == false"
                        @click="DropdownStatus"
                        >Edit</span
                    >
                </div>
                <div v-if="isDropdownStatus" class="flex mb-3">
                    <select v-model="SelectedStatus" class="w-full rounded-lg">
                        <option value="draft">Draft</option>
                        <option value="menunggu">Menunggu Peninjauan</option>
                    </select>
                    <div
                        class="text-sm mt-1 cursor-pointer text-red-500 ml-2 flex items-center"
                        @click="NoDropdownStatus">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </div>
                </div>
                <div>
                    Terbitkan <span class="font-semibold">Segera</span>
                    <span
                        class="text-sm text-secondary-3 underline cursor-pointer"
                        v-if="isDropdownJadwal == false"
                        @click="DropdownJadwal"
                        >Edit</span
                    >
                </div>
                <div class="flex" v-if="isDropdownJadwal">
                    <input
                        type="datetime-local"
                        class="rounded-lg w-full"
                        v-model="DateArticle" />
                    <div
                        class="text-sm mt-1 cursor-pointer text-red-500 ml-2 flex items-center"
                        @click="NoDropdownJadwal">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </div>
                </div>
            </div>
            <hr class="mb-3 mt-1" />
            <div class="flex justify-end">
                <button
                    class="bg-secondary-3 rounded px-5 py-1 hover:bg-opacity-85"
                    type="button"
                    @click="handleSubmit">
                    <p class="text-typography-1">
                        {{ ButtonLabel }}
                    </p>
                </button>
            </div>
        </div>
    </div>
</template>
