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
  height: calc(100vh * 278 / 812);
  border-radius: calc(100vh * 40 / 812) calc(100vh * 40 / 812) 0px 0px;
background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(243, 96, 86, 1) 100%);
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
  justify-content: flex-start; /* 底部对齐 */
  align-items: center;       /* 水平居中 */
  height: 100%;
  width: auto;
  padding-top: calc(100vh * 30 / 812); /* 底部间距 */
  gap: calc(100vh * 26 / 812); /* 上下间距26 */
}

.dialog-options {
  width: calc(100vw * 260 / 375);
  height: calc(100vh * 108 / 812);
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
  background: rgba(255, 255, 255, 1);
  /* box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.1); */
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  text-align: center;

  display: flex; /* 新增 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.cancel {
  width: calc(100vw * 152 / 375);
  height: calc(100vw * 53 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(243, 96, 86, 1);

  border: calc(100vw * 2 / 375) solid rgba(255, 255, 255, 1);
  backdrop-filter: blur(calc(100vw * 10 / 375));
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 18 / 375);
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
  text-align: center;
}
</style>