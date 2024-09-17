<script setup>
import { ref } from 'vue'

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    id: {
        type: [String, Number],
        required: true,
    },
    method: {
        type: Function,
        required: true,
    },
    label: {
        type: String,
    },
})
const processing = ref(false)
const handleDelete = async () => {
    processing.value = true
    await props.method(props.id, processing)
    processing.value = false
}
</script>
<template>
    <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
            <button v-bind="activatorProps">
                <div
                    class="flex gap-2 items-center text-white bg-red-500 hover:bg-opacity-90 rounded-lg px-3 py-1">
                    <i class="fa-solid fa-trash"></i>
                    <p v-if="label">{{ label }}</p>
                </div>
            </button>
        </template>

        <template v-slot:default="{ isActive }">
            <div
                class="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg relative font-poppins">
                <button
                    @click="isActive.value = false"
                    class="fa-solid fa-x rounded-xl hover:bg-gray-100 px-3 py-2 absolute right-3 top-3 text-gray-500"></button>
                <div class="p-5 text-center">
                    <svg
                        class="mx-auto mb-4 text-gray-400 w-12 h-12"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p class="mb-5 text-lg font-normal text-gray-500">
                        Are you sure you want to delete this {{ type }} ?
                    </p>
                    <div class="flex justify-center items-center">
                        <button
                            @click="handleDelete"
                            type="button"
                            class="!text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm items-center px-5 py-2.5 text-center flex gap-3 justify-center">
                            <p>Yes, I'm sure</p>
                            <svg
                                v-if="processing"
                                role="status"
                                class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                            </svg>
                        </button>
                        <button
                            @click="isActive.value = false"
                            type="button"
                            class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </v-dialog>
</template>
