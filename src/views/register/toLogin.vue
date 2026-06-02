<template>
  <div class="tologin-page" @click="toLoginCancle()">
    <div class="main-bg-box">
      <div class="login-dialog" @click.stop>
        <div class="login-card">
            <div class="login-title">Please Log In</div>
            <div class="login-desc">Log in now to unlock all features, view content and interact with others.</div>
        </div>
        <div class="main-bg-login-btn" @click="toLogin()">Log In</div>
      </div>
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
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.main-bg-box {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.login-dialog {
  display: flex;
  width: fit-content;
  flex-direction: column;
  align-items: center;
}

.login-card {
  width: calc(100vw * 310 / 375);
  min-height: calc(100vh * 174 / 812);
  border-radius: calc(100vw * 30 / 375);
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 224, 151, 1) 31%, rgba(255, 255, 255, 1) 58%, rgba(255, 255, 255, 1) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(100vh * 36 / 812) calc(100vw * 28 / 375) calc(100vh * 30 / 812);
  box-sizing: border-box;
}

.login-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 22 / 375);
  font-weight: 700;
  line-height: calc(100vw * 28 / 375);
  color: rgba(14, 8, 15, 1);
  text-align: center;
}

.login-desc {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 22 / 375);
  color: rgba(60, 48, 48, 0.68);
  text-align: center;
  margin-top: calc(100vh * 15 / 812);
}

.main-bg-login-btn,
.main-bg-email-btn,
.main-bg-new-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100vw * 211 / 375);
  height: calc(100vh * 60 / 812);
  border-radius: calc(100vw * 32 / 375);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(14, 8, 15, 1);
  cursor: pointer;
}

.main-bg-login-btn {
  margin-top: calc(100vh * 22 / 812);
  background: rgba(255, 190, 25, 1);
}

.mascot {
  width: calc(100vw * 92 / 375);
  height: calc(100vh * 54 / 812);
  margin-top: calc(100vh * -3 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 190, 25, 1) url('@/assets/avataricon.png') center bottom / calc(100vw * 86 / 375) auto no-repeat;
}

.main-bg-email-btn {
  margin-top: calc(100vh * 38 / 812);
  background: rgba(156, 116, 0, 0.9);
}

.main-bg-new-btn {
  margin-top: calc(100vh * 23 / 812);
  background: rgba(255, 255, 255, 0.38);
}

.signup-text {
  margin-top: calc(100vh * 24 / 812);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 13 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(14, 8, 15, 1);
  text-align: center;
}

.signup-text span,
.agreement-link {
  color: rgba(156, 116, 0, 1);
  text-decoration: underline;
}

.agreement-text {
  margin-top: calc(100vh * 31 / 812);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 13 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(14, 8, 15, 1);
  white-space: nowrap;
}

.agreement-dot {
  width: calc(100vw * 6 / 375);
  height: calc(100vw * 6 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  margin-right: calc(100vw * 10 / 375);
  flex-shrink: 0;
}
</style>
