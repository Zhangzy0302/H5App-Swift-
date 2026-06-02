<template>
  <div class="coinnot-box">
    <img src="@/assets/coin.png" alt="coin" class="coinnot-icon" />
    <div class="coinnot-title">Sorry</div>
    <div class="coinnot-desc">your current balance is insufficient</div>
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
  width: calc(100vw * 290 / 375);
  min-height: calc(100vh * 157 / 812);
  border-radius: calc(100vw * 30 / 375);
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 225, 154, 1) 28%, rgba(255, 255, 255, 1) 55%, rgba(255, 255, 255, 1) 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(100vh * 74 / 812) calc(100vw * 24 / 375) calc(100vh * 10 / 812);
  box-sizing: border-box;
}

.coinnot-icon {
  position: absolute;
  top: calc(-100vh * 39 / 812);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100vw * 100 / 375);
  height: calc(100vw * 100 / 375);
  object-fit: contain;
}

.coinnot-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 19 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(14, 8, 15, 1);
  text-align: center;
}

.coinnot-desc {
  width: calc(100vw * 210 / 375);
  margin-top: calc(100vh * 17 / 812);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18 / 375);
  color: rgba(60, 48, 48, 0.68);
  text-align: center;
}

.recharge-button {
  position: absolute;
  left: 50%;
  top: calc(100% + calc(100vh * 24 / 812));
  transform: translateX(-50%);
  width: calc(100vw * 190 / 375);
  height: calc(100vh * 54 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 190, 25, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
  cursor: pointer;
}
</style>
