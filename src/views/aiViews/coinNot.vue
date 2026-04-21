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
  width: calc(100vw * 278 / 375);
  /* height: calc(100vh * 336 / 812); */
  aspect-ratio: 278/336;
  background-image: url('@/assets/coinnot.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.recharge-button {
  position: absolute;
  bottom: calc(100vh * 29 / 812);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100vw * 147 / 375);
  height: calc(100vw * 45 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(243, 96, 86, 1);

  border: 2px solid rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 18 / 375);
  font-weight: 700;
  line-height: calc(100vw * 45 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}
</style>