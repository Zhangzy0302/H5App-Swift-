<template>
  <div class="page">
    <div class="aiusermodel"></div>

    <div class="ai-top">
      <div class="ai-title">Orinx AI</div>
      <div class="ai-intro" >Confused about <br/>Fashion? Let AI <br/>Styling Assistant<br/> Solve It!</div>
    </div>

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="top-section">
        <BackButton />
      </div>
      <div class="bottom-section">
        <div class="bottom-container">
          <div class="bottom-text">Hi! I’m Orinx, your friendly style companion here to chat about all things fashion and outfit inspiration. Whether you love casual streetwear, elegant minimal looks, bold statement pieces, or everyday essentials, I’m here to share ideas, explore trends, and help you refine your personal style.Ready to elevate your wardrobe and express your best self? Let’s mix, match, and create standout looks every day! ✨</div>
          
        <!-- 购买 -->
        <div class="purchase-container" @click="handlePurchaseClick">
          <div class="purchase-info">
            <div class="purchase-icon"></div>
            <div class="purchase-count">X 200</div>
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
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* prevent scrolling */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.aiusermodel {
  position: absolute;
  right: calc(100vh * 23 / 812);
  top: calc(100vh * 53 / 812); /* adapt top spacing */
  width: auto;
  height: calc(100vh * 695 / 812);
  aspect-ratio: 174/695;
  opacity: 1;
  background-image: url('@/assets/rutyauwc_ai_charactor.png'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.ai-top {
  position: absolute;
  left: calc(100vh * 23 / 812);
  top: calc(env(safe-area-inset-top) + calc(100vh * 72 / 812));
  font-family: 'texgyreadventor', sans-serif;
  color: rgba(15, 124, 147, 1);
}

.ai-title {
  
  font-size: calc(100vw * 36 / 375);
  font-weight: 400;
  line-height: calc(100vw * 53 / 375);
  
}

.ai-intro {
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 30 / 375);
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
  margin-top: calc(env(safe-area-inset-top) + calc(100vh * 12 / 815));
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

.bottom-text {
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 700;
  line-height: calc(100vw * 24 / 375);
  letter-spacing: 0;
  background: linear-gradient(135.18deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
  border-radius: calc(100vw * 20 / 375);
  border: calc(100vw * 1.4 / 375) solid rgba(255, 255, 255, 1);
  color: rgba(255, 255, 255, 1);
  text-align: center;
  padding: calc(100vw * 16 / 375) calc(100vw * 12 / 375);
  margin: 0 calc(100vw * 24 / 375) 0 calc(100vw * 24 / 375); /* horizontal padding */
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}

.purchase-container {
  margin-top: calc(100vh * 15 / 812);
  margin-bottom: calc(100vh * 25 / 812);
  width: calc(100vw * 239 / 375);
  height: calc(100vh * 62 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(243, 96, 86, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  /* gap: calc(100vw * 10 / 375); */
  box-sizing: border-box;
}

.purchase-info {
  display: flex;
  align-items: center;
  gap: calc(100vw * 3 / 375);
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
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: calc(100vw * 23.1 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
}

.chat-box {
  width: calc(100vw * 73 / 375);
  height: calc(100vh * 38 / 812);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: calc(100vw * 17.41 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 1);
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