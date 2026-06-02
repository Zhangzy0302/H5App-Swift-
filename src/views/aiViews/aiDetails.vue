<template>
  <div class="page">
    <div class="ai-robot"></div>

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="top-section">
        <BackButton />
      </div>
      <div class="info-card">
        <div class="bottom-title">Sarty AI</div>
        <div class="bottom-text">Hi! I’m Sarty AI, your go-to AI buddy for all things fashion. Whether you’re hunting for the perfect OOTD, mixing and matching basics, or need tips to nail your style, I’m here to help. Ready to slay every outfit and have fun doing it? Let’s create some fashion magic together!</div>
      </div>
        <!-- 购买 -->
      <div class="purchase-container" @click="handlePurchaseClick">
        <div class="purchase-info">
          <img src="@/assets/coin.png" alt="coin" class="purchase-icon" />
          <div class="purchase-count">X 200</div>
        </div>
        <div class="chat-box">Chat</div>
        <div class="chat-arrow">›</div>
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
  if (currentUserStore.currentUser.coins >= 200) {
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
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 223, 149, 1) 27%, rgba(248, 248, 246, 1) 52%, rgba(248, 248, 246, 1) 100%);
}

.ai-robot {
  position: absolute;
  left: 50%;
  top: calc(100vh * 26 / 812);
  transform: translateX(-50%);
  width: calc(100vw * 342 / 375);
  height: calc(100vw * 342 / 375);
  background-image: url('@/assets/SARTY_ai_robot.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.page-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  z-index: 2;
}

.top-section {
  position: absolute;
  top: calc(100vh * 50 / 812);
  left: calc(100vw * 17 / 375);
  z-index: 3;
}

.top-section :deep(.outer-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: 0;
  background: transparent;
}

.top-section :deep(.inner-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.info-card {
  width: calc(100vw * 343 / 375);
  min-height: calc(100vh * 258 / 812);
  margin-top: calc(100vh * 257 / 812);
  background: rgba(255, 255, 255, 1);
  border-radius: calc(100vw * 16 / 375);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(100vh * 44 / 812) calc(100vw * 37 / 375) calc(100vh * 28 / 812);
  box-sizing: border-box;
  z-index: 2;
}

.bottom-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 24 / 375);
  font-weight: 700;
  line-height: calc(100vw * 28 / 375);
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
  text-align: center;
}

.bottom-text {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 22 / 375);
  letter-spacing: 0;
  color: rgba(60, 48, 48, 0.58);
  text-align: center;
  margin-top: calc(100vh * 16 / 812);
}

.purchase-container {
  margin-top: calc(100vh * 41 / 812);
  width: calc(100vw * 233 / 375);
  height: calc(100vh * 56 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 190, 25, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(100vw * 9 / 375);
  box-sizing: border-box;
  z-index: 2;
  cursor: pointer;
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
}

.purchase-icon {
  width: calc(100vw * 40 / 375);
  height: calc(100vw * 40 / 375);
  object-fit: cover;
}

.purchase-count {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: 1;
  font-style: italic;
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
}

.chat-box {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
}

.chat-arrow {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
  transform: translateY(calc(-100vh * 1 / 812));
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
