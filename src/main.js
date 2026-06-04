import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$isDev = import.meta.env.DEV
app.use(createPinia()).mount('#app')
