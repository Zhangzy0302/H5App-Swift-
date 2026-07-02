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
                 @click="handleSelect(index)">
                <div class="choose-box">
                    <div class="check-icon" v-if="selectedIndex === index"></div>
                </div>
                <div class="report-content">{{ item }}</div>
            </div>
        </div>
        <div class="input-title">Supplementary description</div>
        <div class="input-box">
          <textarea v-model="inputText" class="input-field" maxlength="150" placeholder="Supplementary description (optional)" @focus="handleInputFocus"></textarea>
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
import { useCurrentUserStore } from '@/stores/currentUser'
import { goBackOrClose } from '@/utils/iosBridge'
import { requireLoginForGuest } from '@/utils/guest'

const otherStore =  useOtherStore()

const selectedIndex = ref(0)
const inputText = ref('')

const uiStore = useUIStore()
const currentUserStore = useCurrentUserStore()

function handleSelect(index) {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  selectedIndex.value = index
}

function handleInputFocus(event) {
  if (requireLoginForGuest(currentUserStore, uiStore)) {
    event.target.blur()
  }
}

function handleSubmit() {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

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
  background-color: rgba(1, 1, 1, 1);
  
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  overflow: hidden;
}

.back {
  padding-top: calc(100vh * 58 / 812);
  padding-left: calc(100vw * 20 / 375);
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
  column-gap: calc(100vw * 7 / 375); /* 左右间距7 */
  row-gap: calc(100vh * 12 / 812); /* 上下间距12 */
  padding: calc(100vh * 20 / 812) calc(100vw * 20 / 375) 0; /* 可选左右内边距 */
}

.grid-item {
  position: relative;
  border-radius: calc(100vw * 20 / 375);
  background: rgba(23, 23, 23, 1);
  height: calc(100vw * 115 / 375);
  overflow: hidden;
}

.choose-box {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  border-radius: calc(100vw * 8 / 375) 0px calc(100vw * 20 / 375) 0px;
  background: rgba(0, 0, 0, 0.12);
}

.grid-item.selected .choose-box {
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
}

.check-icon {
  position: absolute;
  top: calc(100vh * 6 / 812);
  left: calc(100vw * 6 / 375);
  width: calc(100vw * 20 / 375);
  height: calc(100vw * 20 / 375);
  background-image: url('@/assets/checkicon.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  overflow: hidden;
}

.report-content {
  padding: calc(100vh * 12 / 812) calc(100vw * 12 / 375) 0;
  color: rgba(255, 255, 255, 1);
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 17.41 / 375);
}

.input-title {
  padding-top: calc(100vh * 30 / 812);
  padding-left: calc(100vw * 20 / 375);
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 600;
  line-height: calc(100vw * 23.1 / 375);
  color: rgba(137, 255, 135, 1);
}

.input-box {
  position: relative;
  margin: calc(100vh * 16 / 812) calc(100vw * 20 / 375) 0;
  height: calc(100vh * 103 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(23, 23, 23, 1);
  backdrop-filter: blur(12px);
  padding: calc(100vw * 12 / 375);
  box-sizing: border-box;
}

.input-field {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  outline: none;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: normal;
  color: #fff; /* 输入文本颜色 */
  line-height: calc(100vw * 15.23 / 375);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375); /* 提示文本大小 */
  font-weight: 400; /* 提示文本粗细 */
  line-height: calc(100vw * 15.23 / 375);
}

.char-count {
  position: absolute;
  right: calc(100vw * 8 / 375);
  bottom: calc(100vh * 13 / 812);
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 12 / 375);
  color: rgba(255, 255, 255, 0.6);
}

.btn-box {
  margin: 0 auto; /* 新增：水平居中 */
  margin-top: calc(100vh * 40 / 812);
  margin-bottom: calc(100vh * 34 / 812);
  width: calc(100vw * 190 / 375);
  height: calc(100vh * 62 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  line-height: calc(100vw * 23.1 / 375);
  color: rgba(0, 0, 0, 1);
  text-align: center;
  vertical-align: top;
}
</style>
