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
            <div class="label">Nickname:</div>
            <div class="input-box">
            <input v-model="name" type="text" placeholder="Please enter" />
            </div>
        </div>
      </div>
      <div class="third">
        <div class="third-section">
            <div class="label">Birthday:</div>
            <div class="input-box birthday-content">
                <div class="birthday-input">{{ birthday }}</div>
                <div class="select-arrow"></div>
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
            <div class="label">Location:</div>
            <div class="input-box location-content">
            <input v-model="location" type="text" placeholder="La" />
            <div class="select-arrow"></div>
            </div>
        </div>
      </div>
      <div class="third">
        <div class="third-section">
            <div class="label">Gender:</div>
            <div class="gender-content">
                <div class="gender-box" :class="{ 'gender-box-active': genderIndex === 0 }" @click="genderIndex = 0">
                    <span class="gender-icon">♂</span>
                </div>
                <div class="gender-box" :class="{ 'gender-box-active': genderIndex === 1 }" @click="genderIndex = 1">
                    <span class="gender-icon">♀</span>
                </div>
            </div>
        </div>
      </div>
      <div class="fourth-section">
        <div class="save-btn" @click="saveProfile">Next</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/back.vue'
import { sendShowLoadingToIOS, sendShowToastToIOS, sendNewUserDataToIOS } from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'

defineOptions({
  name: 'RegisterPage',
})

// Use relative path for web build
const topBlockImage = ref('/src/assets/avataricon.png')

const name = ref('')
const location = ref('')

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
  let avatarUploadFailed = false

  try {
    if (avatarFile.value) {
      try {
        avatarUrl = await uploadSingleImage(avatarFile.value, 'template_development')
      } catch (uploadError) {
        console.error('avatar upload failed', uploadError)
        avatarUrl = ''
        avatarUploadFailed = true
      }
    }
    
    const delay = Math.floor(Math.random() * 1500) + 500

    setTimeout(() => {
      let newUserData = {
        'avator': avatarUrl && avatarUrl.includes('template_development') ? avatarUrl : '',
        'name': name.value,
      }

      sendShowLoadingToIOS(false)

      sendNewUserDataToIOS(newUserData)
      if (avatarUploadFailed) {
        sendShowToastToIOS('Avatar upload failed, please try again later.')
      }

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
  position: relative;
  width: 100%;
  height: 100vh;
  background: rgba(1, 1, 1, 1);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-header {
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(env(safe-area-inset-top) + 10px) calc(100vw * 20 / 375) 0;
}

.content {
  position: relative;
  width: 100vw;
  height: calc(100% - calc(100vh * 50 / 812) - env(safe-area-inset-top));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.top, .second, .third {
  display: flex;
  justify-content: center;
}

.top-block {
  width: calc(100vw * 80 / 375);
  height: calc(100vw * 80 / 375);
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: calc(100vw * 1 / 375) solid rgba(255, 255, 255, 1);
  position: relative;
  margin-top: calc(100vh * 14 / 812);
}

.camera-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 50%;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  /* transform: translate(calc(100vw * 4 / 375), calc(100vw * 4 / 812)); */
}

.camera-corner img {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
}

.second-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100% - calc(100vw * 40 / 375));
  margin: calc(100vh * 16 / 812) 0 0;
}

.label {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 600;
  line-height: calc(100vw * 23.1 / 375);
  color: rgba(255, 255, 255, 1);
}

.input-box {
  width: 100%;
  height: calc(100vh * 63 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(23, 23, 23, 1);
  backdrop-filter: blur(calc(100vw * 12 / 375));
  display: flex;
  align-items: center;
  padding: 0 calc(100vw * 20 / 375);
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
}

.birthday-content,
.location-content {
  justify-content: space-between;
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.4);
}

.birthday-input {
  flex: 1;
  min-width: 0;
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

.select-arrow {
  width: 0;
  height: 0;
  border-left: calc(100vw * 6 / 375) solid transparent;
  border-right: calc(100vw * 6 / 375) solid transparent;
  border-top: calc(100vw * 8 / 375) solid rgba(255, 255, 255, 1);
  pointer-events: none;
  flex: 0 0 auto;
}

.input-box input {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  outline: none;
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 15.23 / 375);
  letter-spacing: 0;
  color: #fff;
  background: transparent;
}

.input-box input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.third-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100% - calc(100vw * 40 / 375));
  margin-top: calc(100vh * 20 / 812);
  position: relative;
}

.gender-content {
  display: flex;
  gap: calc(100vw * 17 / 375);
  margin-top: calc(100vh * 10 / 812);
}

.gender-box {
  width: calc(100vw * 109 / 375);
  height: calc(100vh * 48 / 812);
  background: rgba(255, 255, 255, 1);
  border-radius: calc(100vw * 24 / 375);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.gender-box-active {
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
}

.gender-icon {
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 30 / 375);
  font-weight: 600;
  line-height: 1;
  color: rgba(0, 0, 0, 1);
}

.fourth-section {
  margin: calc(100vh * 76 / 812) 0 calc(env(safe-area-inset-bottom) + calc(100vh * 26 / 812));
  display: flex;
  justify-content: center;
  width: 100%;
}

.save-btn {
  width: calc(100vw * 238 / 375);
  height: calc(100vh * 56 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: linear-gradient(90deg, rgba(56, 243, 222, 1) 0%, rgba(27, 254, 134, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 600;
  line-height: calc(100vw * 23.1 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 1);
  cursor: pointer;
}
</style>
