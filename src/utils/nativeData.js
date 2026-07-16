import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useCommentsStore } from '@/stores/comment'
import { useChatsStore } from '@/stores/chat'
import { useMessagesStore } from '@/stores/message'
import { sendRequestNativeDataToIOS } from '@/utils/iosBridge'

const retryDelays = [300, 1000, 2200]

function replaceList(target, source) {
  if (!Array.isArray(source)) return target
  target.splice(0, target.length, ...source)
  return target
}

function applyNativeData(detail = {}) {
  const currentUserStore = useCurrentUserStore()
  const userStore = useUserStore()
  const postStore = usePostStore()
  const commentStore = useCommentsStore()
  const chatStore = useChatsStore()
  const messageStore = useMessagesStore()

  if (detail.currentUser) {
    currentUserStore.setCurrentUser(detail.currentUser)
  }

  replaceList(userStore.users, detail.userList)
  replaceList(postStore.posts, detail.postList)
  replaceList(commentStore.comment, detail.commentList)
  replaceList(chatStore.chat, detail.chatList)
  replaceList(messageStore.message, detail.messageList)
  window.userList = userStore.users
  window.postList = postStore.posts
  window.commentList = commentStore.comment
  window.chatList = chatStore.chat
  window.messageList = messageStore.message
  window.__kaelNativeDataReady = true
}

export function setupNativeDataRetry() {
  window.addEventListener('nativeDataReady', event => {
    applyNativeData(event.detail)
  })

  retryDelays.forEach(delay => {
    window.setTimeout(() => {
      if (window.__kaelNativeDataReady === true) return
      sendRequestNativeDataToIOS()
    }, delay)
  })
}
