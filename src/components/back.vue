<template>
  <div class="outer-box" @click="handleBack">
    <div class="inner-box" :style="{ backgroundImage: `url(${backImage})` }"></div>
  </div>
</template>

<script setup>
// 导入 assets 图片
import backImage from '@/assets/SARTY_back.png'
import { useRouter } from 'vue-router'
import { goBackOrClose } from '@/utils/iosBridge'

const router = useRouter()

function handleBack() {
  // 判断历史栈长度，优先返回上一页
  goBackOrClose()
}
</script>

<style scoped>
.outer-box {
  width: calc(100vw * 40 / 375);
  height: calc(100vw * 40 / 375); /* 使用宽度比例即可，不用 vh，保证圆形或正方形 */
  border-radius: calc(100vw * 14 / 375);

  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}

.inner-box {
  width: calc(100vw * 30 / 375);
  height: calc(100vw * 30 / 375);
  background-size: cover;  /* 图片铺满容器 */
  background-position: center;
  background-repeat: no-repeat;
}
</style>