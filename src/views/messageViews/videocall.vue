<template>
  <div class="video-call">
    <div class="top-action" @click="hangup">
      <BackButton />
    </div>
    <div class="call-center">
      <div class="avatar-outer">
        <div class="avatar-inner">
          <img :src="userInfo.avator" alt="User Avatar" />
        </div>
      </div>
      <div class="user-name">{{ userInfo.name }}</div>
      <div class="calling-text">{{ callingText }}</div>
    </div>
    <div class="hangup-btn" @click="hangup">
      <img src="@/assets/hangupicon.png" alt="hangup" />
      </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import BackButton from '@/components/back.vue'

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
.video-call {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 225, 154, 1) 27%, rgba(248, 248, 246, 1) 48%, rgba(248, 248, 246, 1) 100%);
  overflow: hidden;
}

.top-action {
  position: absolute;
  top: calc(100vh * 50 / 812);
  left: calc(100vw * 18 / 375);
  z-index: 2;
}

.top-action :deep(.outer-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  border-radius: 0;
  background: transparent;
}

.top-action :deep(.inner-box) {
  width: calc(100vw * 24 / 375);
  height: calc(100vw * 24 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.call-center {
  position: absolute;
  top: calc(100vh * 239 / 812);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-outer {
  width: calc(100vw * 69 / 375);
  height: calc(100vw * 69 / 375);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.user-name {
  margin-top: calc(100vh * 47 / 812);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calling-text {
  margin-top: calc(100vh * 13 / 812);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

.hangup-btn {
  position: absolute;
  left: 50%;
  bottom: calc(100vh * 83 / 812);
  transform: translateX(-50%);
  width: calc(100vw * 58 / 375);
  height: calc(100vw * 58 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.hangup-btn img {
  width: calc(100vw * 25 / 375);
  height: calc(100vw * 25 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}
</style>
