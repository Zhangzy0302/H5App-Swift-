<template>
  <div class="page">
    <!-- 全屏视频播放器 -->
    <video
      ref="videoRef"
      class="video-player"
      :src="post && post.dynamicVideo"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline
      preload="auto"
      @click="togglePlay"
      @loadstart="showVideoLoading"
      @waiting="showVideoLoading"
      @loadeddata="hideVideoLoading"
      @canplay="hideVideoLoading"
      @playing="hideVideoLoading"
      @error="hideVideoLoading"
    ></video>

    <div v-if="isVideoLoading" class="video-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- center pause/play icon -->
    <img
      v-show="isPaused && !isVideoLoading"
      class="video-center-icon"
      src="@/assets/videopluse.png"
      alt="play"
      @click="togglePlay"
    />

    <!-- 底部阴影区域 -->
    <div class="bottom-shadow"></div>
    <!-- 内容部分 -->
    <div class="content">
      <!-- 顶部按钮 -->
      <div class="top-actions">
        <BackButton />
        <MoreButton v-if="post.userId !== currentUserStore.currentUser.userId" @click="showPostReportFunc" />
      </div>

      <!-- 底部信息 -->
      <div class="bottom-info">
        <div class="user-left"> 
          <div class="avatar-wrap">
            <div class="avatar" @click="goOtherHome(post.userId)">
              <img :src="postUser && postUser.avator" alt="avatar" />
            </div>
            <div class="follow" v-if="post.userId !== currentUserStore.currentUser.userId && !currentUserStore.currentUser.follow.includes(post.userId)" @click="handleFollow" >
              +
            </div>
          </div>

          <div class="user-text">
            <div class="username"  @click="goOtherHome(post.userId)">{{ postUser && postUser.name }}</div>
            <div class="video-desc">{{ post && post.dynamicDesc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 喜欢、评论数 -->
    <div class="action-buttons">
      <div class="action-button comment-action" @click="uiStore.openComment()">
        <div class="action-icon">
          <img src="@/assets/chaticon.png" alt="comment" />
        </div>
        <span>{{ formattedCommentCount }}</span>
      </div>
      <div class="action-button like-action" @click="toggleLike">
        <div class="action-icon">
          <img v-if="currentUserStore.currentUser.postLikeIds.includes(post.dynamicId)" src="@/assets/likepic.png" alt="like" />
          <img v-else src="@/assets/dislikepic.png" alt="like" />
        </div>
        <span>{{ formattedLikeCount }}</span>
      </div>
    </div>

    <!-- 评论弹窗（底部弹出） -->
    <div v-if="uiStore.showComment" class="comment-overlay" @click.self="uiStore.closeComment()">
      <div class="comment-sheet">
        <Comment :postId="postId" :reportAction="commentAction" @openCommentReport="showCommentReport = true" />
      </div>
    </div>
    <ReportDialog v-if="showPostReport" @close="showPostReport = false" @select="postReportSelect" >
    </ReportDialog>
    <ReportDialog v-if="showCommentReport" @close="showCommentReport = false" @select="commentReportSelect" >
    </ReportDialog>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { onMounted, onBeforeUnmount } from 'vue'
import BackButton from '@/components/back.vue'
import MoreButton from '@/components/more.vue'
import Comment from '@/views/postViews/comment.vue'
import ReportDialog from '@/components/reportChoose.vue'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS } from '@/utils/iosBridge'

const { postId } = defineProps({
  postId: {
    type: [String, Number],
    required: true
  }
})

const postStore = usePostStore()
const post = postStore.getPostById(postId)

const userStore =  useUserStore()
const postUser = userStore.getUserById(post.userId)

const formattedLikeCount = computed(() => {
  const count = post.dynamicLikeCount || 0
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  }
  return count
})

const formattedCommentCount = computed(() => {
  const count = post.dynamicCommentCount || 0
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  }
  return count
})

const videoRef = ref(null)
const isPaused = ref(false)
const isVideoLoading = ref(true)

const currentUserStore = useCurrentUserStore()
const router = useRouter()
const uiStore = useUIStore()

function togglePlay() {
  const video = videoRef.value
  if (!video) return

  if (video.paused) {
    showVideoLoading()
    video.play()
      .then(() => {
        isPaused.value = false
      })
      .catch(() => {
        isPaused.value = true
        hideVideoLoading()
      })
  } else {
    video.pause()
    isPaused.value = true
  }
}

function showVideoLoading() {
  isVideoLoading.value = true
}

function hideVideoLoading() {
  isVideoLoading.value = false
}

onMounted(() => {
  const video = videoRef.value
  if (video) {
    if (video.readyState >= 2) {
      hideVideoLoading()
    }
    video.play().then(() => {
      isPaused.value = false
      hideVideoLoading()
    }).catch(() => {
      isPaused.value = true
      hideVideoLoading()
    })
  }
})

onBeforeUnmount(() => {
  const video = videoRef.value
  if (video) {
    video.pause()
  }
})

