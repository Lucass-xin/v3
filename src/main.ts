import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import './index.css'
import Vant from 'vant';
import 'vant/lib/index.css';


const app = createApp(App)
app.use(Vant)
app.use(store)
app.use(router)
app.mount('#app')