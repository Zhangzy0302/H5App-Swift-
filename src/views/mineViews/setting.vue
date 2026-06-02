<template>
  <div class="page">
    <div class="header">
      <BackButton />
      <h1 class="title">Setting</h1>
    </div>
    <main class="options-list">
      <div class="option" v-for="(option, index) in options" :key="index" @click="handleOption(index)">
        <span class="option-text">{{ option.text }}</span>
        <div class="option-right">
          <div class="arrow-placeholder"></div>
        </div>
      </div>
    </main>
    <div class="footer">
      <button class="btn delete-btn" @click="handleAction(true)">Delete account</button>
      <button class="btn logout-btn" @click="handleAction(false)">Log out</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import { useCurrentUserStore } from '@/stores/currentUser'
import BackButton from '@/components/back.vue'
import { sendLogoutToIOS } from '@/utils/iosBridge'

const options = ref([
  { text: 'Privacy Agreement' },
  { text: 'User Agreement' },
  { text: 'Blacklist' },
  { text: 'Modify personal information' }
])

const router = useRouter()
const uiStore = useUIStore()
const userStore =  useUserStore()
const currentUserStore = useCurrentUserStore()

function handleOption(index) {
  switch (index) {
    case 0:
      router.push({ name: 'privacyPolicy' })
      break
    case 1:
      router.push({ name: 'userAgreement' })
      break
    case 2:
      router.push({ name: 'block' })
      break
    case 3:
      router.push({ name: 'edit' })
      break
    default:
      break
  }
}

function handleAction(isDelete) {
  if (uiStore.loading) return
  uiStore.showLoading()

  if (isDelete) {
    userStore.updateUser(currentUserStore.currentUser.userId, { isdelete: 1 })
  }

  const delay = Math.floor(Math.random() * 1500) + 500

  setTimeout(() => {
    uiStore.hideLoading()
    sendLogoutToIOS(isDelete)

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

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
  padding: calc(100vh * 45 / 812) calc(100vw * 20 / 375) 0;
  min-height: calc(100vh * 40 / 812);
}

.title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 22 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(60, 46, 45, 1);
  margin: 0;
}

.header :deep(.outer-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: 0;
  background: transparent;
}

.header :deep(.inner-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

/* Options List */
.options-list {
  flex: 1;
  padding: calc(100vh * 29 / 812) calc(100vw * 18 / 375) 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 14 / 812);
}

.option {
  min-height: calc(100vh * 46 / 812);
  background: rgba(255, 255, 255, 0.96);
  border-radius: calc(100vw * 12 / 375);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 calc(100vw * 16 / 375) 0 calc(100vw * 14 / 375);
  box-sizing: border-box;
}

.option-text {
  font-family: 'Poppins-Regular', sans-serif;
  color: rgba(60, 46, 45, 1);
  font-size: calc(100vw * 16 / 375);
  font-weight: 500;
  line-height: 1;
}

.option-right .arrow-placeholder {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  background-image: url('@/assets/SARTY_setting_arrorw.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  overflow: hidden;
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

/* Footer */
.footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100vh * 66 / 812);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 16 / 812);
}

.btn {
  width: calc(100vw * 166 / 375);
  height: calc(100vh * 46 / 812);
  border: 0;
  border-radius: calc(100vw * 24 / 375);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 700;
  line-height: 1;
  padding: 0;
}

.delete-btn {
  background: rgba(255, 82, 57, 1);
  color: rgba(255, 255, 255, 1);
}

.logout-btn {
  background: rgba(255, 190, 25, 1);
  color: rgba(60, 46, 45, 1);
}
</style>
