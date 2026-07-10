<template>
  <div class="tologin-page" @click="closeDialog">
    <div class="login-dialog" @click.stop>
      <div class="dialog-content">
        <div class="message-text">
          Please log in first<br>
          to keep this feature<br>
          working properly for<br>
          your account.
        </div>

        <button class="login-btn" type="button" @click="toLogin">Log in</button>
        <button class="cancel-btn" type="button" @click="closeDialog">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { sendToLoginToIOS } from '@/utils/iosBridge'

const uiStore = useUIStore()

function closeDialog() {
  uiStore.closeToLogin()
}

function toLogin() {
  uiStore.closeToLogin()
  sendToLoginToIOS()
}
</script>

<style scoped>
.tologin-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.login-dialog {
  position: relative;
  width: calc(100vw * 260 / 375);
  height: calc(100vw * 390 / 375);
  background-image: url('@/assets/reoiALxiwq_block_bg.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  transform: translateY(calc(100vh * -2 / 812));
}

.dialog-content {
  width: 100%;
  padding-bottom: calc(100vw * 20 / 375);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message-text {
  width: calc(100vw * 178 / 375);
  height: calc(100vw * 108 / 375);
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 20 / 375);
  color: rgba(44, 44, 44, 1);
  text-align: center;
  margin-bottom: calc(100vw * 30 / 375);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn,
.cancel-btn {
  width: calc(100vw * 146 / 375);
  border: none;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrainsMono', sans-serif;
  cursor: pointer;
  padding: 0;
}

.login-btn {
  height: calc(100vw * 53 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(221, 123, 15, 1);
  font-size: calc(100vw * 18 / 375);
  font-weight: 800;
  line-height: calc(100vw * 23 / 375);
  color: rgba(255, 255, 255, 1);
}

.cancel-btn {
  height: calc(100vw * 44 / 375);
  font-size: calc(100vw * 16 / 375);
  font-weight: 800;
  line-height: calc(100vw * 21 / 375);
  color: rgba(44, 44, 44, 1);
}
</style>
