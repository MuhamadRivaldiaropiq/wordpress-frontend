import { createWebHistory, createRouter } from 'vue-router'
import { useUsers } from '@/stores/user'
import PageNotFound from '@/pages/errors/404.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'
import ForgotPassword from '@/pages/auth/ForgotPassword.vue'
import ResetPassword from '@/pages/auth/ResetPassword.vue'
import VerifyEmail from '@/pages/auth/VerifyEmail.vue'

const APP_NAME = import.meta.env.VITE_APP_NAME

const routes = [
    {
        path: '/',
        name: 'welcome',
        redirect: '/dashboard',
        meta: {
            guard: 'auth',
        },
    },
    // user
    {
        path: '/wordpress',
        name: 'wordpress',
        component: () => import('@/pages/User/Wordpress/Index.vue'),
        meta: {
            guard: 'auth',
        },
    },
    // {
    //     path: '/user/article/:id',
    //     name: 'user.article.index',
    //     component: () => import('@/pages/User/Article/Index.vue'),
    //     meta: {
    //         guard: 'auth',
    //     },
    //     props: true,
    // },
    // Wp
    {
        path: '/wordpress/:id',
        name: 'wordpresss',
        component: () => import('@/pages/User/Article/DashboardWp.vue'),
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/wordpress/:id/article',
        name: 'wordpresss.article',
        component: () => import('@/pages/User/Article/Index.vue'),
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/wordpress/tags/:id',
        name: 'wordpresss.tags',
        component: () => import('@/pages/User/Article/Tags.vue'),
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/wordpress/categorys/:id',
        name: 'wordpresss.categorys',
        component: () => import('@/pages/User/Article/Category.vue'),
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/wordpress/media/:id',
        name: 'wordpresss.media',
        component: () => import('@/pages/User/Article/Media.vue'),
        meta: {
            guard: 'auth',
        },
    },
    // end wp
    {
        path: '/user/article/create/:id',
        name: 'user.article.create',
        component: () => import('@/pages/User/Article/Create.vue'),
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/user/article/update/:id/:idwp',
        name: 'user.article.update',
        component: () => import('@/pages/User/Article/Update.vue'),
        meta: {
            guard: 'auth',
        },
    },
    // admin
    // {
    //     path: '/admin/wordpress',
    //     name: 'admin.wordpress.index',
    //     component: () => import('@/pages/User/wordpress/Index.vue'),
    //     meta: {
    //         guard: 'auth',
    //     },
    // },
    // {
    //     path: '/admin/article',
    //     name: 'admin.article.index',
    //     component: () => import('@/pages/admin/article/Index.vue'),
    //     meta: {
    //         guard: 'auth',
    //     },
    // },
    {
        path: '/admin/wordpress/create',
        name: 'admin.wordpress.create',
        component: () => import('@/pages/admin/wordpress/Create.vue'),
        meta: {
            guard: 'auth',
        },
    },
    // {
    //     path: '/admin/article/create',
    //     name: 'admin.article.create',
    //     component: () => import('@/pages/admin/article/Create.vue'),
    //     meta: {
    //         guard: 'auth',
    //     },
    // },
    {
        path: '/home',
        redirect: '/dashboard',
        component: Dashboard,
        query: {
            verified: 'verified',
        },
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: {
            title: 'Dashboard',
            guard: 'auth',
        },
    },
    {
        path: '/admin/user',
        name: 'admin.user.index',
        component: () => import('@/pages/admin/User/Index.vue'),
        meta: {
            title: 'Dashboard',
            guard: 'auth',
        },
    },
    {
        path: '/admin/user/create',
        name: 'admin.user.create',
        component: () => import('@/pages/admin/User/Create.vue'),
        meta: {
            title: 'Dashboard',
            guard: 'auth',
        },
    },
    {
        path: '/admin/user/update/:id',
        name: 'admin.user.update',
        component: () => import('@/pages/admin/User/Update.vue'),
        meta: {
            title: 'Users Update',
            guard: 'auth',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        query: {
            reset: 'reset',
        },
        meta: {
            title: 'Log in',
            guard: 'guest',
        },
    },
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: Register,
    //     meta: {
    //         title: 'Register',
    //         guard: 'guest',
    //     },
    // },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
            title: 'Forget Password',
            guard: 'guest',
        },
    },
    {
        path: '/password-reset/:token',
        name: 'password-reset',
        component: ResetPassword,
        query: {
            email: 'email',
        },
        meta: {
            title: 'Reset Password',
            guard: 'guest',
        },
    },
    {
        path: '/verify-email',
        name: 'verify-email',
        component: VerifyEmail,
        query: {
            resend: 'resend',
        },
        meta: {
            title: 'Email Verification',
            guard: 'auth',
        },
    },
    {
        path: '/page-not-found',
        name: 'page-not-found',
        component: PageNotFound,
        meta: {
            title: 'Page Not Found',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/page-not-found',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard

router.beforeEach((to, from, next) => {
    const store = useUsers()

    const auth = store.authUser

    if (to.matched.some(route => route.meta.guard === 'guest') && auth)
        next({ name: 'dashboard' })
    else if (to.matched.some(route => route.meta.guard === 'auth') && !auth)
        next({ name: 'login' })
    else next()
    // const level = localStorage.getItem('level');
    // if (to.path === '/dashboard' && level !== 'admin') {
    //     next('/dashboard');
    // } else if (to.path === '/user/home' && level !== 'user') {
    //     next('/admin/dashboard');
    // } else {
    //     next();
    // }
})

// Page Title and Metadata

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.title)

    const nearestWithMeta = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.metaTags)

    if (nearestWithTitle) {
        document.title = nearestWithTitle.meta.title + ' - ' + APP_NAME
    } else {
        document.title = APP_NAME
    }

    Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
        el => el.parentNode.removeChild(el),
    )

    if (!nearestWithMeta) return next()

    nearestWithMeta.meta.metaTags
        .map(tagDef => {
            const tag = document.createElement('meta')

            Object.keys(tagDef).forEach(key => {
                tag.setAttribute(key, tagDef[key])
            })

            tag.setAttribute('data-vue-router-controlled', '')

            return tag
        })

        .forEach(tag => document.head.appendChild(tag))

    next()
})

export default router