//帖子举报、拉黑
const showPostReport = ref(false)
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
// Handle follow action
function handleFollow() {
  if (currentUserStore.currentUser.isguest == 1) {
    uiStore.openToLogin()
    return
  }
  const currentUserId = currentUserStore.currentUser.userId
  const postUserId = post.userId

  // Update current user's follow list
  const currentUserFollow = currentUserStore.currentUser.follow ? [...currentUserStore.currentUser.follow] : []
  if (!currentUserFollow.includes(postUserId)) {
    currentUserFollow.unshift(postUserId)
  }

  // Update post user's fans list
  const postUserFans = postUser.fans ? [...postUser.fans] : []
  if (!postUserFans.includes(currentUserId)) {
    postUserFans.unshift(currentUserId)
  }

  // Update current user store and user store
  userStore.updateUser(currentUserId, { follow: currentUserFollow })

  userStore.updateUser(postUserId, { fans: postUserFans })
  
  sendShowToastToIOS('Followed successfully')
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
  const currentPostId = String(postId)
  const postLikeIds = currentUserStore.currentUser.postLikeIds ? [...currentUserStore.currentUser.postLikeIds] : []
  let dynamicLikeCount = post.dynamicLikeCount || 0
  // 判断当前用户是否已经点赞
  const likedIndex = postLikeIds.indexOf(currentPostId)

  if (likedIndex === -1) {
    // 未点赞，添加postId到postLikeIds
    postLikeIds.push(currentPostId)
    dynamicLikeCount += 1
  } else {
    // 已点赞，移除postId
    postLikeIds.splice(likedIndex, 1)
    dynamicLikeCount = Math.max(dynamicLikeCount - 1, 0)
  }

  // 同步更新userStore，并回传iOS
  userStore.updateUser(currentUserStore.currentUser.userId, { postLikeIds: postLikeIds })
  // 同步更新postStore，并回传iOS
  postStore.updatePostById(currentPostId, { dynamicLikeCount: dynamicLikeCount })
}

//评论举报、拉黑显示
const showCommentReport = ref(false)
const commentAction = ref(null) // 保存 0 或 1

function commentReportSelect(value) {
  showCommentReport.value = false
  commentAction.value = null
  nextTick(() => {
    commentAction.value = value  // 保存选择
  })
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  overflow: hidden;
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(14, 8, 15, 0.34);
  z-index: 2;
  pointer-events: none;
}

.loading-spinner {
  width: calc(100vw * 42 / 375);
  height: calc(100vw * 42 / 375);
  border-radius: 50%;
  border: calc(100vw * 4 / 375) solid rgba(255, 255, 255, 0.32);
  border-top-color: rgba(255, 190, 25, 1);
  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.video-center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw * 60 / 375);
  height: calc(100vw * 60 / 375);
  filter: brightness(0) invert(1);
  z-index: 2;
}

.bottom-shadow {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: calc(100vh * 210 / 812);
  background: linear-gradient(180deg, rgba(14, 8, 15, 0) 0%, rgba(14, 8, 15, 0.72) 100%);
  pointer-events: none;
}
 
.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(100vh * 54 / 812) calc(100vw * 24 / 375) 0;
  box-sizing: border-box;
  z-index: 3;
  pointer-events: none; /* allow clicks to pass through */
}

/* Overlay pseudo-element for pass-through area */
.content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* re-enable pointer-events for interactive children */
.top-actions, .top-actions *,
.bottom-info, .bottom-info *,
.follow, .follow * {
  pointer-events: auto;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-actions :deep(.outer-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: 0;
  background: transparent;
}

.top-actions :deep(.inner-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  filter: brightness(0) invert(1);
}

.bottom-info {
  position: absolute;
  left: calc(100vw * 24 / 375);
  right: calc(100vw * 24 / 375);
  bottom: calc(100vh * 113 / 812);
  display: flex;
  align-items: center;
}

.user-left {
  display: flex;
  align-items: center;
  gap: calc(100vw * 13 / 375);
  min-width: 0;
}

.avatar {
  width: calc(100vw * 59 / 375);
  height: calc(100vw * 59 / 375);
  border-radius: 50%;
  border: calc(100vw * 2 / 375) solid rgba(255, 190, 25, 1);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  margin-bottom: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-wrap {
  position: relative;
  width: calc(100vw * 59 / 375);
  height: calc(100vw * 59 / 375);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.follow {
  position: absolute;
  right: calc(100vw * -1 / 375);
  bottom: calc(100vh * 1 / 812);
  transform: none;
  width: calc(100vw * 22 / 375);
  height: calc(100vw * 22 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  color: rgba(60, 48, 48, 1);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 18 / 375);
  font-weight: 700;
  line-height: calc(100vw * 22 / 375);
  text-align: center;
  cursor: pointer;
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 4 / 812);
}

.username {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: calc(100vw * 20 / 375);
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100vw * 210 / 375);
}

.video-desc {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  letter-spacing: 0px;
  line-height: calc(100vw * 18 / 375);
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100vw * 218 / 375);
}

.action-buttons {
  position: absolute;
  left: calc(100vw * 20 / 375);
  right: calc(100vw * 20 / 375);
  bottom: calc(100vh * 31 / 812);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(100vw * 17 / 375);
  z-index: 4;
}

.action-button {
  width: 100%;
  height: calc(100vh * 58 / 812);
  border-radius: calc(100vw * 18 / 375);
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(calc(100vw * 8 / 375));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding-top: calc(100vh * 21 / 812);
  box-sizing: border-box;
}

.action-icon {
  position: absolute;
  top: calc(100vh * -18 / 812);
  width: calc(100vw * 45 / 375);
  height: calc(100vw * 45 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon img {
  width: calc(100vw * 25 / 375);
  height: calc(100vw * 25 / 375);
  object-fit: contain;
}

.action-button span {
  position: absolute;
  bottom: calc(100vh * 8 / 812);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  font-style: italic;
  line-height: 1;
  color: rgba(255, 255, 255, 1);
}

.comment-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 100;
}

.comment-sheet {
  width: 100%;
  height: calc(100vh * 508 / 812);
  animation: slideUp 0.3s forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
