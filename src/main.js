//Bulma för css-styling
import './assets/css/bulma.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//skapar appen
const app = createApp(App)

//appen använder router
app.use(router)

app.mount('#app')
