<script setup>

const props = defineProps({
    item: Object
})
</script>
<template>
    <div>
        <input type="checkbox" :value="item" v-model="selectedItem">
    </div>
</template>