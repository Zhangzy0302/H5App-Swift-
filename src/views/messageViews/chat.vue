<template>
  <div class="page">
    <!-- 顶部背景层 -->
    <div class="top-background"></div>
    <!-- 内容部分 -->
    <div class="content">
      <!-- 顶部内容 -->
      <div class="top-content">
        <div class="left-part">
          <BackButton />
          <div class="user-info" @click="goOtherHome(otherUser.userId)">
            <img class="avatar" :src="otherUser.avator" alt="avatar" />
            <span class="username">{{ otherUser.name }}</span>
          </div>
        </div>

        <div class="right-part">
          <div class="icon-group">
            <img src="@/assets/chatpicicon.png" class="icon" @click="selectImage" />
            <input ref="imageInput" type="file" accept="image/*" style="display:none" @change="handleImageChange" />
            <img src="@/assets/chatvideoicon.png" class="icon" @click="openVideoCall" />
          </div>
          <MoreButton @click="showReport = true" />
        </div>
      </div>

      <!-- 聊天内容 -->
      <div class="chat-content">
        <div v-for="msg in messages" :key="msg.msgId" :class="['chat-item', { 'own-message': msg.userId === currentUserId }]">
          <div class="chat-right">
            <div class="chat-meta">
              <img class="chat-avatar" @click="goOtherHome(msg.userId)" :src="getUserAvatar(msg.userId)" alt="avatar" />
              <div class="chat-time">{{ formatTime(msg.sendTime) }}</div>
            </div>
            <div v-if="msg.sendPicUrl" class="chat-message-image">
              <div class="image-container">
                <img :src="msg.sendPicUrl" alt="send image" />
              </div>
            </div>
            <div v-else class="chat-message" v-text="msg.sendContent"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部输入框 -->
    <div class="bottom-input">
      <input type="text" placeholder="Say something" v-model="inputText" />
      <img class="send-btn" src="@/assets/commentsend.png" alt="send" @click="sendMessage" />
    </div>
    <!-- Video Call Sheet -->
    <transition name="slide-up">
      <div v-if="showVideoCall" class="video-call-sheet">
        <VideoCall :userId="otherUser.userId" @hangup="closeVideoCall" />
      </div>
    </transition>

    <ReportDialog v-if="showReport" @close="showReport = false" @select="reportSelect" >
    </ReportDialog>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatsStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useMessagesStore } from '@/stores/message'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import BackButton from '@/components/back.vue'
import MoreButton from '@/components/more.vue'
import VideoCall from '@/views/messageViews/videocall.vue'
import ReportDialog from '@/components/reportChoose.vue'
import { goBackOrClose } from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'

const props = defineProps({
  chatId: String
})

const chatsStore = useChatsStore()
const userStore = useUserStore()
const currentUserStore = useCurrentUserStore()
const messagesStore = useMessagesStore()
const uiStore = useUIStore()
const router = useRouter()
const currentUserId = currentUserStore.currentUser.userId

// 当前聊天室信息
const currentChat = chatsStore.getChatById(props.chatId)

// 点击用户头像跳转到用户主页
function goOtherHome(userId) {
  if (!userId) return
  router.push({ name: 'otherHome', params: { userId } })
}

// 获取聊天室中除自己以外的另一个用户信息
const otherUser = userStore.getOtherUserInChat(currentChat.chatUserIds)

const messages = ref(messagesStore.getMessagesByChatId(props.chatId))
function getUserAvatar(userId) {
  const user = userStore.getUserById(userId)
  return user?.avator || ''
}

function formatTime(timeStr) {
  const date = new Date(timeStr)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const inputText = ref('')

const imageInput = ref(null)

function selectImage() {
  imageInput.value && imageInput.value.click()
}

async function handleImageChange(e) {

  const file = e.target.files[0]
  if (!file) {
    return
  }

  if (uiStore.loading) return
  uiStore.showLoading()
  try {
    const url = await uploadSingleImage(file, 'template_development')

    console.log('uploaded image url:', url)

    // 这里可以创建一条图片消息
    messagesStore.addMessage?.({
        msgId: String(messagesStore.message.length + 1),
        chatId: props.chatId,
        userId: currentUserStore.currentUser.userId,
        sendContent: "",
        sendPicUrl: url,
        sendTime: new Date().toISOString()
    })

    chatsStore.updateChat?.(props.chatId, {
      lastSendContent : '[image message]',
      lastSendTime : new Date().toISOString(),
      unreadMsgCount : currentChat.unreadMsgCount + 1,
      lastSendUserId : currentUserStore.currentUser.userId
    })

    messages.value = messagesStore.getMessagesByChatId(props.chatId)

  } catch (err) {
    console.error('upload image failed', err)
    uiStore.showToast('Upload failed, please check your network.')
  } finally {
    uiStore.hideLoading()
  }

  e.target.value = ''
}

function sendMessage() {
  if(inputText.value.trim() !== '') {
    // 这里可以创建一条图片消息
    messagesStore.addMessage?.({
        msgId: String(messagesStore.message.length + 1),
        chatId: props.chatId,
        userId: currentUserStore.currentUser.userId,
        sendContent: inputText.value,
        sendPicUrl: '',
        sendTime: new Date().toISOString()
    })

    chatsStore.updateChat?.(props.chatId, {
      lastSendContent : inputText.value,
      lastSendTime : new Date().toISOString(),
      unreadMsgCount : currentChat.unreadMsgCount + 1,
      lastSendUserId : currentUserStore.currentUser.userId
    })

    messages.value = messagesStore.getMessagesByChatId(props.chatId)

    inputText.value = ''
  }
}

const showVideoCall = ref(false)

function openVideoCall() {
  showVideoCall.value = true
}

function closeVideoCall() {
  showVideoCall.value = false
}

const showReport = ref(false)
function reportSelect(value) {
  showReport.value = false
  if (value === 0) {
    router.push({ name: 'report' })
  } else if (value === 1) {
    // 用户选择屏蔽时加入 blockList
    const blockList = currentUserStore.currentUser.blockList || []

    if (blockList.map(String).includes(String(otherUser.userId))) {
      uiStore.showToast('This user is already in your blacklist.')
      return
    }

    //用户选择屏蔽
    if (uiStore.loading) return
    uiStore.showLoading()
    blockList.unshift(otherUser.userId)

    // 使用 userStore 公共方法同步更新当前用户并回传 iOS
    userStore.updateUser(currentUserStore.currentUser.userId, { blockList: blockList })

    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      uiStore.hideLoading()
      uiStore.showToast('Blocking successful')

      goBackOrClose()

    }, delay)
  }
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: rgba(248, 248, 246, 1);
  overflow: hidden;
  color: rgba(60, 48, 48, 1);
}

