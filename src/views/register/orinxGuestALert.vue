<template>
  <div class="orinx-guest-alert" @click.self="$emit('close')"> 
    <div class="orinx-guest-alert-content">
      <div class="orinx-guest-alert-title">
        <img src="@/assets/orinxwi_alert_logo.png" class="orinx-guest-alert-logo">
        <div class="orinx-guest-alert-title-text">
          To ensure the normal operation of the function, please log in to your account first.
        </div>
      </div>
      <div class="orinx-guest-alert-btns">
        <div class="orinx-guest-alert-btn-cancel" @click.self="$emit('close')">Cancel</div>
        <div class="orinx-guest-alert-btn-login" @click="handleLogin">Log in</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { sendLogoutToIOS } from '@/utils/iosBridge'

export default defineComponent({
  name: 'OrinxGuestAlert',
  emits: ['close'],
  methods: {
    handleLogin() {
      this.$emit('close')
      sendLogoutToIOS(false)
    }
  }
})
</script>

<style>
.orinx-guest-alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.orinx-guest-alert-content {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  width: calc(100vw * 300 / 375);
  height: calc(100vw * 272 / 375);
  border-radius: calc(100vw * 16 / 375);
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: calc(100vw * 24 / 375);
}

.orinx-guest-alert-logo {
  display: block;
  width: calc(100vw * 88 / 375);
  height: calc(100vw * 88 / 375);
  margin: 0 auto;
}

.orinx-guest-alert-title-text { 
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 16 / 375);
  width: 400;
  color: rgba(51, 51, 51, 1);
  text-align: center;
}

.orinx-guest-alert-btns {
  display: flex;
  width: 100%;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 16 / 375);
  color: white;
  text-align: center;
  gap: calc(100vw * 12 / 375);
  margin-top: calc(100vw * 24 / 375);
}

.orinx-guest-alert-btn-cancel,
.orinx-guest-alert-btn-login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: calc(100vw * 44 / 375);
  border-radius: calc(100vw * 44 / 375);
}

.orinx-guest-alert-btn-cancel {
  background-color: rgba(15, 124, 147, 1);
}

.orinx-guest-alert-btn-login {
  background-color: rgba(243, 96, 86, 1);
}
</style>