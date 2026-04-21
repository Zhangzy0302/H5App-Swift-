<template>
  <div class="page" @click="closeCountryPicker">
    <div class="top-header">
      <BackButton />
    </div>
    <div class="content">
      <div class="top">
        <div
          class="top-block"
          :style="{ backgroundImage: `url(${topBlockImage})` }"
          @click="chooseAvatar"
        >
          <div class="camera-corner">
            <img src="@/assets/cameraicon.png" alt="camera" />
          </div>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onFileChange"
      />

      <div class="second">
        <div class="second-section">
          <div class="label">NAME</div>
          <div class="input-box">
            <input v-model="name" type="text" placeholder="Please enter" />
          </div>
        </div>
      </div>

      <!-- <div class="third">
        <div class="third-section">
          <div class="label">Birthday</div>
          <div class="input-box birthday-content" @click.stop="openBirthdayPicker">
            <div class="birthday-input">{{ birthdayDisplay }}</div>
            <div class="birthday-icon"></div>
          </div>
          <input
            ref="birthdayInput"
            v-model="birthday"
            :max="maxBirthday"
            :min="minBirthday"
            class="birthday-native-input"
            type="date"
            lang="en-US"
            @change="handleBirthdayChange"
            @click.stop
          />
        </div>
      </div> -->

      <div class="third">
        <div class="third-section">
          <div class="label">LOCATION</div>
          <div class="input-box country-content" @click.stop="toggleCountryPicker">
            <div class="country-input">{{ country || 'Please select' }}</div>
            <div class="country-icon" :class="{ 'country-icon-open': showCountryPicker }"></div>
          </div>
          <div
            v-if="showCountryPicker"
            class="country-picker"
            @click.stop
          >
            <div
              v-for="item in countryOptions"
              :key="item"
              class="country-option"
              :class="{ 'country-option-active': item === country }"
              @click="selectCountry(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <div class="third">
        <div class="third-section">
          <div class="label">GENDER</div>
          <div class="gender-content">
            <div class="gender" @click="genderIndex = 0">
              <div class="gender-box" :class="{ 'gender-box-active': genderIndex === 0 }">
                <div class="gender-woman-icon"></div>
              </div>
              <div class="gender-text">Female</div>
            </div>
            <div class="gender" @click="genderIndex = 1">
              <div class="gender-box" :class="{ 'gender-box-active': genderIndex === 1 }">
                <div class="gender-man-icon"></div>
              </div>
              <div class="gender-text">Male</div>
            </div>
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
import { computed, ref } from 'vue'
import BackButton from '@/components/back.vue'
import {
  sendShowLoadingToIOS,
  sendShowToastToIOS,
  sendNewUserDataToIOS,
} from '@/utils/iosBridge'
import { uploadSingleImage } from '@/utils/ossUpload'

