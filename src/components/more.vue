<template>
  <div class="outer-box">
    <div class="inner-box" :style="{ backgroundImage: `url(${moreImage})` }"></div>
  </div>
</template>

<script setup>
// 导入 assets 图片
import moreImage from '../assets/more.png'

</script>

<style scoped>
.outer-box {
  width: calc(100vw * 36 / 375);
  height: calc(100vw * 36 / 375); /* 使用宽度比例即可，不用 vh，保证圆形或正方形 */
  /* border-radius: calc(100vw * 14 / 375);
  background: rgba(255, 255, 255, 1); */

  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}

.inner-box {
  width: calc(100vw * 36 / 375);
  height: calc(100vw * 36 / 375);
  background-size: cover;  /* 图片铺满容器 */
  background-position: center;
  background-repeat: no-repeat;
}
</style>