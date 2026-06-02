<template>
  <div class="page">
    <div v-if="post" class="page-content">
      <!-- 顶部轮播图 -->
      <div class="swipe-wrapper">
        <van-swipe lazy-render :loop="false" class="swipe-container">
          <van-swipe-item v-for="image in images" :key="image" class="swipe-item">
            <img :src="image" class="swipe-img" />
          </van-swipe-item>
          <template #indicator="{ active, total }">
            <div class="indicator-wrapper">
              <span
                v-for="(item, index) in total"
                :key="index"
                :class="['indicator', { active: index === active }]"
              ></span>
            </div>
          </template>
        </van-swipe>
        <!-- 顶部按钮 -->
        <div class="top-btn">
          <BackButton/>
          <MoreButton v-if="post.userId !== currentUserStore.currentUser.userId" @click="showPostReport = true" />
        </div>
      </div>
      <!-- 帖子内容 -->
      <div class="post-content">
        <div class="post-row">
          <div class="user-box">
            <div class="avatar" @click="goOtherHome(postUser.userId)">
              <div class="avatar-img" :style="{ backgroundImage: postUser && `url(${postUser.avator})` }"></div>
            </div>
            <div class="user-name" @click="goOtherHome(postUser.userId)">
              {{ postUser && postUser.name }}
            </div>
          </div>
          <div class="second-box">
            <div class="post-desc">
              {{ post.dynamicDesc }}
            </div>
            <div class="tag-box">
              <div class="tag-text"># {{ postTag }}</div>
            </div>
          </div>
          <div class="like-box" @click="toggleLike">
            <img :src="currentUserStore.currentUser.postLikeIds.includes(postId.toString()) ? likeImage : disLikeImage" alt="like" class="like-icon" />
            <div class="like-count">{{ formattedLikeCount }}</div>
          </div>
        </div>
      </div>
      <!-- Comments -->
      <div class="comments-title">
        <div class="comments-box1"></div>
        <div class="comments-title-text">Comments</div>
        <div class="comments-box2"></div>
      </div>
      <!-- 评论列表 -->
      <div class="comments-list">
        <template v-if="comments.length">
          <div class="comment-item" v-for="(comment, index) in comments" :key="index">
            <div class="comment-list-top">
              <div class="comment-list-user" @click="goOtherHome(comment.userId)">
                <div class="comment-avatar">
                  <div class="comment-avatar-img" :style="{ backgroundImage: `url(${userStore.getUserById(comment.userId).avator})` }"></div>
                </div>
                <div class="comment-user-name">{{ userStore.getUserById(comment.userId).name }}</div>
              </div>
              <div class="comments-list-more" :style="{ backgroundImage: `url(${commentMoreImage})` }" v-if="comment.userId !== currentUserStore.currentUser.userId" @click="handleCommentReport(comment.userId)"></div>
            </div>
            <div class="comment-list-bottom">{{ comment.content }}</div>
          </div>
        </template>
        <template v-else>
          <div class="empty-state">
            <Empty />
          </div>
        </template>
      </div>
      <!-- 输入框 -->
      <div class="input-box">
        <input type="text" placeholder="Say something" class="input-field" v-model="commentInput" />
        <div class="send-btn" :style="{ backgroundImage: `url(${commentSendImage})` }" @click="sendComment"></div>
      </div>
    </div>
    <div v-else class="not-found">
      <p>The post was not found.</p>
    </div>
    <ReportDialog v-if="showPostReport" @close="showPostReport = false" @select="postReportSelect" >
    </ReportDialog>
    <ReportDialog v-if="showCommentReport" @close="showCommentReport = false" @select="commentReportSelect" >
    </ReportDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useCommentsStore } from '@/stores/comment'
import { useUIStore } from '@/stores/ui'
import BackButton from '@/components/back.vue'
import MoreButton from '@/components/more.vue'
import ReportDialog from '@/components/reportChoose.vue'
import likeImage from '@/assets/likepic.png'
import disLikeImage from '@/assets/dislikepic.png'
import commentMoreImage from '@/assets/postpiccommentreport.png'
import commentSendImage from '@/assets/commentsend.png'
import Empty from '@/components/empty.vue'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'

const { postId } = defineProps({
  postId: {
    type: [String, Number],
    required: true
  }
})

const postStore = usePostStore()
const post = postStore.getPostById(postId)
const images = computed(() => {
  return post.dynamicPic
})

const userStore =  useUserStore()
const postUser = userStore.getUserById(post.userId)

const otherStore =  useOtherStore()
const postTag = otherStore.getTagByIndex(post.dynamicTitleType)

const commentsStore = useCommentsStore()
const comments = ref(commentsStore.getCommentsById(postId))

// 评论输入框内容
const commentInput = ref('')

const currentUserStore = useCurrentUserStore()

const router = useRouter()

//帖子举报、拉黑
const showPostReport = ref(false)
const uiStore = useUIStore()

