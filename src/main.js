import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@/assets/css/font-awesome.css'
import '@/assets/js/font-awesome.min.js'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { Multiselect } from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
// import Dialog from 'primevue/dialog';

const vuetify = createVuetify({
    components,
    directives,
})
const app = createApp(App)
const pinia = createPinia()

app.use(
    pinia.use(({ store }) => {
        store.router = markRaw(router)
    }),
)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        unstyled: true
    }
});
// app.component('Dialog', Dialog);
// const toast = useToast();
app.use(ToastService);
app.component('QuillEditor', QuillEditor)
app.use(router)
app.use(vuetify)
app.component('Multiselect', Multiselect);
app.mount('#app')

