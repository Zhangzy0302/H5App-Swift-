<template>
  <div class="wrapper">
    <div class="coinnot-box">
      <img src="@/assets/coinnot.png" alt="" />
    </div>
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
/* 外层容器 */
.wrapper {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;  /* 垂直居中 */
  align-items: center;      /* 水平居中 */
}

.coinnot-box {
  width: calc(100vw * 280 / 375);
  /* height: calc(100vh * 190 / 812); */
  /* background-image: url('@/assets/coinnot.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative; */
}

.coinnot-box img {
  width: 100%;
  height: auto;   /* ✅ 关键：高度自适应 */
  display: block;
}

.recharge-button {
  margin-top: calc(100vh * 20 / 812); /* 控制两个元素间距 */

  width: calc(100vw * 190 / 375);
  height: calc(100vh * 54 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  backdrop-filter: blur(calc(100vw * 10 / 375));

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
}
</style>
