<script setup>
import { defineAsyncComponent } from 'vue'
import { useUIStore } from '@/stores/ui'

const ToLoginDialog = defineAsyncComponent(() => import('@/views/register/toLogin.vue'))

const uiStore = useUIStore()
</script>

<template>
  <div>
    <router-view />
    <ToLoginDialog v-if="uiStore.showToLogin"></ToLoginDialog>

    <!-- 全局 loading：对齐 Sien 原生 ScowjZwaHUDView -->
    <Transition name="loading-fade">
      <div
        v-if="uiStore.loading"
        class="loading-mask"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div class="loading-box">
          <span class="loading-spinner" aria-hidden="true"></span>
          <span class="loading-text">Loading...</span>
        </div>
      </div>
    </Transition>

    <!-- 全局 toast -->
    <div v-if="uiStore.toastMessage" class="global-toast">
      {{ uiStore.toastMessage }}
    </div>
  </div>
</template>

<style scoped>
.loading-mask {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.001);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.loading-box {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  background: rgb(33, 33, 33);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 22px;
  box-shadow: 0 2px 8px rgba(137, 255, 135, 0.75);
}

.loading-text {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
}

.loading-spinner {
  width: 45px;
  height: 45px;
  box-sizing: border-box;
  border: 4px solid rgba(255, 255, 255, 0.28);
  border-top-color: #fff;
  border-radius: 50%;
  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: none;
  }

  .loading-spinner {
    animation-duration: 1.6s;
  }
}

.global-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: calc(100vh * 12 / 812) calc(100vw * 24 / 375);
  border-radius: calc(100vw * 12 / 375);
  font-size: calc(100vw * 14 / 375);
  z-index: 10000;
  text-align: center;
}
</style>
