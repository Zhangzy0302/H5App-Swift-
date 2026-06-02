<template>
  <div class="page">
    <div class="ai-hero">
      <div class="hero-shape shape-left"></div>
      <div class="hero-shape shape-center"></div>
      <div class="ai-robot"></div>
    </div>
    <div class="page-container">
      <!-- top -->
      <div class="top-section">
        <BackButton />
        <div class="page-title">Sarty AI</div>
      </div>
      <!-- center -->
      <div class="center-section">
        <div
          v-for="(item, index) in messages"
          :key="index"
          class="message-box"
          @click="handleMessageClick(item)"
        >
          <span>{{ item }}</span>
        </div>
      </div>
      <!-- bottom -->
      <div class="bottom-section">
        <div class="bottom-scroll">
          <div v-for="(item, index) in bottomItems" :key="index" class="chat-item">
            <div class="chat-choose" v-if="isAiMessage(item)">
                <div class="chat-time">{{ item.time }}</div>
                    <div class="chat-content">
                    <img class="chat-avatar" src="@/assets/aiavator.png" alt="AI Avatar" />
                    <div class="chat-message">{{ item.message }}</div>
                </div>
            </div>
            <div class="chat-choose" v-else>
                <div class="chat-time">{{ item.time }}</div>
                    <div class="chat-content-rigth">
                    <div class="chat-message-rigth">{{ item.message }}</div>
                    <div class="chat-avatar-rigth">
                      <img :src="currentUserStore.currentUser.avator" alt="AI Avatar" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部输入框 -->
    <!-- bottom input box -->
    <div class="bottom-input">
      <input type="text" placeholder="Say something" v-model="chatInput" />
      <img class="send-icon" src="@/assets/commentsend.png" alt="Send" @click="sendMessage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { aiChat } from '@/utils/ai'
import { decryptAES } from '@/utils/aes'

const messages = ref([
  "How to dress a suit without looking dull?",
  "Winter and autumn layering techniques?",
  "How to dress to look taller as a short person?"
])

const currentUserStore = useCurrentUserStore()
const uiStore = useUIStore()

const getFirstTime = () => {
  const key = 'chat_first_time'
  const saved = localStorage.getItem(key)

  if (saved) return saved

  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // 12:00
  localStorage.setItem(key, time)

  return time
}

const bottomItems = ref([
  { sendId: '0', time: getFirstTime(), message: 'Hi there! I’m Sarty, your AI buddy for all things fun and creative.' },
])

function isAiMessage(item) {
  return String(item.sendId) === '0'
}

async function handleMessageClick(message) {
  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  bottomItems.value.push({
    sendId: currentUserStore.currentUser.userId,
    time,
    message: message
  })

  if (uiStore.loading) return
  uiStore.showLoading()

  try {
    const res = await aiChat(message)

    uiStore.hideLoading()

    if (res.data.code === '0000') {
      // 1 解密
      const decryptText = decryptAES(res.data.result)
      // 2 转 JSON
      const data = JSON.parse(decryptText)
      const aiMessage = data?.output?.choices?.[0]?.message?.content || ''
      
      // 然后 push 到聊天列表
      bottomItems.value.push({
        sendId: '0',           // AI
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: aiMessage
      })
    } else {
      uiStore.showToast(res.data.message)
    }

  } catch (err) {
    uiStore.hideLoading()
    uiStore.showToast('Network error')
  }
}

const chatInput = ref('')

async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return

  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  bottomItems.value.push({
    sendId: currentUserStore.currentUser.userId,
    time,
    message: text
  })

  if (uiStore.loading) return
  uiStore.showLoading()
  try {
    const res = await aiChat(text)

    uiStore.hideLoading()

    if (res.data.code === '0000') {
      // 1 解密
      const decryptText = decryptAES(res.data.result)
      // 2 转 JSON
      const data = JSON.parse(decryptText)
      const aiMessage = data?.output?.choices?.[0]?.message?.content || ''
      
      // 然后 push 到聊天列表
      bottomItems.value.push({
        sendId: '0',           // AI
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: aiMessage
      })

      chatInput.value = ""
    } else {
      uiStore.showToast(res.data.message)
    }

  } catch (err) {
    uiStore.hideLoading()
    uiStore.showToast('Network error')
  }
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: rgba(248, 248, 246, 1);
}

.ai-hero {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh * 260 / 812);
  background: rgba(231, 248, 241, 1);
  overflow: hidden;
  z-index: 0;
}

.hero-shape {
  position: absolute;
  opacity: 0.5;
  pointer-events: none;
}

.shape-left {
  left: calc(100vw * 20 / 375);
  bottom: calc(100vh * -4 / 812);
  width: 0;
  height: 0;
  border-left: calc(100vw * 55 / 375) solid transparent;
  border-right: calc(100vw * 55 / 375) solid transparent;
  border-bottom: calc(100vh * 208 / 812) solid rgba(178, 229, 229, 0.45);
}

