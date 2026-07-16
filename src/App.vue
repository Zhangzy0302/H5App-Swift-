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

    <!-- 全局 loading -->
    <div v-if="uiStore.loading" class="loading-mask">
      <div class="loading-box">
        <van-loading type="spinner" size="44px" color="#fff" />
        <div class="loading-text">Loading...</div>
      </div>
    </div>

    <!-- 全局 toast -->
    <div v-if="uiStore.toastMessage" class="global-toast">
      {{ uiStore.toastMessage }}
    </div>
  </div>
</template>

<style scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.001);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-box {
  width: 130px;
  height: 130px;
  border: 1px solid #fff;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 22px;
  box-sizing: border-box;
  padding: 0 20px;
}

.loading-text {
  color: #fff;
  font-family: 'JetBrainsMono', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
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
