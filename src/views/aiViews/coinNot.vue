<template>
  <div class="coinnot-box">
    <div class="recharge-button" @click="handleRecharge">Recharge</div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['recharge'])

function handleRecharge() {
  emit('recharge', true)
}
</script>

<style scoped>
.coinnot-box {
  width: calc(100vw * 338.5 / 375);
  height: calc(100vh * 391 / 812);
  background-image: url('@/assets/coinnot.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.recharge-button {
  position: absolute;
  bottom: calc(100vh * 34 / 812);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100vw * 164 / 375);
  height: calc(env(safe-area-inset-top) + 12px);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: inset calc(100vw * 1 / 375) calc(100vw * 1 / 375) calc(100vw * 1 / 375) rgba(255, 255, 255, 0.6), inset calc(100vw * 1 / 375) calc(100vw * 1 / 375) calc(100vw * 1 / 375) rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 400;
  line-height: calc(100vw * 23.1 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}
</style>