<template>
  <div class="dialog-mask" @click.self="$emit('close')">
    <div class="dialog-container">
      <div class="dialog-content">
        <div class="dialog-options">
          <div class="option report-option" @click="$emit('select', 0)">Report</div>
          <div class="option shield-option" @click="$emit('select', 1)">Shield</div>
        </div>
        <div class="cancel" @click.self="$emit('close')">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.52);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
}

.dialog-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: calc(100vh * 255 / 812);
  border-radius: calc(100vw * 17 / 375) calc(100vw * 17 / 375) 0 0;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 228, 161, 1) 24%, rgba(248, 248, 246, 1) 50%, rgba(248, 248, 246, 1) 100%);
  border-bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-top: calc(100vh * 30 / 812);
  box-sizing: border-box;
}

.dialog-options {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 16 / 812);
}

.option {
  width: calc(100vw * 252 / 375);
  height: calc(100vh * 45 / 812);
  border-radius: calc(100vw * 23 / 375);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.report-option {
  background: rgba(60, 48, 48, 1);
  color: rgba(255, 255, 255, 1);
}

.shield-option {
  background: rgba(255, 82, 57, 1);
  color: rgba(255, 255, 255, 1);
}

.cancel {
  width: calc(100vw * 184 / 375);
  height: calc(100vh * 52 / 812);
  margin-top: calc(100vh * 28 / 812);
  border-radius: calc(100vw * 26 / 375);
  background: rgba(255, 190, 25, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  color: rgba(60, 48, 48, 1);
  text-align: center;
}
</style>