.shape-center {
  left: calc(100vw * 142 / 375);
  top: calc(100vh * 65 / 812);
  width: calc(100vw * 58 / 375);
  height: calc(100vh * 157 / 812);
  border-radius: calc(100vw * 22 / 375) calc(100vw * 22 / 375) 0 0;
  background: linear-gradient(145deg, rgba(196, 236, 240, 0.7), rgba(216, 245, 236, 0.25));
}

.ai-robot {
  position: absolute;
  right: calc(100vw * -57 / 375);
  bottom: calc(100vh * -32 / 812);
  width: calc(100vw * 277 / 375);
  height: calc(100vw * 220 / 375);
  background-image: url('@/assets/SARTY_ai_robot.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.top-section {
  position: absolute;
  top: calc(100vh * 56 / 812);
  left: calc(100vw * 20 / 375);
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
  z-index: 100;
}

.top-section :deep(.outer-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: 0;
  background: transparent;
}

.top-section :deep(.inner-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.page-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 19 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

.center-section {
  position: absolute;
  top: calc(100vh * 122 / 812);
  left: calc(100vw * 18 / 375);
  right: calc(100vw * 75 / 375);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 10 / 812);
  z-index: 4;
}

.message-box {
  display: inline-flex;
  align-items: center;
  height: calc(100vh * 31 / 812);
  padding: 0 calc(100vw * 13 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(60, 48, 48, 0.22);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 11 / 375);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: fit-content; /* Wrap width to content */
  justify-content: flex-start; /* Align content to left */
}

.bottom-section {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: calc(100vh * 260 / 812);
  background: rgba(248, 248, 246, 1);
  border-radius: 0;
  z-index: 2;
}

.bottom-scroll {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: calc(100vh * 32 / 812) 0 calc(100vh * 116 / 812);
  box-sizing: border-box;
  gap: calc(100vh * 26 / 812);
}

/* Optional: hide scrollbar */
.bottom-scroll::-webkit-scrollbar {
  display: none;
}
.bottom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.chat-item {
  display: flex;
  flex-direction: column;
}

.chat-choose {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 16 / 812);
}

.chat-time {
  text-align: center;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 17.41 / 375);
  letter-spacing: 0;
  color: rgba(60, 48, 48, 0.36);
}

.chat-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: calc(100vw * 16 / 375);
  width: 100%;
  padding: 0 calc(100vw * 20 / 375);
  box-sizing: border-box;
}

.chat-content-rigth {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(100vw * 12 / 375);
  width: 100%;
  padding: 0 calc(100vw * 20 / 375);
  box-sizing: border-box;
}

.chat-avatar {
  width: calc(100vw * 42 / 375);
  height: calc(100vw * 42 / 375);
  border-radius: 50%;
  flex-shrink: 0;
}

.chat-avatar-rigth {
  width: calc(100vw * 42 / 375);
  height: calc(100vw * 42 / 375);
  flex-shrink: 0;
  border-radius: 50%; /* fully circular */
  padding: calc(100vw * 1 / 375); /* border thickness */
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
}

/* Ensure avatar images fit inside the circular container and any overflow is hidden */
.chat-avatar img,
.chat-avatar-rigth img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ensure image fills container */
  border-radius: 50%;
  overflow: hidden;
}

.chat-message {
  max-width: calc(100vw * 285 / 375);
  border-radius: calc(100vw * 14 / 375);
  background: rgba(255, 190, 25, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh * 57 / 812);
  padding: calc(100vh * 12 / 812) calc(100vw * 17 / 375);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 400;
  line-height: calc(100vw * 17 / 375);
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
  box-sizing: border-box;
}

.chat-message-rigth {
  max-width: calc(100vw * 250 / 375);
  border-radius: calc(100vw * 14 / 375);
  background: rgba(60, 48, 48, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh * 40 / 812);
  padding: calc(100vh * 12 / 812) calc(100vw * 17 / 375);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 400;
  line-height: calc(100vw * 16 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
}

.bottom-input {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh * 100 / 812);
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255, 255, 255, 1);
  border-radius: 0;
  box-sizing: border-box;
  padding: calc(100vh * 9 / 812) calc(100vw * 18 / 375) calc(100vh * 37 / 812);
  z-index: 200;
}

.bottom-input input {
  flex: 1;
  height: calc(100vh * 47 / 812);
  border: none;
  outline: none;
  background: rgba(248, 248, 246, 1);
  border-radius: calc(100vw * 28 / 375);
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  font-family: 'Poppins-Regular', sans-serif;
  color: rgba(0,0,0,1);
  padding: 0 calc(100vw * 14 / 375);
  min-width: 0;
}

.bottom-input input::placeholder {
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  font-family: 'Poppins-Regular', sans-serif;
  color: rgba(60, 48, 48, 0.42);
}

.send-icon {
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  margin-left: calc(100vw * 8 / 375);
  padding: calc(100vw * 7 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  cursor: pointer;
  flex-shrink: 0;
}
</style>
