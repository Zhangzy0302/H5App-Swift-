<template>
  <div class="tologin-page" @click="toLoginCancle()">
    <div class="login-dialog" @click.stop>
      <div class="message-card">
        <div class="card-highlight"></div>
        <div class="warning-icon">!</div>
        <div class="message-text">
          To ensure the normal<br>
          operation of the function,<br>
          please log in to your<br>
          account first.
        </div>
      </div>

      <button class="action-btn login-btn" type="button" @click="toLogin()">Log in</button>
      <button class="action-btn cancel-btn" type="button" @click="toLoginCancle()">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { sendToLoginToIOS } from '@/utils/iosBridge'

const uiStore = useUIStore()

function toLoginCancle() {
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
  background-color: rgba(0, 0, 0, 0.72);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.login-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 18 / 812);
  transform: translateY(calc(100vh * -8 / 812));
}

.message-card {
  position: relative;
  width: calc(100vw * 276 / 375);
  height: calc(100vh * 184 / 812);
  border-radius: calc(100vw * 24 / 375);
  background: rgba(255, 255, 255, 1);
  overflow: visible;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  box-shadow: 0 calc(100vh * 12 / 812) calc(100vw * 28 / 375) rgba(0, 0, 0, 0.18);
}

.card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh * 52 / 812);
  border-radius: calc(100vw * 24 / 375) calc(100vw * 24 / 375) 0 0;
  background: linear-gradient(180deg, rgba(221, 123, 15, 0.35) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.warning-icon {
  position: absolute;
  top: calc(100vh * -32 / 812);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100vw * 58 / 375);
  height: calc(100vw * 54 / 375);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 1);
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 36 / 375);
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 calc(100vh * 2 / 812) calc(100vw * 3 / 375) rgba(0, 0, 0, 0.18);
  z-index: 2;
}

.warning-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(221, 123, 15, 1);
  clip-path: polygon(50% 4%, 98% 94%, 2% 94%);
  z-index: -1;
}

.message-text {
  position: relative;
  z-index: 1;
  padding-top: calc(100vh * 58 / 812);
  padding-left: calc(100vw * 24 / 375);
  padding-right: calc(100vw * 24 / 375);
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 17 / 375);
  font-weight: 400;
  line-height: calc(100vw * 21 / 375);
  color: rgba(0, 0, 0, 1);
  text-align: center;
}

.action-btn {
  width: calc(100vw * 220 / 375);
  height: calc(100vh * 52 / 812);
  border: none;
  border-radius: calc(100vw * 98 / 375);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  line-height: calc(100vw * 23 / 375);
  color: rgba(0, 0, 0, 1);
  cursor: pointer;
}

.login-btn {
  background: rgba(221, 123, 15, 1);
  color: rgba(255, 255, 255, 1);
}

.cancel-btn {
  background: rgba(255, 255, 255, 1);
}
</style>
