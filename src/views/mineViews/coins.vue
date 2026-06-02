<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
      <span class="edit-title">My diamonds</span>
    </div>

    <!-- 金币盒子UI -->
    <div class="coin-box">
      <div class="coin-box-content">
        <img src="@/assets/coin.png" alt="coin" class="coin-icon" />
      </div>
      <div class="coin-summary">
        <div class="coin-box-header">My diamonds</div>
        <span class="coin-number">{{ currentUserStore.currentUser.coins }}</span>
      </div>
    </div>

    <!-- 金币列表 -->
    <div class="coins">
      <div class="coin-list">
        <div
          v-for="(item,index) in otherStore.other.coinsSetting"
          :key="index"
          class="coin-item"
          :class="{ 'coin-item-selected': selectedIndex === index }"
          @click="selectedIndex = index"
        >
          <div class="coin-left">
            <img src="@/assets/coin.png" class="coin-item-icon" />
            <span class="coin-count" :class="{ 'coin-count-selected': selectedIndex === index }">{{ item.cions }}</span>
          </div>

          <span class="coin-price" :class="{ 'coin-price-selected': selectedIndex === index }">{{ item.money }}$</span>
        </div>
      </div>
    </div>

    <button class="recharge-btn" @click="handleRecharge">Recharge</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { useOtherStore } from '@/stores/other'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useUserStore } from '@/stores/user'
import { sendPaymentToIOS } from '@/utils/iosBridge'

const otherStore =  useOtherStore()
const currentUserStore = useCurrentUserStore()
const userStore =  useUserStore()

const selectedIndex = ref(0)

function handleRecharge() {
  const item = otherStore.other.coinsSetting[selectedIndex.value]
  if (!item) return
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
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 228, 161, 1) 22%, rgba(248, 248, 246, 1) 42%, rgba(248, 248, 246, 1) 100%);
  overflow: hidden;
  /* display: flex;
  flex-direction: column; */
  box-sizing: border-box;
}

.top-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
  padding: calc(100vh * 62 / 812) calc(100vw * 22 / 375) 0;
}

.top-header :deep(.outer-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 0;
  background: transparent;
}

.top-header :deep(.inner-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.edit-title {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 22 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

/* 金币盒子外层 */
.coin-box {
  height: calc(100vh * 126 / 812);
  border-radius: calc(100vw * 17 / 375);
  background: rgba(60, 48, 48, 1);
  overflow: hidden;
  margin: calc(100vh * 29 / 812) calc(100vw * 19 / 375) 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 52 / 375);
  padding: 0 calc(100vw * 51 / 375);
  box-sizing: border-box;
}

.coin-box-content {
  width: calc(100vw * 59 / 375);
  height: calc(100vw * 59 / 375);
  flex-shrink: 0;
}

.coin-summary {
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 18 / 812);
}

.coin-icon {
  width: 100%;
  height: 100%;
}

/* 上部分标题 */
.coin-box-header {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(255, 255, 255, 0.58);
}

/* 金币数量文字 */
.coin-number {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 28 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(255, 255, 255, 1);
}

.coins {
  height: calc(100vh * 507 / 812);
  margin-top: calc(100vh * 18 / 812);
  padding: 0 calc(100vw * 19 / 375) calc(100vh * 120 / 812);
  overflow-y: auto;
  box-sizing: border-box;
}

.coin-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: calc(100vw * 11 / 375);
  row-gap: calc(100vh * 20 / 812);
}

.coin-item {
  height: calc(100vh * 112 / 812);
  border-radius: calc(100vw * 22 / 375);
  background: rgba(255, 255, 255, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(100vh * 18 / 812);
  border: calc(100vw * 1 / 375) solid transparent;
  box-sizing: border-box;
}

.coin-item-selected {
  background: rgba(255, 190, 25, 1);
  border: calc(100vw * 2 / 375) solid rgba(255, 190, 25, 1);
  box-shadow: 0 0 0 calc(100vw * 4 / 375) rgba(248, 248, 246, 1), 0 0 0 calc(100vw * 5 / 375) rgba(255, 190, 25, 1);
}

.coin-left {
  display: flex;
  align-items: center;
  gap: calc(100vw * 10 / 375);
}

.coin-item-icon {
  width: calc(100vw * 18 / 375);
  height: calc(100vw * 18 / 375);
}

.coin-count {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 18 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

.coin-count-selected {
  color: rgba(60, 48, 48, 1);
}

.coin-price {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(60, 48, 48, 0.42);
}

.coin-price-selected {
  color: rgba(60, 48, 48, 0.5);
}

.recharge-btn {
  position: absolute;
  left: 50%;
  bottom: calc(100vh * 44 / 812);
  transform: translateX(-50%);
  width: calc(100vw * 216 / 375);
  height: calc(100vh * 60 / 812);
  border: 0;
  border-radius: calc(100vw * 30 / 375);
  background: rgba(255, 190, 25, 1);
  color: rgba(60, 48, 48, 1);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 18 / 375);
  font-weight: 700;
  line-height: 1;
  padding: 0;
}
</style>
