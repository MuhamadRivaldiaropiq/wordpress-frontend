<script setup>
import { RouterLink } from 'vue-router';


</script>
<template>
    <div class="absolute bottom-5">
        <div class="flex gap-16 justify-center bg-typography-1 px-10 py-3 rounded-full">
            <div class="hover:text-secondary-3">
                <RouterLink :to="{ name: 'dashboard' }" class="text-md"><i class="fa-solid fa-house ml-2"></i>Home
                </RouterLink>
            </div>
            <div class="hover:text-secondary-3">
                <RouterLink :to="{ name: 'admin.user.index' }" class="text-md"><i
                        class="fa-solid fa-user ml-3"></i>Users
                </RouterLink>
            </div>
            <div class="hover:text-secondary-3">
                <RouterLink :to="{ name: '' }" class="text-md"><i class="fa-solid fa-globe ml-7"></i>Wordpress
                </RouterLink>
            </div>
        </div>
    </div>
</template>