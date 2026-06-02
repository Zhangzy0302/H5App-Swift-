<template>
  <div class="page">
    <div class="back">
      <BackButton/>
    </div>
    <div class="page-content">
        <div class="grid-container">
            <div class="grid-item" 
                 v-for="(item, index) in otherStore.other.reportContent" 
                 :key="index"
                 :class="{ selected: selectedIndex === index }"
                 @click="selectedIndex = index">
                <div class="choose-box">
                    <div class="check-icon" v-if="selectedIndex === index"></div>
                </div>
                <div class="report-content">{{ item }}</div>
            </div>
        </div>
        <div class="input-title">Supplementary description</div>
        <div class="input-box">
          <textarea v-model="inputText" class="input-field" maxlength="150" placeholder="Supplementary description (optional)"></textarea>
          <div class="char-count">{{ inputText.length }}/150</div>
        </div>
        <div class="btn-box" @click="handleSubmit">Submit</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { useOtherStore } from '@/stores/other'
import { useUIStore } from '@/stores/ui'
import { goBackOrClose } from '@/utils/iosBridge'

const otherStore =  useOtherStore()

const selectedIndex = ref(0)
const inputText = ref('')

const uiStore = useUIStore()
function handleSubmit() {
  if (uiStore.loading) return
  uiStore.showLoading()

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {
    uiStore.hideLoading()
    uiStore.showToast('Report successful')

    goBackOrClose()

  }, delay)
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 228, 161, 1) 22%, rgba(248, 248, 246, 1) 42%, rgba(248, 248, 246, 1) 100%);
  overflow: hidden;
}

.back {
  padding-top: calc(100vh * 53 / 812);
  padding-left: calc(100vw * 18 / 375);
}

.back :deep(.outer-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 0;
  background: transparent;
}

.back :deep(.inner-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.page-content {
  position: relative;
  width: 100vw;
  height: calc(100vh - calc(100vh * 96 / 812));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 一行两条 */
  column-gap: calc(100vw * 7 / 375);
  row-gap: calc(100vh * 11 / 812);
  padding: calc(100vh * 32 / 812) calc(100vw * 16 / 375) 0;
}

.grid-item {
  position: relative;
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 1);
  height: calc(100vh * 103 / 812);
  overflow: hidden;
}

.choose-box {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(100vw * 29 / 375);
  height: calc(100vw * 29 / 375);
  border-radius: calc(100vw * 8 / 375) 0px calc(100vw * 20 / 375) 0px;
  background: rgba(0, 0, 0, 0.12);
}

.grid-item.selected .choose-box {
  background: rgba(255, 190, 25, 1);
}

.check-icon {
  position: absolute;
  top: calc(100vh * 5 / 812);
  left: calc(100vw * 5 / 375);
  width: calc(100vw * 19 / 375);
  height: calc(100vw * 19 / 375);
  background-image: url('@/assets/checkicon.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  overflow: hidden;
}

.report-content {
  padding: calc(100vh * 13 / 812) calc(100vw * 11 / 375) 0;
  color: rgba(60, 48, 48, 1);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 700;
  line-height: calc(100vw * 20 / 375);
}

.input-title {
  padding-top: calc(100vh * 30 / 812);
  padding-left: calc(100vw * 17 / 375);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: calc(100vw * 24 / 375);
  color: rgba(60, 48, 48, 1);
}

.input-box {
  position: relative;
  margin: calc(100vh * 12 / 812) calc(100vw * 17 / 375) 0;
  height: calc(100vh * 93 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 1);
  padding: calc(100vh * 17 / 812) calc(100vw * 13 / 375);
  box-sizing: border-box;
}

.input-field {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  outline: none;
  background: transparent;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: normal;
  color: rgba(0,0,0,1); /* 输入文本颜色 */
  line-height: calc(100vw * 15.23 / 375);
}

.input-field::placeholder {
  color: rgba(60, 48, 48, 0.42);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375); /* 提示文本大小 */
  font-weight: 400; /* 提示文本粗细 */
  line-height: calc(100vw * 15.23 / 375);
}

.char-count {
  position: absolute;
  right: calc(100vw * 10 / 375);
  bottom: calc(100vh * 13 / 812);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  color: rgba(60, 48, 48, 0.32);
}

.btn-box {
  margin: 0 auto; /* 新增：水平居中 */
  margin-top: calc(100vh * 26 / 812);
  margin-bottom: calc(100vh * 34 / 812);
  width: calc(100vw * 174 / 375);
  height: calc(100vh * 49 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 190, 25, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(0, 0, 0, 1);
  text-align: center;
  vertical-align: top;
}
</style>
