import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Icon, Loading, Swipe, SwipeItem } from 'vant'
import 'vant/es/icon/style'
import 'vant/es/loading/style'
import 'vant/es/swipe/style'
import 'vant/es/swipe-item/style'
import '@/assets/fonts/fonts.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Icon)
app.use(Loading)
app.use(Swipe)
app.use(SwipeItem)

app.mount('#app')
