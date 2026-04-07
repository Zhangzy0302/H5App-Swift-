<template>
  <div class="page">
    <div class="aiusermodel"></div>
    <div class="aichatmodel">Kael<br>AI</div>

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="top-section">
        <BackButton />
      </div>
      <div class="bottom-section">
        <div class="bottom-container">
          <!-- <div class="bottom-title">Luvie AI</div> -->
          <div class="bottom-text">Hi! I'm Kael AI, your personal cycling companion. Whether you’re a casual rider enjoying the breeze or a serious cyclist chasing new records, I’m here to inspire your rides, share useful tips, and make every journey safer and more enjoyable. Are you ready to ride together?</div>
        <!-- 购买 -->
        <div class="purchase-container" @click="handlePurchaseClick">
          <div class="purchase-info">
            <div class="purchase-icon"></div>
            <div class="purchase-count">100</div>
          </div>
          <div class="chat-box">Chat</div>
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

    const currentCoins = currentUserStore.currentUser.coins - 100
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
  background-image: url('@/assets/ai_wlkajbg.png'); /* replace with your asset filename */
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
}

.aiusermodel {
  position: absolute;
  left: 0;
  top: calc(100vh * 68 / 812); /* adapt top spacing */
  width: calc(100vw * 229 / 375);
  height: calc(100vh * 402 / 812);
  opacity: 1;
  /* background-image: url('@/assets/aiusermodel.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
}

.aichatmodel {
  position: absolute;
  right: calc(100vw * 33 / 375);
  top: calc(100vh * 162 / 812);
  opacity: 1;
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 60 / 375);
  font-weight: 700;
  line-height: calc(100vw * 74 / 375);
  letter-spacing: 0;
  color: #fff;
  text-align: right;
  font-style: italic;
  /* background-image: url('@/assets/aichatmodel.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
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
  margin-top: calc(100vh * 56 / 812);
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
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 24 / 375);
  font-weight: 400;
  line-height: calc(100vw * 27.72 / 375);
  letter-spacing: 0;
  color: rgba(74, 32, 25, 1);
  text-align: center;
  margin-bottom: calc(100vh * 20 / 812); /* space before second text */
}

.bottom-text {
  font-family: 'JetBrainsMono', sans-serif;
  font-size: 16;
  font-weight: 400;
  /* line-height: calc(100vw * 30 / 375); */
  letter-spacing: 0;
  background-color: rgba(44, 44, 44, 1);
  border-radius: calc(100vw * 20 / 375);
  padding: calc(100vh * 10 / 812);
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin: 0 calc(100vw * 28 / 375) 0 calc(100vw * 28 / 375); /* horizontal padding */
}

.purchase-container {
  margin-top: calc(100vh * 15 / 812);
  margin-bottom: calc(100vh * 25 / 812);
  width: calc(100vw * 246 / 375);
  height: calc(100vh * 66 / 812);
  border-radius: calc(100vw * 30 / 375);
  background: rgba(221, 123, 15, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(100vw * 46 / 375);
  box-sizing: border-box;
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: calc(100vw * 13 / 375);
}

.purchase-icon {
  width: calc(100vw * 33 / 375);
  height: calc(100vh * 39 / 812);
  background-image: url('@/assets/coin.png'); /* replace with your local image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.purchase-count {
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 400;
  line-height: calc(100vw * 23.1 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}

.chat-box {
  width: calc(100vw * 73 / 375);
  height: calc(100vh * 38 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrainsMono', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 17.41 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 1);
  box-sizing: border-box;
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