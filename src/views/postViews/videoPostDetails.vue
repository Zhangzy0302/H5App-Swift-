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
    ></video>

    <!-- center pause/play icon -->
    <img
      v-show="isPaused"
      class="video-center-icon"
      src="@/assets/videopluse.png"
      alt="play"
      @click="togglePlay"
    />

    <!-- 底部阴影区域 -->
    <div class="bottom-shadow"></div>
    <div class="bottom-bar">
      <!-- 喜欢、评论数 -->
    
    <!-- 内容部分 -->
    <div class="content">
      <!-- 顶部按钮 -->
      <div class="top-actions">
        <BackButton />
        <MoreButton v-if="post.userId !== currentUserStore.currentUser.userId" @click="handlePostReport" />
      </div>

      <!-- 底部信息 -->
      <div class="bottom-info">
        <div class="user-left"> 
          <div class="avatar-wrap">
            <div class="avatar" @click="goOtherHome(post.userId)">
              <img :src="postUser && postUser.avator" alt="avatar" />
            </div>
            <div class="follow" v-if="post.userId !== currentUserStore.currentUser.userId && !currentUserStore.currentUser.follow.includes(post.userId)" @click="handleFollow" >
              <img src="@/assets/follow.png" alt="follow" />
            </div>
          </div>

          <div class="user-text">
            <div class="username"  @click="goOtherHome(post.userId)">{{ postUser && postUser.name }}</div>
            <div class="video-desc">{{ post && post.dynamicDesc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      
      <div class="action-button" @click="openComment">
        <img src="@/assets/chaticon.png" alt="comment" />
        <span>{{ post.dynamicCommentCount }}</span>
      </div>
      <div class="action-button" @click="toggleLike">
        <img v-if="currentUserStore.currentUser.postLikeIds.includes(post.dynamicId)" src="@/assets/likepic.png" alt="like" />
        <img v-else src="@/assets/dislikepic.png" alt="like" />
        <span>{{post.dynamicLikeCount + (currentUserStore.currentUser.postLikeIds.includes(post.dynamicId) ? 1 : 0) }}</span>
      </div>
    </div>
    </div>
    

    

    <!-- 评论弹窗（底部弹出） -->
    <div v-if="uiStore.showComment" class="comment-overlay" @click.self="uiStore.closeComment()">
      <div class="comment-sheet">
        <Comment :postId="postId" :reportAction="commentAction" @openCommentReport="handleOpenCommentReport" />
      </div>
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
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUIStore } from '@/stores/ui'
import { onMounted, onBeforeUnmount } from 'vue'
import BackButton from '@/components/back.vue'
import MoreButton from '@/components/more.vue'
import Comment from '@/views/postViews/comment.vue'
import ReportDialog from '@/components/reportChoose.vue'
import { goBackOrClose } from '@/utils/iosBridge'
import { requireLoginForGuest } from '@/utils/guest'

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

const videoRef = ref(null)
const isPaused = ref(false)

const currentUserStore = useCurrentUserStore()
const router = useRouter()
const uiStore = useUIStore()

function togglePlay() {
  const video = videoRef.value
  if (!video) return

  if (video.paused) {
    video.play()
    isPaused.value = false
  } else {
    video.pause()
    isPaused.value = true
  }
}

onMounted(() => {
  const video = videoRef.value
  if (video) {
    video.play().then(() => {
      isPaused.value = false
    }).catch(() => {
      isPaused.value = true
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
function handlePostReport() {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  showPostReport.value = true
}

function postReportSelect(value) {
  if (requireLoginForGuest(currentUserStore, uiStore)) {
    showPostReport.value = false
    return
  }

  showPostReport.value = false
  if (value === 0) {
    router.push({ name: 'report' })
  } else if (value === 1) {
    //用户选择屏蔽
    if (uiStore.loading) return
    uiStore.showLoading()

    const postUserId = post.userId

    // 用户选择屏蔽时加入 blockList
    if (postUserId) {
      const blockList = currentUserStore.currentUser.blockList || []

      // 不存在才加入，避免重复
      if (!blockList.includes(postUserId)) {
        blockList.unshift(postUserId)

        // 使用 userStore 公共方法同步更新当前用户并回传 iOS
        userStore.updateUser(currentUserStore.currentUser.userId, { blockList: blockList })
      }
    }

    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      uiStore.hideLoading()
      uiStore.showToast('Blocking successful')

      goBackOrClose()

    }, delay)
  }
}

// Handle follow action
function handleFollow() {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

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
  
  uiStore.showToast('Followed successfully')
}

// 点击用户头像跳转到用户主页
function goOtherHome(userId) {
  if (!userId) return
  router.push({ name: 'otherHome', params: { userId } })
}

// 点赞逻辑
function toggleLike() {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

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

//评论举报、拉黑显示
const showCommentReport = ref(false)
const commentAction = ref(null) // 保存 0 或 1

function openComment() {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  uiStore.openComment()
}

function handleOpenCommentReport() {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  showCommentReport.value = true
}

function commentReportSelect(value) {
  if (requireLoginForGuest(currentUserStore, uiStore)) {
    showCommentReport.value = false
    return
  }

  commentAction.value = value  // 保存选择
  showCommentReport.value = false
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: rgba(1, 1, 1, 1);
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

.video-center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw * 60 / 375);
  height: calc(100vw * 60 / 375);
  z-index: 2;
}

.bottom-shadow {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: calc(100vh * 96 / 812);
  background: linear-gradient(180deg, rgba(14, 8, 15, 0.8) 0%, rgba(14, 8, 15, 0) 100%);
  pointer-events: none;
  transform: rotate(180deg);
}

.bottom-bar {
  display: flex;
  flex-direction: column;   /* 👈 关键 */
  justify-content: space-between;
  height: 100%;
}
 
.content {
  position: absolute;
  top: 0;   /* ✅ 改这里 */
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: calc(100vh * 58 / 812)
           calc(100vw * 20 / 375)
           calc(100vh * 120 / 812); /* 👈 把 bottom 偏移放到 padding */

  box-sizing: border-box;
  pointer-events: none;
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
  z-index: 10;
}

.bottom-info {
  display: flex;
  align-items: center;
}

.user-left {
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
}

.avatar {
  width: calc(100vw * 48 / 375);
  height: calc(100vw * 48 / 375);
  border-radius: 50%;
  padding: calc(100vw * 1 / 375); /* border thickness */
  background: rgba(255, 255, 255, 0.6);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  margin-bottom: calc(100vw * 4 / 375);
  box-sizing: border-box;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-wrap {
  position: relative;
  width: calc(100vw * 48 / 375);
  height: calc(100vw * 57 / 375); /* avatar 48 + gap 4 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.follow {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: calc(100vw * 20 / 375);
  height: calc(100vw * 20 / 375);
  border-radius: calc(100vw * 40 / 375);
  /* background: rgba(255, 255, 255, 1); */
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(calc(100vw * 10 / 375));
  cursor: pointer;
}

.follow img {
  width: calc(100vw * 20 / 375);
  height: calc(100vw * 20 / 375);
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 4 / 812);
}

.username {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.48 / 375);
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100vw - calc(100vw * 48 / 375) - calc(100vw * 16 / 375) - calc(100vw * 40 / 375)); /* avatar width + gap + padding */
}

.video-desc {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  letter-spacing: 0;
  line-height: calc(100vw * 15.23 / 375);
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100vw - calc(100vw * 48 / 375) - calc(100vw * 16 / 375) - calc(100vw * 40 / 375)); /* avatar width + gap + padding */
}

.action-buttons {
  position: absolute;
  bottom: calc(100vh * 37 / 812);
  left: 0;
  width: 100%;
  padding: 0 calc(100vw * 20 / 375);
  box-sizing: border-box;
  z-index: 5;

  display: flex;
  gap: calc(100vw * 14 / 812);
}

.action-button {
  width: 100%;
  flex: 1; 
  height: calc(100vh * 53 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(calc(100vw * 10 / 375));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: calc(100vw * 10 / 375);
}

.action-button img {
  width: calc(100vw * 40 / 375);
  height: calc(100vw * 40 / 375);
}

.action-button span {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  line-height: calc(100vw * 17.41 / 375);
  color: rgba(255, 255, 255, 0.6);
  padding-bottom: calc(100vw * 2 / 375);
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
