<template>
  <div class="page">
    <div class="top-header">
      <BackButton />
    </div>
    <div class="content">
      <div class="top">
        <div class="top-block" :style="{ backgroundImage: `url(${topBlockImage})` }" @click="chooseAvatar">
            <div class="camera-corner">
            <img src="@/assets/cameraicon.png" alt="camera" />
            </div>
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display:none"
        @change="onFileChange"
      />
      <div class="second">
        <div class="second-section">
            <div class="label">Name</div>
            <div class="input-box">
            <input v-model="name" type="text" placeholder="Please enter" />
            </div>
        </div>
      </div>
      <div class="third">
        <div class="third-section">
            <div class="label">About me</div>
            <div class="input-box">
            <input v-model="aboutMe" type="text" placeholder="Please enter" />
            </div>
        </div>
      </div>
      <div class="third">
        <div class="third-section">
            <div class="label">Birthday</div>
            <div class="input-box birthday-content">
                <div class="birthday-input">{{ birthday }}</div>
                <div class="birthday-icon">›</div>
                <input
                  ref="birthdayInput"
                  v-model="birthday"
                  :max="maxBirthday"
                  class="birthday-native-input"
                  type="date"
                  lang="en-US"
                  @change="normalizeBirthday"
                />
            </div>
        </div>
      </div>
      <div class="third">
        <div class="third-section">
            <div class="label">Gender</div>
            <div class="gender-content">
                <div class="gender" :class="{ 'gender-active': genderIndex === 1 }" @click="genderIndex = 1">Male</div>
                <div class="gender" :class="{ 'gender-active': genderIndex === 0 }" @click="genderIndex = 0">Female</div>
            </div>
        </div>
      </div>
      <div class="fourth-section">
        <div class="save-btn" @click="saveProfile">Save</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { goBackOrClose, sendShowLoadingToIOS, sendShowToastToIOS, sendNewUserDataToIOS } from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'

// Use relative path for web build
const topBlockImage = ref('/src/assets/avataricon.png')

const name = ref('')
const aboutMe = ref('')

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getDefaultBirthday = () => {
  const now = new Date()
  now.setFullYear(now.getFullYear() - 20)
  return formatDate(now)
}

const getMaxBirthday = () => {
  const now = new Date()
  now.setFullYear(now.getFullYear() - 18)
  return formatDate(now)
}

const maxBirthday = getMaxBirthday()
const birthday = ref(getDefaultBirthday())
const genderIndex = ref(0)

const fileInput = ref(null)
const birthdayInput = ref(null)
const avatarFile = ref(null)

const normalizeBirthday = () => {
  if (birthday.value > maxBirthday) {
    birthday.value = maxBirthday
  }
}

const chooseAvatar = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarFile.value = file

  // 本地预览
  const reader = new FileReader()
  reader.onload = (ev) => {
    topBlockImage.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

const saveProfile = async () => {
  if (!name.value.trim()) {
    sendShowToastToIOS('Please enter name')
    return
  }

  sendShowLoadingToIOS(true)

  let avatarUrl = topBlockImage.value

  try {
    if (avatarFile.value) {
      avatarUrl = await uploadSingleImage(avatarFile.value, 'template_development')
    }
    
    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      let newUserData = {
        'avator': avatarUrl && avatarUrl.includes('template_development') ? avatarUrl : '',
        'name': name.value,
        'about': aboutMe.value,
        'birthday': birthday.value,
        'gender': genderIndex.value === 1 ? 'Male' : 'Female',
      }

      sendShowLoadingToIOS(false)

      sendNewUserDataToIOS(newUserData)

    }, delay)

  } catch (e) {
    console.error(e)
    sendShowLoadingToIOS(false)
    sendShowToastToIOS('Updated failed, please check your network.')
  }
}

</script>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 228, 161, 1) 22%, rgba(248, 248, 246, 1) 42%, rgba(248, 248, 246, 1) 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-header {
  min-height: 0;
  display: flex;
  align-items: center;
  padding: calc(100vh * 56 / 812) calc(100vw * 20 / 375) 0;
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

.content {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.top, .second, .third {
  display: flex;
  justify-content: center;
}

.top-block {
  width: calc(100vw * 82 / 375);
  height: calc(100vw * 82 / 375);
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: calc(100vw * 3 / 375) solid rgba(255, 255, 255, 1);
  position: relative;
  margin-top: calc(100vh * 28 / 812);
}

.camera-corner {
  position: absolute;
  right: calc(-100vw * 5 / 375);
  bottom: calc(100vh * 5 / 812);
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 50%;
  background: rgba(255, 190, 25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  /* transform: translate(calc(100vw * 4 / 375), calc(100vw * 4 / 812)); */
}

.camera-corner img {
  width: calc(100vw * 14 / 375);
  height: calc(100vw * 14 / 375);
  filter: brightness(0) saturate(100%);
}

.second-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100vw * 337 / 375);
  margin: calc(100vh * 22 / 812) 0 0;
}

.label {
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

.input-box {
  width: 100%;
  height: calc(100vh * 51 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  padding: 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
  cursor: pointer;
}

.birthday-content {
  justify-content: space-between;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 0.5);
}

.birthday-input {
  flex: 1;
  pointer-events: none;
}

.birthday-native-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.birthday-icon {
  width: calc(100vw * 20 / 375);
  height: calc(100vw * 20 / 375);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 32 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
  pointer-events: none;
}

.input-box input {
  width: 100%;
  border: none;
  outline: none;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: #000000;
  background: transparent;
}

.input-box input::placeholder {
  color: rgba(60, 48, 48, 0.34);
}

.third-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100vw * 337 / 375);
  margin-top: calc(100vh * 26 / 812);
  position: relative;
}

.gender-content {
  display: flex;
  justify-content: space-between;
  gap: calc(100vw * 15 / 375);
  width: 100%;
  margin-top: calc(100vh * 5 / 812);
}

.gender {
  display: flex;
  flex: 1;
  height: calc(100vh * 51 / 812);
  border-radius: calc(100vw * 15 / 375);
  background: rgba(255, 255, 255, 1);
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

.gender-active {
  background: rgba(255, 190, 25, 1);
}

.fourth-section {
  margin: calc(100vh * 76 / 812) 0 calc(100vh * 34 / 812);
  display: flex;
  justify-content: center;
  width: 100%;
}

.save-btn {
  width: calc(100vw * 180 / 375);
  height: calc(100vh * 51 / 812);
  border-radius: calc(100vw * 30 / 375);
  background: rgba(255, 190, 25, 1);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 15 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
