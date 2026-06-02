<template>
  <div class="comment">
    <div class="comment-container">
      <!-- 标题部分 -->
      <div class="comment-header">
        <div class="header-line" style="max-width: calc(100vw * 31 / 375);"></div>
        <div class="header-title">Comments</div>
        <div class="header-line"></div>
      </div>

      <!-- 评论列表 -->
      <div v-if="comments.length > 0" class="comment-list" >
        <div v-for="(item, index) in comments" :key="index" class="comment-item">
          <div class="comment-top">
            <div class="comment-user" @click="goOtherHome(item.userId)">
              <div class="avatar">
                <img :src="userStore.getUserById(item.userId).avator" alt="avatar" />
              </div>
              <div class="username">{{ userStore.getUserById(item.userId).name }}</div>
            </div>
            <img @click="openComment(item.userId)" v-if="item.userId !== currentUserStore.currentUser.userId" class="report-btn" src="@/assets/postpiccommentreport.png" alt="report" />
          </div>
          <div class="comment-text">{{ item.content }}</div>
        </div>
      </div>
      <Empty class="empty" v-else />
    </div>

    <!-- Bottom input box -->
    <div class="bottom-input">
      <input type="text" placeholder="Say something" v-model="inputText" />
      <img class="send-btn" src="@/assets/commentsend.png" alt="send" @click="sendComment" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCommentsStore } from '@/stores/comment'
import { useUserStore } from '@/stores/user'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { usePostStore } from '@/stores/post'
import ReportDialog from '@/components/reportChoose.vue'
import Empty from '@/components/empty.vue'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true
  },
  reportAction: {
    type: Number,
    default: null
  } // 0 或 1
})

const postId = props.postId

const router = useRouter()

const uiStore = useUIStore()
const commentsStore = useCommentsStore()
const userStore =  useUserStore()
const currentUserStore = useCurrentUserStore()
const postStore = usePostStore()
const comments = ref(commentsStore.getCommentsById(postId))

// 点击用户头像跳转到用户主页
function goOtherHome(userId) {
  if (!userId) return
  router.push({ name: 'otherHome', params: { userId } })
}

const inputText = ref('')

function sendComment() {
  const content = inputText.value.trim()
  if (!content) return // 输入为空直接返回

  // 创建评论对象
  const newComment = {
    commentId: String(commentsStore.comment.length + 1),
    dynamicId: String(postId),
    userId: currentUserStore.currentUser.userId,
    content: content
  }

  // 添加到评论 store
  commentsStore.addComment(newComment)

  // 更新帖子评论数量
  const post = postStore.getPostById(postId)
  postStore.updatePostById(postId, { dynamicCommentCount: (post.dynamicCommentCount || 0) + 1 })

  // 清空输入框
  inputText.value = ''

  // 重新获取评论列表，过滤掉被拉黑的用户
  comments.value = commentsStore.getCommentsById(postId)
}

const emit = defineEmits(['openCommentReport'])

// 打开帖子举报
function openComment(userId) {
  reportCommentUserId.value = userId
  emit('openCommentReport')
}

//帖子举报、拉黑
const reportCommentUserId = ref(null)

watch(
  () => props.reportAction,
  (newVal) => {
    if (newVal === null) return

    if (newVal === 0) {
      router.push({ name: 'report' })
    } else if (newVal === 1) {
      const blockList = currentUserStore.currentUser.blockList || []
      if (blockList.map(String).includes(String(reportCommentUserId.value))) {
        uiStore.showToast('This user is already in your blacklist.')
        return
      }

      if (uiStore.loading) return
      uiStore.showLoading()
      blockList.unshift(reportCommentUserId.value)
      userStore.updateUser(currentUserStore.currentUser.userId, { blockList })

      const delay = Math.floor(Math.random() * 1500) + 500

      setTimeout(() => {
        uiStore.hideLoading()
        uiStore.showToast('Blocking successful')
        // 重新获取评论列表，过滤掉被拉黑的用户
        comments.value = commentsStore.getCommentsById(postId)

      }, delay)
    }
  }
)
</script>

<style scoped>
.comment {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(100vw * 16 / 375) calc(100vw * 16 / 375) 0 0;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 228, 161, 1) 22%, rgba(248, 248, 246, 1) 42%, rgba(248, 248, 246, 1) 100%);
  box-sizing: border-box;
  overflow: hidden;
}

/* .comment::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100vh * 56 / 812);
  background: rgba(255, 190, 25, 1);
  pointer-events: none;
} */

.comment-container {
  position: relative;
  z-index: 1;
  height: 100%;
  padding-bottom: calc(100vh * 92 / 812);
  box-sizing: border-box;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
  padding: calc(100vh * 28 / 812) calc(100vw * 17 / 375) 0;
}

.header-line {
  flex: 1;
  height: 1px;
  background: rgba(60, 48, 48, 1);
}

.header-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
  white-space: nowrap;
}

.comment-list {
  padding: calc(100vh * 18 / 812) calc(100vw * 17 / 375) calc(100vh * 16 / 812);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 10 / 812);
  overflow-y: auto;
  max-height: calc(100% - calc(100vh * 58 / 812));
  box-sizing: border-box;
}

.comment-item {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 8 / 812);
  min-height: calc(100vh * 69 / 812);
  padding: calc(100vh * 12 / 812) calc(100vw * 14 / 375) calc(100vh * 10 / 812);
  border-radius: calc(100vw * 14 / 375);
  background: rgba(255, 255, 255, 1);
  box-sizing: border-box;
}

.comment-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
  min-width: 0;
}

.avatar {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.username {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.report-btn {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 20 / 375);
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.comment-text {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 13 / 375);
  font-weight: 400;
  line-height: calc(100vw * 16 / 375);
  letter-spacing: 0;
  color: rgba(60, 48, 48, 0.58);
  text-align: left;
}

.bottom-input {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  height: calc(100vh * 91 / 812);
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
  padding: calc(100vh * 12 / 812) calc(100vw * 17 / 375) calc(100vh * 35 / 812);
  box-sizing: border-box;
}

.bottom-input input {
  flex: 1;
  height: calc(100vh * 40 / 812);
  border: none;
  outline: none;
  border-radius: calc(100vw * 22 / 375);
  background: rgba(248, 248, 246, 1);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
  min-width: 0;
  padding: 0 calc(100vw * 13 / 375);
}

.bottom-input input::placeholder {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  color: rgba(60, 48, 48, 0.42);
}

.send-btn {
  width: calc(100vw * 40 / 375);
  height: calc(100vw * 40 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  cursor: pointer;
  flex-shrink: 0;
}

.empty {
  padding: calc(100vw * 60 / 375) 0 0;
}
</style>
