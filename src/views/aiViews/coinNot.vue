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
  /* width: calc(100vw * 244 / 375); */
  height: calc(100vh * 330 / 812);
  aspect-ratio: 244 / 330;
  background-image: url('@/assets/coinnot.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.recharge-button {
  height: calc(100vh * 53 / 812);
  position: absolute;
  bottom: calc(100vh * 34 / 812);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100vw * 146 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(221, 123, 15, 1);
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrainsMono', sans-serif;
  font-size: 20;
  font-weight: 700;
  line-height: calc(100vw * 23.1 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}
</style>