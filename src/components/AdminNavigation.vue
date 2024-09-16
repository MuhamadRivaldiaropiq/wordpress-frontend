<script setup>
import { ref, inject, onBeforeMount, onMounted, nextTick } from 'vue'
import { useUsers } from '@/stores/user'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
// import { useRouter } from 'vue-router';

// import { router }
import Logo from '@/assets/images/logo.png'

const router = useRouter()
const store = useUsers()
const route = useRoute()
const level = ref(null)
const sidebarItem = ref([])

onBeforeMount(() => {
    if (!store.hasUserData) {
        store.getData()
    }
})
onMounted(async () => {
    const dataUser = store.userData
    if (dataUser) {
        try {
            level.value = dataUser.level
        } catch (error) {
            console.log('Error parsing UserData:', error)
        }
    }
    sidebarItem.value = sidebarItemAdmin ;
})

const rail = inject('rail')
const sidebarItemAdmin = [
    {
        icon: 'fa-regular fa-boxes-stacked',
        to: 'user.wordpress.index',
        title: 'Wordpress',
        isHasChild: false,
        level:'user'
    },
    {
        icon: 'fa-regular fa-grid-2',
        to: 'dashboard',
        title: 'Dashboard',
        isHasChild: false,
        level:'admin'
    },
    {
        icon: 'fa-regular fa-users',
        to: 'admin.user.index',
        title: 'Users',
        isHasChild: false,
        level:'admin'
    },
    {
        icon: 'fa-regular fa-globe',
        to: 'admin.wordpress.index',
        title: 'Wordpress',
        isHasChild: false,
        level:'admin'
    },
    // {
    //     icon: 'fa-regular fa-layer-group',
    //     to: 'admin.article.index',
    //     title: 'Article',
    //     isHasChild: false,
    //     level:'admin'
    // },
    // {
    //     icon: 'fa-regular fa-boxes-stacked',
    //     title: 'Products',
    //     isHasChild: true,
    //     child: [
    //         {
    //             title: 'Product Category',
    //             icon: 'fa-regular fa-layer-group',
    //             to: 'admin.dashboard',
    //         },
    //         {
    //             title: 'Product Item',
    //             icon: 'fa-regular fa-box',
    //             to: 'admin.dashboard',
    //         },
    //     ],
    // },
]




const activeAccordion = ref(null)

const toggleAccordion = index => {
    if (activeAccordion.value === index) {
        activeAccordion.value = null
    } else {
        activeAccordion.value = index
    }
}
const submitLogout = async () => {
  await store.logout()
    //  localStorage.removeItem('userData');
    //   localStorage.removeItem('authStatus');
    //   window.location.reload()
    
}
</script>
<template>
    <v-navigation-drawer :rail="!rail" rail-width="60" permanent="" disable-route-watcher="" disable-resize-watcher=""
        v-if="store.userData"
        class="!rounded-r-2xl !shadow-lg my-auto !bg-light-primary-1 dark:!bg-dark-primary-2 !transition-colors !duration-500 !h-screen overflow-y-hidden !flex !flex-col">
        <div class="p-4 flex justify-between h-[70px] flex-none">
            <button @click.stop="rail = !rail"
                class="w-[43px] py-2 px-2 text-typography-3 dark:text-white cursor-pointer rounded-lg flex items-center gap-4 justify-center">
                <i class="fa-solid" :class="rail ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
            </button>
        </div>
        <v-divider></v-divider>
        <ul class="p-2 overflow-x-hidden h-[calc(100vh-72px)] flex flex-col gap-1 flex-auto">
            <div class="space-y-1 h-full overflow-y-scroll invisible-scrollbar">
                <li v-for="(item, index) in sidebarItem" :key="index">
                    <div v-if="item.level == store.userData.level">
                        <div v-if="item.isHasChild">
                            <h2 :id="'accordion-heading-' + index" class="bg-transparent">
                                <button type="button"
                                    class="group w-full py-2 px-2 hover:bg-light-primary-3 dark:hover:bg-white text-typography-3 dark:text-white cursor-pointer rounded-lg flex items-center gap-4"
                                    @click="toggleAccordion(index)" :aria-expanded="activeAccordion === index"
                                    :aria-controls="'accordion-body-' + index">
                                    <div
                                        class="w-[28px] flex-none flex justify-center text-typography-3 dark:text-white group-hover:dark:text-typography-3">
                                        <i class="" :class="item.icon"></i>
                                    </div>
                                    <p
                                        class="text-typography-3 dark:text-white font-medium dark:font-normal text-sm whitespace-nowrap group-hover:dark:text-typography-3">
                                        {{ item.title }}
                                    </p>
                                </button>
                            </h2>
                            <div :id="'accordion-body-' + index" :class="activeAccordion === index ? '' : 'hidden'"
                                :aria-labelledby="'accordion-heading-' + index">
                                <div
                                    class="border-y dark:border-none rounded-lg mt-1 bg-light-primary-2 dark:bg-dark-primary-1">
                                    <router-link :to="{ name: child.to }" v-for="(child, i) in item.child" :key="i"
                                        class="group w-full py-2 px-2 hover:bg-light-primary-3 dark:hover:bg-white text-typography-3 dark:text-white cursor-pointer rounded-lg flex items-center gap-4">
                                        <div
                                            class="w-[28px] flex-none flex justify-center text-typography-3 dark:text-white group-hover:dark:text-typography-3">
                                            <i class="" :class="child.icon"></i>
                                        </div>
                                        <p
                                            class="text-typography-3 dark:text-white font-medium dark:font-normal text-sm whitespace-nowrap group-hover:dark:text-typography-3">
                                            {{ child.title }}
                                        </p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <router-link :to="{ name: item.to }" v-if="!item.isHasChild">
                            <div :class="route.name === item.to
                                ? '!bg-light-primary-3'
                                : ''
                                "
                                class="group w-full py-2 px-2 hover:bg-light-primary-3 dark:hover:bg-white text-typography-3 dark:text-white cursor-pointer rounded-lg flex items-center gap-4">
                                <div :class="route.name === item.to
                                    ? '!text-typography-3'
                                    : ''
                                    "
                                    class="w-[28px] flex-none flex justify-center text-typography-3 dark:text-white group-hover:dark:text-typography-3">
                                    <i :class="item.icon" class=""></i>
                                </div>
                                <p :class="route.name === item.to
                                    ? '!text-typography-3'
                                    : ''
                                    "
                                    class="text-typography-3 dark:text-white font-medium dark:font-normal text-sm whitespace-nowrap group-hover:dark:text-typography-3">
                                    {{ item.title }}
                                </p>
                            </div>
                        </router-link>
                    </div>
                </li>
            </div>
            <div>
                <div class="py-1">
                    <v-divider class="!border-black dark:!border-white" :thickness="1"></v-divider>
                </div>
                <div class="">
                    <button @click="submitLogout" type="button"
                        class="group w-full py-2 px-2 hover:bg-light-primary-3 dark:hover:bg-white text-typography-3 dark:text-white cursor-pointer rounded-lg flex items-center gap-4">
                        <div
                            class="w-[28px] flex-none flex justify-center text-typography-3 dark:text-white group-hover:dark:text-typography-3">
                            <i class="fa-regular fa-right-from-bracket"></i>
                        </div>
                        <p
                            class="text-typography-3 dark:text-white font-medium dark:font-normal text-sm whitespace-nowrap group-hover:dark:text-typography-3">
                            Sign Out
                        </p>
                    </button>
                </div>
            </div>
        </ul>
    </v-navigation-drawer>
</template>
