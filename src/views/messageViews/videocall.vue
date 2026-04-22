<template>
  <div class="video-call" :style="{ backgroundImage: `url(${userInfo.avator})` }">
    <div class="bg-gradient"></div>
    <!-- Top Avatar Container -->
    

    <!-- Bottom Control Panel -->
    <div class="call-panel">
      <div class="avatar-outer">
      <div class="avatar-inner">
        <img :src="userInfo.avator" alt="User Avatar" />
      </div>
    </div>
      <div class="call-left">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="calling-text">{{ callingText }}</div>
      </div>
      <div class="hangup-btn" @click="hangup">
        <img src="@/assets/hangupicon.png" alt="hangup" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({ userId: String })
const emits = defineEmits(['hangup'])

const userStore = useUserStore()
const userInfo = userStore.getUserById(props.userId)

const callingText = ref('Calling')
let dotCount = 0
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    dotCount = (dotCount + 1) % 4
    callingText.value = 'Calling' + '.'.repeat(dotCount)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

function hangup() {
  clearInterval(intervalId)
  emits('hangup')
}
</script>

<style scoped>
.video-call > *:not(.bg-gradient) {
  position: relative;
  z-index: 1;
}

/* Top avatar */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(243, 96, 86, 1) 0%, rgba(255, 255, 255, 0) 99.84%);
  z-index: 0;
}

.video-call {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.avatar-outer {
  /* margin-top: calc(100vh * 257 / 812); */
  width: calc(100vw * 106 / 375);
  height: calc(100vw * 106 / 375);
  border-radius: calc(100vw * 99 / 375);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-inner {
  width: calc(100vw * 104 / 375);
  height: calc(100vw * 104 / 375);
  border-radius: calc(100vw * 99 / 375);
  padding: calc(100vw * 3 / 375);
  background: rgba(206, 254, 74, 1);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: calc(100vw * 99 / 375);
  display: block;
}

/* Bottom call panel */
.call-panel {
  position: absolute;
  bottom: calc(100vh * 120 / 812);
  border-radius: calc(100vw * 40 / 375);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  gap: calc(100vw * 35 / 375);
}

.call-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: calc(100vw * 10 / 315);
}

.user-name {
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: calc(100vw * 23.1 / 375);
  color: rgba(255, 255, 255, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calling-text {
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  color: rgba(255, 255, 255, 1);
}

.hangup-btn {
  width: calc(100vw * 58 / 375);
  height: calc(100vw * 58 / 375);
  border-radius: calc(100vw * 214 / 375);
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hangup-btn img {
  width: calc(100vw * 32 / 375);
  height: calc(100vw * 32 / 375);
}
</style>