const topBlockImage = ref('/src/assets/ORINXDefaultAva.png')
const name = ref('')

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatBirthdayDisplay = (value) => {
  if (!value) return 'Please select'
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${month}/${day}/${year}`
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

const getMinBirthday = () => '1900-01-01'

const maxBirthday = getMaxBirthday()
const minBirthday = getMinBirthday()
const birthday = ref(getDefaultBirthday())
const birthdayDisplay = computed(() => formatBirthdayDisplay(birthday.value))

const countryOptions = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'Malaysia',
  'Philippines',
  'Thailand',
  'Vietnam',
  'Indonesia'
]
const country = ref('')
const showCountryPicker = ref(false)
const genderIndex = ref(0)

const fileInput = ref(null)
const birthdayInput = ref(null)
const avatarFile = ref(null)

const chooseAvatar = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const clampBirthday = (value) => {
  if (!value) return getDefaultBirthday()
  if (value > maxBirthday) return maxBirthday
  if (value < minBirthday) return minBirthday
  return value
}

const openBirthdayPicker = () => {
  const input = birthdayInput.value
  if (!input) return

  birthday.value = clampBirthday(birthday.value)

  if (typeof input.showPicker === 'function') {
    input.showPicker()
    return
  }

  input.click()
}

const handleBirthdayChange = (event) => {
  const value = event?.target?.value || birthday.value
  birthday.value = clampBirthday(value)
}

const toggleCountryPicker = () => {
  showCountryPicker.value = !showCountryPicker.value
}

const closeCountryPicker = () => {
  showCountryPicker.value = false
}

const selectCountry = (value) => {
  country.value = value
  showCountryPicker.value = false
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarFile.value = file

  const reader = new FileReader()
  reader.onload = (ev) => {
    topBlockImage.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

const saveProfile = async () => {
  if (!avatarFile.value) {
    sendShowToastToIOS('Please select avatar')
    return
  }

  if (!name.value.trim()) {
    sendShowToastToIOS('Please enter name')
    return
  }

  if (!country.value) {
    sendShowToastToIOS('Please select country')
    return
  }

  sendShowLoadingToIOS(true)

  let avatarUrl = topBlockImage.value

  try {
    if (avatarFile.value) {
      avatarUrl = await uploadSingleImage(avatarFile.value, 'template_development')
    }

    const newUserData = {
      avator: avatarUrl,
      name: name.value,
      birthday: birthday.value,
      country: country.value,
      gender: genderIndex.value === 0 ? 'female' : 'male',
    }

    sendShowLoadingToIOS(false)
    sendNewUserDataToIOS(newUserData)
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-header {
  min-height: 0;
  display: flex;
  align-items: center;
  gap: calc(100vw * 16 / 375);
  padding: calc(100vh * 58 / 812) calc(100vw * 20 / 375) 0;
}

.content {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.top,
.second,
.third {
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
}

.camera-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 50%;
  background: rgba(0, 0, 0, 1);
  border: calc(100vw * 1 / 375) solid rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-corner img {
  width: calc(100vw * 14 / 375);
  height: calc(100vw * 14 / 375);
}

.second-section,
.third-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(100vh * 10 / 812);
  width: calc(100% - calc(100vh * 40 / 812));
  position: relative;
}

.second-section {
  margin: calc(100vh * 30 / 812) 0 0;
}

.third-section {
  margin-top: calc(100vh * 20 / 812);
}

.label {
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: calc(100vw * 26.94 / 375);
  color: rgba(0, 0, 0, 1);
}

.input-box {
  width: 100%;
  min-height: calc(100vh * 54 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(255, 255, 255, 0.3);
  border: calc(100vw * 1 / 375) solid white;
  backdrop-filter: blur(calc(100vw * 12 / 375));
  display: flex;
  align-items: center;
  padding: 0 calc(100vw * 16 / 375);
  box-sizing: border-box;
  cursor: pointer;
}

.birthday-content,
.country-content {
  justify-content: space-between;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 0.5);
}

.birthday-input,
.country-input {
  flex: 1;
  color: rgba(0, 0, 0, 1);
}

.birthday-native-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

.birthday-icon,
.country-icon {
  width: calc(100vw * 19 / 375);
  height: calc(100vh * 19 / 812);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
}

.birthday-icon {
  background-image: url('@/assets/birthdayicon.png');
}

.country-icon {
  background-image: url('@/assets/birthdayicon.png');
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}

.country-icon-open {
  transform: rotate(180deg);
}

.country-picker {
  width: 100%;
  margin-top: calc(100vh * 8 / 812);
  border-radius: calc(100vw * 16 / 375);
  border: calc(100vw * 1 / 375) solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(calc(100vw * 12 / 375));
  overflow: hidden;
  box-sizing: border-box;
}

.country-option {
  height: calc(100vh * 48 / 812);
  padding: 0 calc(100vw * 16 / 375);
  display: flex;
  align-items: center;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 14 / 375);
  color: rgba(0, 0, 0, 0.85);
  border-bottom: calc(100vw * 1 / 375) solid rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.country-option:last-child {
  border-bottom: none;
}

.country-option-active {
  color: rgba(243, 96, 86, 1);
  font-weight: 700;
}

.input-box input {
  width: 100%;
  border: none;
  outline: none;
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: #000000;
  background: transparent;
}

.input-box input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.gender-content {
  display: flex;
  gap: calc(100vw * 54 / 375);
  margin-top: calc(100vh * 16 / 812);
}

.gender {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(100vh * 10 / 375);
  cursor: pointer;
}

.gender-woman-icon,
.gender-man-icon {
  width: calc(100vh * 41 / 812);
  height: calc(100vh * 41 / 812);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.gender-woman-icon {
  background-image: url('@/assets/registerwomanicon.png');
}

.gender-man-icon {
  background-image: url('@/assets/registermanicon.png');
}

.gender-text {
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 700;
  line-height: calc(100vw * 18.86 / 375);
  letter-spacing: 0;
  color: rgba(0, 0, 0, 1);
}

.gender-box {
  width: calc(100vh * 60 / 812);
  height: calc(100vh * 60 / 812);
  background: rgba(188, 189, 195, 1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: calc(100vw * 2 / 375) solid transparent;
  box-sizing: border-box;
}

.gender-box-active {
  border: calc(100vw * 2 / 375) solid rgba(206, 254, 74, 1);
}

.fourth-section {
  margin: calc(100vh * 37 / 812) 0 calc(100vh * 34 / 812);
  display: flex;
  justify-content: center;
  width: 100%;
}

.save-btn {
  width: calc(100vw * 198 / 375);
  height: calc(100vh * 60 / 812);
  background-color: rgba(243, 96, 86, 1);
  border-radius: calc(100vw * 264 / 375);
  font-family: 'texgyreadventor', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: calc(100vw * 32.33 / 375);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>