function showPostReportFunc() {
  if (currentUserStore.currentUser.isguest == 1){
    uiStore.openToLogin()
    return
  }
  showPostReport.value = true
}

function postReportSelect(value) {
  showPostReport.value = false
  if (value === 0) {
    router.push({ name: 'report' })
  } else if (value === 1) {
    const postUserId = post.userId

    // 用户选择屏蔽时加入 blockList
    if (postUserId) {
      const blockList = currentUserStore.currentUser.blockList || []

      if (blockList.map(String).includes(String(postUserId))) {
        uiStore.showToast('This user is already in your blacklist.')
        return
      }

      //用户选择屏蔽
      sendShowLoadingToIOS(true)
      blockList.unshift(postUserId)

      // 使用 userStore 公共方法同步更新当前用户并回传 iOS
      userStore.updateUser(currentUserStore.currentUser.userId, { blockList: blockList })
    }

    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      sendShowLoadingToIOS(false)
      sendShowToastToIOS('Blocking successful')

      goBackOrClose()

    }, delay)
  }
}

// 点击用户头像跳转到用户主页
function goOtherHome(userId) {
  if (!userId) return
  router.push({ name: 'otherHome', params: { userId } })
}

// 点赞逻辑
function toggleLike() {
  if (currentUserStore.currentUser.isguest == 1){
    uiStore.openToLogin()
    return
  }

  const postLikeIds = currentUserStore.currentUser.postLikeIds
  // 判断当前用户是否已经点赞
  const likedIndex = postLikeIds.indexOf(postId)

  if (likedIndex === -1) {
    // 未点赞，添加postId到postLikeIds
    postLikeIds.push(postId)
  } else {
    // 已点赞，移除postId
    postLikeIds.splice(likedIndex, 1)
    // 点赞数不减少，保持原有逻辑
  }

  // 同步更新userStore，并回传iOS
  userStore.updateUser(currentUserStore.currentUser.userId, { postLikeIds: postLikeIds })
}

//评论击败、拉黑
const reportCommentUserId = ref(null)
const showCommentReport = ref(false)

function handleCommentReport(userId) {
  if (currentUserStore.currentUser.isguest == 1){
    uiStore.openToLogin()
    return
  }
  reportCommentUserId.value = userId
  showCommentReport.value = true
}

function commentReportSelect(value) {
  showCommentReport.value = false

  const userIdToBlock = reportCommentUserId.value
  if (!userIdToBlock) return

  if (value === 0) {
    router.push({ name: 'report' })
  } else if (value === 1) {
    // 拉黑逻辑
    const blockList = currentUserStore.currentUser.blockList || []
    if (blockList.map(String).includes(String(userIdToBlock))) {
      uiStore.showToast('This user is already in your blacklist.')
      return
    }

    sendShowLoadingToIOS(true)
    blockList.unshift(userIdToBlock)
    userStore.updateUser(currentUserStore.currentUser.userId, { blockList })

    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      sendShowLoadingToIOS(false)
      sendShowToastToIOS('Blocking successful')
      // 重新获取评论列表，过滤掉被拉黑的用户
      comments.value = commentsStore.getCommentsById(postId)

    }, delay)
  }
}

// 发送评论逻辑
function sendComment() {
  if (currentUserStore.currentUser.isguest == 1){
    uiStore.openToLogin()
    return
  }
  const content = commentInput.value.trim()
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
  postStore.updatePostById(postId, { dynamicCommentCount: (post.dynamicCommentCount || 0) + 1 })

  // 清空输入框
  commentInput.value = ''

  // 重新获取评论列表，过滤掉被拉黑的用户
  comments.value = commentsStore.getCommentsById(postId)
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: rgba(245, 245, 245, 1);
  overflow: hidden;
}

.page-content {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: calc(100vh * 116 / 812);
  box-sizing: border-box;
}

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 1rem; /* 留点左右空隙 */
  text-align: center; /* 居中文本 */
}

.not-found p {
  color: #fff;
  font-size: 0.48rem; /* 移动端适配 */
  line-height: 1.5rem;
  word-break: break-word; /* 长文本自动换行 */
}

.swipe-wrapper {
  position: relative;
  height: calc(100vh * 375 / 812);
  overflow: hidden;
}

.swipe-container {
  width: 100%;
  height: 100%; /* 高度填满外层 */
}

.swipe-item {
  width: 100%;
  height: auto; /* 你的 van-swipe 高度 */
  overflow: hidden; /* 超出裁剪 */
}

.swipe-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片铺满容器，超出裁剪 */
  display: block;
}

.indicator-wrapper {
  position: absolute;
  bottom: calc(100vh * 20 / 812);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: calc(100vw * 4 / 375);
}

/* 单个指示器 */
.indicator {
  width: calc(100vw * 10 / 375);
  height: calc(100vh * 5 / 812);
  border-radius: calc(100vw * 45 / 375);
  background: rgba(255, 255, 255, 0.78);
  transition: all 0.3s;
}

