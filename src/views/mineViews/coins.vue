<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">My Coins</span>
    </div>

    <!-- 金币盒子UI -->
    <div class="coin-box">
      <img src="@/assets/coin.png" alt="coin" class="coin-icon" />
      <div class="coin-box-content">
        <div class="coin-box-header">My diamonds</div>
        <span class="coin-number">{{ currentUserStore.currentUser.coins }}</span>
      </div>
    </div>
    <div class="coinbgc"></div>
    <!-- 金币列表 -->
    <div class="coins">
      <div class="coin-list">
        <div
          v-for="(item,index) in otherStore.other.coinsSetting"
          :key="index"
          class="coin-item"
          :class="{ 'coin-item-selected': selectedIndex === index }"
          @click="handleCoinClick(item, index)"
        >
          <div class="coin-left">
            <img src="@/assets/coin.png" class="coin-item-icon" />
            <span class="coin-count" :class="{ 'coin-count-selected': selectedIndex === index }">{{ item.cions }}</span>
          </div>

          <div class="coin-right">
            <span class="coin-price" :class="{ 'coin-price-selected': selectedIndex === index }">{{ item.money }}</span>
            <!-- <div class="coin-radio" :class="{ 'coin-radio-selected': selectedIndex === index }"></div> -->
          </div>
        </div>
      </div>
      <!-- <div class="recharge-button" @click="handleCoinClick">Recharge</div> -->
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import { sendPaymentToIOS } from '@/utils/iosBridge'
import { requireLoginForGuest } from '@/utils/guest'

const otherStore =  useOtherStore()
const currentUserStore = useCurrentUserStore()
const userStore =  useUserStore()
const uiStore = useUIStore()

const selectedIndex = ref(-1)

function handleCoinClick(item, index) {
  if (requireLoginForGuest(currentUserStore, uiStore)) return

  selectedIndex.value = index

  // item.key 或 item.id 作为支付标识
  const payKey = item.key

  // 调用 iOS 支付
  sendPaymentToIOS(payKey)
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
  /* display: flex;
  flex-direction: column; */
  box-sizing: border-box;
}

.top-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(env(safe-area-inset-top) + 10px) calc(100vw * 20 / 375) 0;
}

.edit-title {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 600;
  background: rgba(255, 255, 255, 1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 金币盒子外层 */
.coin-box {
  width: auto;
  height: calc(100vh * 109 / 812);
  border-radius: calc(100vw * 20 / 375);
  
  background: linear-gradient(90deg, rgba(10, 191, 102, 1) 0%, rgba(162, 238, 110, 1) 100%);

  overflow: hidden;
  margin: calc(100vh * 20 / 812) calc(100vw * 20 / 375) 0;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: calc(100vh * 10 / 812);
  padding-left: calc(100vw * 32 / 375);
}


/* 上部分标题 */
.coin-box-header {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  letter-spacing: 0px;
  line-height: calc(100vw * 20.79 / 375);
  color: rgba(0, 0, 0, 1);
}

/* 下部分盒子内容 */
.coin-box-content {
  display: inline-flex;       /* 内部内容水平排列 */
  align-items: start;
  flex-direction: column;
  justify-content: flex-start;
  padding: calc(100vh * 10 / 812) calc(100vw * 22 / 375);
  gap: calc(100vw * 10 / 375);

  width: fit-content;         /* 核心：宽度自适应内容 */
  max-width: 100%;            /* 避免内容超出父容器 */
  margin-left: 0;             /* 可选：左对齐 */
  margin-right: 0;            /* 可选：右对齐 */
}

/* coin 图标 */
.coin-icon {
  width: calc(100vh * 78 / 812);
  height: calc(100vh * 78 / 812);
}

/* 金币数量文字 */
.coin-number {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 24 / 375);
  font-weight: 600;
  letter-spacing: 0px;
  line-height: calc(100vw * 17.41 / 375);
  color: rgba(0, 0, 0, 1);
}

.coinbgc {
  position: absolute;
  top: calc(100vh * 16 / 812);
  right: calc(100vh * 27 / 812);
  width: calc(100vw * 167 / 375);
  height: calc(100vh * 297 / 812);

  overflow: hidden;
  pointer-events: none; /* 点击穿透，不拦截点击事件 */
}
 
.coins {
  /* height: calc(100% - calc(100vh * 285 / 812)); */
  margin-top: calc(100vh * 30 / 812);
  padding: 0 calc(100vw * 20 / 375) calc(100vh * 34 / 812);
  overflow-y: auto;
}

.coin-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行3个 */
  gap: calc(100vw * 12 / 375);
}

.coin-item {
  height: calc(100vh * 100 / 812);
  border-radius: calc(100vw * 20 / 375);
  background: rgba(23, 23, 23, 1);
  box-shadow: 0px calc(100vw * 2 / 375) calc(100vw * 4 / 375) rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 calc(100vw * 10 / 375);
  box-sizing: border-box;
  gap: calc(100vh * 8 / 812);
}

.coin-item-selected {
  border-radius: calc(100vw * 20 / 375);
  background: rgba(198, 244, 50, 1);
}

.coin-left {
  display: flex;
  align-items: center;
  gap: calc(100vw * 8 / 375);
}

.coin-item-icon {
  width: calc(100vh * 24 / 812);
  height: calc(100vh * 24 / 812);
}

.coin-count {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  line-height: calc(100vw * 18.48 / 375);
  color: #fff;
}

.coin-count-selected {
  color:  rgba(0, 0, 0, 1);
}

.coin-right {
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
}

.coin-price {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  color: rgba(255, 255, 255, 0.7);
}

.coin-price-selected {
  color: rgba(0, 0, 0, 0.7);
}

.coin-radio {
  width: calc(100vw * 15 / 375);
  height: calc(100vw * 15 / 375);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}

.coin-radio-selected {
  width: calc(100vw * 14 / 375);
  height: calc(100vw * 14 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  border: calc(100vw * 1 / 375) solid rgba(255, 255, 255, 1);
}

.recharge-button {
  margin: calc(100vh * 20 / 812) auto;
  width: calc(100vw * 190 / 375);
  height: calc(100vh * 54 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
}
</style>
