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
    <GuestAlert v-if="showGuestAlert" @close="showGuestAlert = false"></GuestAlert>
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
import GuestAlert from '@/views/register/orinxGuestALert.vue'

const showGuestAlert = ref(false)

const options = ref([
  { text: 'Privacy Policy' },
  { text: 'User Agreement' },
  { text: 'Blacklist' },
  { text: 'Edit personal information' }
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
    if (currentUserStore.currentUser.email === '' && currentUserStore.currentUser.password === '') {
    showGuestAlert.value = true
    return
  }
      router.push({ name: 'block' })
      break
    case 3:
    if (currentUserStore.currentUser.email === '' && currentUserStore.currentUser.password === '') {
        showGuestAlert.value = true
        return
      }
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
  background-image: url('@/assets/rutyauwc_bg.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(env(safe-area-inset-top) + calc(100vh * 12 / 815)) calc(100vw * 20 / 375) 0;
}

.title {
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  background: rgba(243, 96, 86, 1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Options List */
.options-list {
  flex: 1;
  padding: calc(100vh * 20 / 812) calc(100vw * 20 / 375) 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 16 / 812);
}

.option {
  height: calc(100vh * 52 / 812);
  background: rgba(255, 255, 255, 0.3);
  border-radius: calc(100vw * 12 / 375);
  
  border: calc(100vw * 1 / 375) solid rgba(255, 255, 255, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 calc(100vw * 10 / 375);
}

.option-text {
  font-family: 'texgyreadventor', sans-serif;
  color: rgba(0, 0, 0, 1);
  font-size: calc(100vw * 15 / 375);
  font-weight: 400;
}

.option-right .arrow-placeholder {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  background-image: url('@/assets/seetinggoicon.png');
  background-size: cover; /* 等比缩放覆盖 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat;
  overflow: hidden;
}

/* Footer */
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 20 / 812);
  padding-bottom: calc(100vh * 83 / 812);
}

.btn {
  width: calc(100vw * 198 / 375);
  height: calc(100vh * 62 / 812);
  border-radius: calc(100vw * 40 / 375);
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;

  border: calc(100vw * 2 / 375) solid rgba(255, 255, 255, 1);
}

.delete-btn {
  background: rgba(243, 96, 86, 1);
  color: rgba(255, 255, 255, 1);
}

.logout-btn {
  background: rgba(206, 254, 74, 1);
  color: rgba(0, 0, 0, 1);
}
</style>