/* 选中状态 */
.indicator.active {
  width: calc(100vw * 32 / 375);
  height: calc(100vh * 5 / 812);
  border-radius: calc(100vw * 45 / 375);
  background: rgba(255, 255, 255, 1);
}

.top-btn {
  position: absolute;
  top: calc(100vh * 48 / 812);
  left: calc(100vw * 19 / 375);
  right: calc(100vw * 19 / 375);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.top-btn :deep(.outer-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 0;
  background: transparent;
}

.top-btn :deep(.inner-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  filter: brightness(0) invert(1);
}

.top-btn :deep(.outer-more-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
}

.top-btn :deep(.inner-more-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  filter: brightness(0) invert(1);
}

.post-content {
  padding: calc(100vh * 22 / 812) calc(100vw * 18 / 375) 0;
  background: rgba(245, 245, 245, 1);
}

.post-row {
  display: flex;
  align-items: flex-start;
  gap: calc(100vw * 16 / 375);
}

.user-box {
  width: calc(100vw * 42 / 375);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 7 / 812);
  flex-shrink: 0;
}

.second-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 9 / 812);
  min-width: 0;
  flex: 1;
}

.post-desc {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  color: rgba(60, 48, 48, 0.58);
  line-height: calc(100vw * 18 / 375);
  text-align: left;
  white-space: normal;
  word-break: break-word;
}

.tag-box {
  display: inline-flex;
  height: calc(100vh * 24 / 812);
  border-radius: calc(100vw * 12 / 375);
  background: rgba(60, 48, 48, 0.12);
  justify-content: center;
  align-items: center;
  padding: 0 calc(100vw * 13 / 375);
}

.tag-text {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 12 / 375);
  color: rgba(60, 48, 48, 0.45);
  text-align: center;
}

.post-time {
  font-size: calc(100vw * 12 / 375);
  color: rgba(255,255,255,0.6);
}

.avatar {
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.user-name {
  width: calc(100vw * 48 / 375);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 700;
  line-height: 1.1;
  color: rgba(60, 48, 48, 1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}

.like-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 6 / 812);
  flex-shrink: 0;
  margin-left: auto;
}

.like-icon {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: calc(100vw * 16 / 375);
  padding: calc(100vw * 8 / 375);
  background: rgba(255, 190, 25, 1);
}

.like-count {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  font-style: italic;
  color: rgba(60, 48, 48, 1);
  text-align: center;
  line-height: 1;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
  padding: calc(100vh * 14 / 812) calc(100vw * 24 / 375) 0;
}

.comments-box1 {
  width: calc(100vw * 38 / 375);
  height: calc(100vh * 1 / 812);
  background: rgba(60, 48, 48, 0.62);
}

.comments-title-text {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

.comments-box2 {
  flex: 1; /* 自动填充剩余宽度 */
  height: calc(100vh * 1 / 812);
  background: rgba(60, 48, 48, 0.62);
}

.comments-list {
  padding: calc(100vh * 26 / 812) calc(100vw * 25 / 375) calc(100vh * 48 / 812);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(100vw * 10 / 375);
  overflow: visible;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh * 220 / 812);
}

.comment-item {
  width: 100%;
  min-height: calc(100vh * 210 / 812);
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 18 / 812);
  padding: calc(100vh * 14 / 812) calc(100vw * 14 / 375) calc(100vh * 12 / 812);
  border-radius: calc(100vw * 24 / 375);
  background: rgba(255, 255, 255, 1);
  box-sizing: border-box;
}

.comment-list-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-list-user {
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
  min-width: 0;
}

.comment-list-bottom {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  line-height: calc(100vw * 24 / 375);
  color: rgba(60, 48, 48, 1);
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}

.comment-avatar {
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.comment-user-name {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.comments-list-more {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 20 / 375);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
  flex-shrink: 0;
}

/* 输入框样式 */
.input-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: calc(100vh * 112 / 812);
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(100vh * 12 / 812) calc(100vw * 20 / 375) calc(100vh * 48 / 812);
  box-shadow: rgba(14, 8, 15, 0.1) 0px -4px 26px;
  box-sizing: border-box;
  z-index: 20;
}

.input-field {
  flex: 1;
  height: calc(100vh * 46 / 812);
  border: none;
  outline: none;
  background: rgba(248, 248, 246, 1);
  border-radius: calc(100vw * 28 / 375);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400; /* 可选字体粗细 */
  color: rgba(60, 48, 48, 1);
  padding: 0 calc(100vw * 20 / 375);
  min-width: 0;
}

.input-field::placeholder {
  color: rgba(60, 48, 48, 0.6); /* 提示文本颜色 */
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375); /* 提示文本大小 */
  font-weight: 400; /* 可选字体粗细 */
}

.send-btn {
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  margin-left: calc(100vw * 8 / 375);
  padding: calc(100vw * 7 / 375);
  background-color: rgba(255, 190, 25, 1);
  background-size: calc(100vw * 32 / 375) calc(100vw * 32 / 375);
  border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
}
</style>
