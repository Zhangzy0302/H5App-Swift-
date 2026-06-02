<template>
  <div class="notice-page" @click="close">
    <div class="notice-box">
      <div class="notice-dialog" @click.stop>
        <div class="notice-card">
          <div class="notice-title">Notice</div>
          <div class="notice-desc">Initiate conversations once you follow each other.</div>
        </div>
        <div class="notice-btn" @click="close">Got it</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
.notice-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.notice-box {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.notice-dialog {
  display: flex;
  width: fit-content;
  flex-direction: column;
  align-items: center;
}

.notice-card {
  width: calc(100vw * 310 / 375);
  min-height: calc(100vh * 174 / 812);
  border-radius: calc(100vw * 30 / 375);
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 224, 151, 1) 31%, rgba(255, 255, 255, 1) 58%, rgba(255, 255, 255, 1) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(100vh * 45 / 812) calc(100vw * 28 / 375) calc(100vh * 30 / 812);
  box-sizing: border-box;
}

.notice-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 22 / 375);
  font-weight: 700;
  line-height: calc(100vw * 28 / 375);
  color: rgba(14, 8, 15, 1);
  text-align: center;
}

.notice-desc {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 22 / 375);
  color: rgba(60, 48, 48, 0.68);
  text-align: center;
  margin-top: calc(100vh * 15 / 812);
}

.notice-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100vw * 211 / 375);
  height: calc(100vh * 60 / 812);
  margin-top: calc(100vh * 22 / 812);
  border-radius: calc(100vw * 32 / 375);
  background: rgba(255, 190, 25, 1);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(14, 8, 15, 1);
  cursor: pointer;
}
</style>
