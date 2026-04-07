<template>
  <div class="dialog-mask" @click.self="$emit('close')">
    <div class="dialog-container" :style="{ backgroundImage: `url(${bgcImage})` }">
      <div class="dialog-content">
        <div class="dialog-options">
          <div class="option" @click="$emit('select', 0)">Report</div>
          <div class="option" @click="$emit('select', 1)">Shield</div>
        </div>
        <div class="cancel" @click.self="$emit('close')">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import bgcImage from '@/assets/reportdialogbgc.png'
import optionsBgImage from '@/assets/reportchoosebgc.png'
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 居中 */
  width: auto;
  height: calc(100vw * 330 / 375);
  aspect-ratio: 244 / 331;
  /* margin-left: calc(100vw * 14 / 375); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1000;
  display: flex;
  justify-self: flex-end;
  flex-direction: column;
  gap: calc(100vh * 26 / 812); /* 上下间距26 */
}

.dialog-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 底部对齐 */
  align-items: center;       /* 水平居中 */
  height: 100%;
  width: auto;
  padding-bottom: calc(100vw * 32 / 375); /* 底部间距 */

}

.dialog-options {
  width: calc(100vw * 148 / 375);
  /* height: calc(100vh * 164 / 812); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: calc(100vw * 16 / 375); /* 上下间距26 */
  align-items: center;
  background-image: url(''); /* 先空，实际绑定在模板 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-bottom: calc(100vw * 30 / 375);
}

.option {
  width: calc(100vw * 148 / 375);
  height: calc(100vw * 46 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 1);

  border: calc(100vw * 1 / 375) solid rgba(44, 44, 44, 1);
  box-shadow: 0px 0px 4px  rgba(0, 0, 0, 0.1);

  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  color: rgba(74, 32, 25, 1);
  text-align: center;

  display: flex; /* 新增 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.cancel {
  width: calc(100vw * 148 / 375);
  height: calc(100vw * 53 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(221, 123, 15, 1);
  backdrop-filter: blur(calc(100vw * 10 / 375));
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
  text-align: center;
}
</style>