.top-background {
  width: 100%;
  height: calc(100vh * 98 / 812);
  background:
    radial-gradient(circle at 62% 0%, rgba(255, 146, 98, 0.78) 0%, rgba(255, 146, 98, 0) 27%),
    linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(135, 100, 20, 1) 100%);
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.top-content {
  height: calc(100vh * 98 / 812);
  padding: calc(100vh * 44 / 812) calc(100vw * 18 / 375) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  color: #fff;
}

.top-content :deep(.outer-box),
.top-content :deep(.outer-more-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: 0;
  background: transparent;
}

.top-content :deep(.inner-box),
.top-content :deep(.inner-more-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  filter: brightness(0) invert(1);
}

.left-part,
.right-part,
.user-info,
.icon-group {
  display: flex;
  align-items: center;
}

.left-part {
  gap: calc(100vw * 12 / 375);
  min-width: 0;
}

.user-info {
  gap: calc(100vw * 10 / 375);
  min-width: 0;
}

.avatar {
  width: calc(100vw * 34 / 375);
  height: calc(100vw * 34 / 375);
  border-radius: 50%;
  border: calc(100vw * 1 / 375) solid rgba(255, 255, 255, 0.7);
  object-fit: cover;
  flex-shrink: 0;
}

.username {
  max-width: calc(100vw * 128 / 375);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-part {
  gap: calc(100vw * 16 / 375);
  flex-shrink: 0;
}

.icon-group {
  gap: calc(100vw * 18 / 375);
}

.icon {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  cursor: pointer;
  filter: brightness(0) invert(1);
}

.chat-content {
  flex: 1;
  min-height: 0;
  border-radius: calc(100vw * 15 / 375) calc(100vw * 15 / 375) 0 0;
  background: rgba(248, 248, 246, 1);
  overflow-y: auto;
  padding: calc(100vh * 34 / 812) calc(100vw * 18 / 375) calc(100vh * 108 / 812);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 28 / 812);
  box-sizing: border-box;
}

.chat-item {
  display: flex;
  width: 100%;
  justify-content: flex-start;
}

.chat-item.own-message {
  justify-content: flex-end;
}

.chat-avatar {
  width: calc(100vw * 42 / 375);
  height: calc(100vw * 42 / 375);
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.9);
}

.chat-right {
  max-width: calc(100vw * 238 / 375);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 9 / 812);
}

.chat-item.own-message .chat-right {
  align-items: flex-end;
}

.chat-meta {
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
}

.chat-item.own-message .chat-meta {
  flex-direction: row-reverse;
}

.chat-time {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(60, 48, 48, 0.36);
}

.chat-message {
  max-width: 100%;
  box-sizing: border-box;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 400;
  line-height: 1.45;
  color: #fff;
  min-height: calc(100vh * 40 / 812);
  padding: calc(100vh * 11 / 812) calc(100vw * 15 / 375);
  border-radius: calc(100vw * 13 / 375);
  background: rgba(255, 190, 25, 1);
  overflow-wrap: anywhere;
}

.chat-item.own-message .chat-message {
  background: rgba(60, 48, 48, 1);
  border-radius: calc(100vw * 13 / 375);
}

.chat-message-image {
  max-width: calc(100vw * 181 / 375);
}

.chat-message-image .image-container {
  overflow: hidden;
  border-radius: calc(100vw * 13 / 375);
  background: rgba(255, 255, 255, 1);
}

.chat-message-image .image-container img {
  display: block;
  width: calc(100vw * 181 / 375);
  height: calc(100vw * 181 / 375);
  border-radius: calc(100vw * 13 / 375);
  object-fit: cover;
}

.bottom-input {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh * 88 / 812);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 calc(-2 * 100vw / 375) calc(18 * 100vw / 375) rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: flex-start;
  padding: calc(100vh * 9 / 812) calc(100vw * 18 / 375) calc(100vh * 32 / 812);
  gap: calc(100vw * 8 / 375);
  box-sizing: border-box;
}

.bottom-input input {
  flex: 1;
  height: calc(100vh * 47 / 812);
  border: none;
  outline: none;
  border-radius: calc(100vw * 24 / 375);
  background: rgba(248, 248, 246, 1);
  padding: 0 calc(100vw * 15 / 375);
  box-sizing: border-box;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  color: rgba(60, 48, 48, 1);
}

.bottom-input input::placeholder {
  color: rgba(60, 48, 48, 0.28);
}

.send-btn {
  width: calc(100vw * 46 / 375);
  height: calc(100vw * 46 / 375);
  padding: calc(100vw * 11 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  box-sizing: border-box;
  cursor: pointer;
}

.video-call-sheet {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
