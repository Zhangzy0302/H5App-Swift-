<template>
  <div class="dialog-mask" @click.self="$emit('close')">
    <div class="dialog-container">
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
  bottom: 0;
  left: 50%;
  transform: translate(-50%); /* 居中 */
  width: 100%;
  height: calc(100vh * 267 / 812);
  background-color: rgba(23, 23, 23, 1);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 24px 24px 0px 0px;
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
  padding-bottom: calc(100vh * 36 / 812); /* 底部间距 */
  gap: calc(100vh * 26 / 812); /* 上下间距26 */
}

.dialog-options {
  width: calc(100vw * 220 / 375);
  height: calc(100vh * 164 / 812);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: calc(100vh * 16 / 812); /* 上下间距26 */
  align-items: center;
  background-image: url(''); /* 先空，实际绑定在模板 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.option {
  width: calc(100vw * 260 / 375);
  height: calc(100vh * 46 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  font-size: 16;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  text-align: center;

  display: flex; /* 新增 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.cancel {
  width: calc(100vw * 190 / 375);
  height: calc(100vh * 54 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  backdrop-filter: blur(calc(100vw * 10 / 375));
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  font-size: 16;
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
  text-align: center;
}
</style>