<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">Fans</span>
    </div>
    <!-- 粉丝列表 -->
    <div class="container">
        <div class="fan-list" v-if="fans.length > 0">
            <div v-for="(item, index) in fans" :key="index" class="fan-item">
                <div class="fan-left">
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
                <div class="fan-right" @click="addFollow(item.userId)">
                  <img src="@/assets/follow.png" alt="" width="24px">
                </div>
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
import { requireLoginForGuest } from '@/utils/guest'

const currentUserStore = useCurrentUserStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const fans = computed(() => {
  return currentUserStore.currentUser?.fans?.map(userId => {
    // Here you can map userId to user info if you have a userStore
    // For now we return placeholder data
    return userStore.getUserById(userId)
  }) || []
})

function cancelFollow(userId) {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

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

function addFollow(userId) {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  if (currentUserStore.currentUser.follow?.includes(userId)) {
    uiStore.showToast('You have already followed this user.')
    return
  }

  if (uiStore.loading) return
  uiStore.showLoading()
  const currentUserId = currentUserStore.currentUser.userId

  // Update current user's follow list
  const currentUserFollow = currentUserStore.currentUser.follow ? [...currentUserStore.currentUser.follow] : []
  if (!currentUserFollow.includes(userId)) {
    currentUserFollow.unshift(userId)
  }

  // Update post user's fans list
  const otherUser = userStore.getUserById(userId)
  const otherUserFans = otherUser.fans ? [...otherUser.fans] : []
  if (!otherUserFans.includes(currentUserId)) {
    otherUserFans.unshift(currentUserId)
  }

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {

    userStore.updateUser(currentUserStore.currentUser.userId, { follow: currentUserFollow })
    userStore.updateUser(userId, { fans: otherUserFans })

    uiStore.hideLoading()
    uiStore.showToast('Followed successfully')
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
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(100vh * 58 / 812) calc(100vw * 20 / 375) 0;
}

.edit-title {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 600;
  background: rgba(255, 255, 255, 1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.container {
  flex: 1;
  overflow-y: auto;
  margin: calc(100vh * 20 / 812) 0 0;
  box-sizing: border-box;
}

.fan-list {
  margin: 0 calc(100vw * 20 / 375) 0;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 16 / 812);
  padding-bottom: calc(100vh * 34 / 812);
}

.fan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh * 82 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(23, 23, 23, 1);
  padding: 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
}

.fan-left {
  width: calc(100% - calc(100vw * 140 / 375));
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: calc(100vh * 7 / 812);
}

.user-info {
  display: flex;
  align-items: center;
  gap: calc(100vw * 12 / 375);
}

.avatar-box {
  flex-shrink: 0; /* 禁止收缩 */
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
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
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.48 / 375);
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-intro {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fan-right {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: calc(100vw * 20 / 375);
  /* background: #fff; */
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 12 / 375);
  font-weight: 400;
  line-height: calc(100vw * 13.06 / 375);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
