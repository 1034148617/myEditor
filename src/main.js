import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import ElementPlus from 'element-plus'
import './assets/element-style.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
