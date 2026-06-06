import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$isDev = import.meta.env.DEV || localStorage.getItem('bow-dev') === '1'
app.use(createPinia()).mount('#app')
