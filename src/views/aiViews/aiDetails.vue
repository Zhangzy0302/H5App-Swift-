<template>
  <div class="page">
    <div class="aiusermodel"></div>
    <!-- <div class="aichatmodel"></div> -->

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="top-section">
        <BackButton />
      </div>
      <div class="bottom-section">
        <div class="bottom-container">
          <div class="bottom-title">Sien AI</div>
          <div class="bottom-text">Hi! I'm Sien AI, your personal singing AI assistant. Whether you are a beginner practicing your first song or an experienced singer polishing your perfect vocals, I am here to provide guidance for your performance, answer your questions, and help you sound amazing in every note. Are you ready to sing together?</div>
        <!-- 购买 -->
        <div class="purchase-container" @click="handlePurchaseClick">
          <div class="purchase-info">
            <div class="purchase-icon"></div>
            <div class="purchase-count">200 Coins to chat</div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div
      class="dialog"
      v-if="showCoinNot"
      @click.self="showCoinNot = false"
    >
      <CoinNotDialog @recharge="handleRechargeEvent" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import BackButton from '@/components/back.vue'
import CoinNotDialog from '@/views/aiViews/coinNot.vue'

const showCoinNot = ref(false)

const currentUserStore = useCurrentUserStore()
const uiStore = useUIStore()
const userStore =  useUserStore()
function handlePurchaseClick() {
  if (currentUserStore.currentUser.coins >= 100) {
    if (uiStore.loading) return
    uiStore.showLoading()

    const currentCoins = currentUserStore.currentUser.coins - 200
    userStore.updateUser(currentUserStore.currentUser.userId, { coins: currentCoins })

    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      uiStore.hideLoading()
      router.push({ name: 'aiChat' })
    }, delay)
  } else {
    showCoinNot.value = true
  }
}

const router = useRouter()
function handleRechargeEvent(value) {
  showCoinNot.value = false
  if (value === true) {
    router.push({ name: 'coins' })
  }
}
</script>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* prevent scrolling */
  background-color: #000; /* black background */
  background-image: url('@/assets/aibgc.png'); /* replace with your asset filename */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.aiusermodel {
  position: absolute;
  left: 0;
  top: calc(100vh * 68 / 812); /* adapt top spacing */
  width: calc(100vw * 229 / 375);
  height: calc(100vh * 402 / 812);
  opacity: 1;
}

.aichatmodel {
  position: absolute;
  left: calc(100vw * 197 / 375);
  top: calc(100vh * 134 / 812);
  width: calc(100vw * 104 / 375);
  height: calc(100vh * 38 / 812);
  opacity: 1;
  background-image: url('@/assets/aichatmodel.png'); 
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
}

.page-content {
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* top内容在上，bottom内容在下 */
  box-sizing: border-box;
}

.top-section {
  margin-top: calc(env(safe-area-inset-top) + 10px);
  margin-left: calc(100vw * 20 / 375);
  z-index: 100;
}

.bottom-section {
  display: flex;
  justify-content: flex-start;
  z-index: 99;
}

.bottom-container { 
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(100vh * 24 / 812); /* top spacing for first text */
  box-sizing: border-box;
}

.bottom-title {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 600;
  line-height: calc(100vw * 27.72 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  margin-bottom: calc(100vh * 16 / 812); /* space before second text */
}

.bottom-text {
  width: calc(100vw * 269 / 375);
  font-family: 'Poppins', sans-serif;
  font-size: 16;
  font-weight: 400;
  line-height: calc(100vw * 22 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin: 0 calc(100vw * 28 / 375) calc(100vh * 56 / 812) calc(100vw * 28 / 375); /* horizontal padding */
}

.purchase-container {
  margin-top: calc(100vh * 15 / 812);
  margin-bottom: calc(100vh * 25 / 812);
  width: calc(100vw * 233 / 375);
  height: calc(100vh * 56 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(100vw * 46 / 375);
  padding-right: calc(100vw * 11 / 375);
  box-sizing: border-box;
}

.purchase-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(100vw * 13 / 375);
}

.purchase-icon {
  width: calc(100vh * 32 / 812);
  height: calc(100vh * 32 / 812);
  background-image: url('@/assets/coin.png'); /* replace with your local image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.purchase-count {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  line-height: calc(100vw * 23.1 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 1);
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>