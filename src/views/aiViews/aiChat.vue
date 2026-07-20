<template>
  <div class="page">
    <div class="aiusermodel"></div>
    <!-- <div class="aichatmodel"></div> -->
    <div class="page-container">
      <!-- top -->
      <div class="top-section">
        <BackButton />
      </div>
      <!-- center -->
      <div class="center-section">
        <div class="center-title">
          Hi, I'm Sien AI—your singing buddy! Let’s make some music together.
        </div>
        <!-- <div
          v-for="(item, index) in messages"
          :key="index"
          class="message-box"
          @click="handleMessageClick(item)"
        >
          <span>{{ item }}</span>
        </div> -->
      </div>
      <!-- bottom -->
      <div class="bottom-section">
        <div class="bottom-scroll">
          <div v-for="(item, index) in bottomItems" :key="index" class="chat-item">
            <div class="chat-choose" v-if="item.sendId === '0'">
                <div class="chat-time">{{ item.time }}</div>
                    <div class="chat-content">
                    <!-- <img class="chat-avatar" src="@/assets/aiavator.png" alt="AI Avatar" /> -->
                    <div class="chat-message">{{ item.message }}</div>
                </div>
            </div>
            <div class="chat-choose" v-else>
                <div class="chat-time">{{ item.time }}</div>
                    <div class="chat-content-rigth">
                    <div class="chat-message-rigth">{{ item.message }}</div>
                    <div class="chat-avatar-rigth">
                      <img :src="currentUserStore.currentUser.avator" loading="lazy" decoding="async" alt="AI Avatar" />
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
      <input type="text" placeholder="Say something" v-model="chatInput" @focus="handleInputFocus" />
      <img class="send-btn" src="@/assets/commentsend.png" alt="Send" @click="sendMessage" />
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
import { preventGuestInput, requireLoginForGuest } from '@/utils/guest'

const messages = ref([
  "I'm feeling great today.",
  "Do you like reading?",
  "Can you comfort me?"
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
  { sendId: '0', time: getFirstTime(), message: 'Hi there! I’m Sien, your AI buddy for all things fun and.' },
])

async function handleMessageClick(message) {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  bottomItems.value.push({
    sendId: currentUserStore.currentUser.id,
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

function handleInputFocus(event) {
  preventGuestInput(event, currentUserStore, uiStore)
}

async function sendMessage() {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  const text = chatInput.value.trim()
  if (!text) return

  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  bottomItems.value.push({
    sendId: currentUserStore.currentUser.id,
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
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* prevent scrolling */
  background-color: #000; /* black background */
  background-image: url('@/assets/ruqoijaA.png'); /* replace with your asset filename */
  background-size: 100% auto;
  /* background-size: cover; */
  background-position: top;
  background-repeat: no-repeat;
}

.aiusermodel {
  position: absolute;
  left: calc(100vw * 20 / 375);
  top: calc(100vh * 40 / 812); /* adapt top spacing */
  width: calc(100vw * 179 / 375);
  height: calc(100vh * 314 / 812);
  opacity: 1;
  /* background-image: url('@/assets/aiusermodel.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
  z-index: 1;
}

.aichatmodel {
  position: absolute;
  left: calc(100vw * 181 / 375);
  top: calc(100vh * 62 / 812);
  width: calc(100vw * 104 / 375);
  height: calc(100vh * 38 / 812);
  opacity: 1;
  background-image: url('@/assets/aichatmodel.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.top-section {
  position: relative;
  margin-top: calc(100vh * 58 / 812);
  margin-left: calc(100vw * 20 / 375);
  z-index: 100;
}

.center-section {
  margin-top: calc(100vh * 41 / 812);
  margin-left: calc(100vw * 23 / 375);
  margin-right: calc(100vw * 155 / 375);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 12 / 812);
}

.center-title {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  color: white;
}

.message-box {
  display: inline-flex;
  align-items: center;
  height: calc(100vh * 36 / 812);
  padding: 0 calc(100vw * 10 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(calc(100vw * 4 / 375));
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
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
  top: calc(100vh * 325 / 812); /* adjust top spacing as needed */
  /* background: rgba(255, 255, 255, 1); */
  border-radius: calc(100vw * 40 / 375) calc(100vw * 40 / 375) 0 0;
  z-index: 2;
}

.bottom-scroll {
  height: calc(100% - calc(100vh * 20 / 812));
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-top: calc(100vh * 20 / 812);
  padding-bottom: calc(100vh * 90 / 812);
  box-sizing: border-box;
  gap: calc(100vh * 24 / 812);
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
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 17.41 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.6);
}

.chat-content {
  display: flex;
  align-items: flex-start;
  gap: calc(100vw * 12 / 375);
  margin-left: calc(100vw * 20 / 375);
  margin-right: calc(100vw * 34 / 375);
}

.chat-content-rigth {
  display: flex;
  align-items: flex-start;
  justify-content: end;
  gap: calc(100vw * 12 / 375);
  margin-left: calc(100vw * 34 / 375);
  margin-right: calc(100vw * 20 / 375);
}

.chat-avatar {
  width: calc(100vw * 44 / 375);
  height: calc(100vw * 44 / 375);
  border-radius: 50%;
}

.chat-avatar-rigth {
  width: calc(100vw * 44 / 375);
  height: calc(100vw * 44 / 375);
  flex-shrink: 0;
  border-radius: 50%; /* fully circular */
  padding: calc(100vw * 1 / 375); /* border thickness */
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
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
  border-radius: calc(100vw * 16 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: calc(100vh * 13 / 812) calc(100vw * 16 / 375);
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 1);
}

.chat-message-rigth {
  border-radius: calc(100vw * 16 / 375);
  background: rgba(67, 64, 68, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: calc(100vh * 13 / 812) calc(100vw * 16 / 375);
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}

.bottom-input {
  position: absolute;
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375);
  bottom: calc(100vh * 29 / 812);
  height: calc(100vw * 46 / 375);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(calc(100vw * 32 / 375));
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: 0 0 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
  z-index: 200;
}

.bottom-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: #000;
}

.bottom-input input::placeholder {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  color: rgba(0, 0, 0, 0.4);
}

.send-btn {
  width: calc(100vw * 46 / 375);
  height: calc(100vw * 46 / 375);
  cursor: pointer;
}
</style>
