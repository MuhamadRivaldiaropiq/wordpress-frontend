<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
const id = computed(() => route.params.id)
const router = useRouter()
const route = useRoute()
</script>

<template>
    <AuthenticatedLayout>
        <!-- <RouterLink :to="{ name: 'wordpresss.article', params: { id: id } }" class="p-2 bg-secondary-3">posts
        </RouterLink> -->
        Dashboard
    </AuthenticatedLayout>
</template>