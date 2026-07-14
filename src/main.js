import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/assets/ios-input.css'

// Prevent browser zoom while preserving normal one-finger scrolling.
document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false })
document.addEventListener('gesturechange', (event) => event.preventDefault(), { passive: false })
document.addEventListener('gestureend', (event) => event.preventDefault(), { passive: false })
document.addEventListener('wheel', (event) => {
  if (event.ctrlKey || event.metaKey) event.preventDefault()
}, { passive: false })
document.addEventListener('keydown', (event) => {
  const isZoomShortcut = (event.ctrlKey || event.metaKey)
    && ['+', '-', '=', '0'].includes(event.key)
  if (isZoomShortcut) event.preventDefault()
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
