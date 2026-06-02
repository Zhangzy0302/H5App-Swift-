<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">Follow</span>
    </div>
    <!-- 关注列表 -->
    <div class="container">
      <div v-if="follows.length > 0" class="follow-list">
        <div v-for="(item, index) in follows" :key="index" class="follow-item">
          <div class="follow-left">
            <div class="user-info">
              <div class="avatar-box">
                <div class="avatar-inner">
                  <img :src="item.avator" alt="avatar" />
                </div>
              </div>
              <div class="user-name">{{ item.name }}</div>
            </div>
            <div class="user-intro">{{ item.about }}</div>
          </div>
          <div class="follow-right" @click="cancelFollow(item.userId)">−</div>
        </div>
      </div>
      <Empty class="empty" v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import BackButton from '@/components/back.vue'
import Empty from '@/components/empty.vue'

const currentUserStore = useCurrentUserStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const follows = computed(() => {
  return currentUserStore.currentUser?.follow?.map(userId => {
    // Here you can map userId to user info if you have a userStore
    // For now we return placeholder data
    return userStore.getUserById(userId)
  }).filter(Boolean) || []
})

function cancelFollow(userId) {
  if (uiStore.loading) return
  uiStore.showLoading()
  const currentUserId = currentUserStore.currentUser.userId

  // Remove userId from current user's follow list if it exists
  const currentUserFollow = currentUserStore.currentUser.follow ? [...currentUserStore.currentUser.follow] : []
  const index = currentUserFollow.indexOf(userId)
  if (index !== -1) {
    currentUserFollow.splice(index, 1)
  }

  // Update post user's fans list
  const otherUser = userStore.getUserById(userId)
  const otherUserFans = otherUser.fans ? [...otherUser.fans] : []
  const index2 = otherUserFans.indexOf(currentUserId)
  if (index2 !== -1) {
    otherUserFans.splice(index2, 1)
  }

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {

    userStore.updateUser(currentUserStore.currentUser.userId, { follow: currentUserFollow })
    userStore.updateUser(userId, { fans: otherUserFans })

    uiStore.hideLoading()
    uiStore.showToast('Unfollow successfully')
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
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
  padding: calc(100vh * 51 / 812) calc(100vw * 23 / 375) 0;
}

.top-header :deep(.outer-box) {
  width: calc(100vw * 22 / 375);
  height: calc(100vw * 22 / 375);
  border-radius: 0;
  background: transparent;
}

.top-header :deep(.inner-box) {
  width: calc(100vw * 22 / 375);
  height: calc(100vw * 22 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.edit-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

.container {
  flex: 1;
  overflow-y: auto;
  margin: calc(100vh * 22 / 812) 0 0;
  box-sizing: border-box;
}

.follow-list {
  margin: 0 calc(100vw * 22 / 375) 0;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 10 / 812);
  padding-bottom: calc(100vh * 34 / 812);
}

.follow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh * 82 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(255, 255, 255, 1);
  box-shadow: none;
  padding: 0 calc(100vw * 15 / 375) 0 calc(100vw * 10 / 375);
  box-sizing: border-box;
}

.follow-left {
  width: calc(100% - calc(100vw * 140 / 375));
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: calc(100vh * 5 / 812);
  min-width: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
}

.avatar-box {
  flex-shrink: 0; /* 禁止收缩 */
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  border-radius: 50%;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}

.avatar-inner img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-intro {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14/ 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(60, 48, 48, 0.48);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-right {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 19 / 375);
  font-weight: 700;
  line-height: calc(100vw * 13 / 375);
  color: rgba(60, 48, 48, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
