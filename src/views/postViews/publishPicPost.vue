<template>
  <div class="page">
    <div class="back">
      <BackButton/>
    </div>
    <div class="page-content">
        <!-- 输入框 -->
        <div class="input-box">
          <textarea
            v-model="text"
            maxlength="150"
            class="post-textarea"
            placeholder="Please enter"
          ></textarea>
          <div class="text-count">{{ text.length }}/150</div>
        </div>
        <!-- Theme -->
        <div class="theme-label">Topic</div>
        <!-- ThemeList -->
        <div class="theme-list">
          <div v-for="(theme, index) in otherStore.other.postTheme" :key="index" class="theme-item" :class="{ selected: selectedTheme === index }" @click="selectedTheme = index">{{ theme }}</div>
        </div>
        <!-- Upload（Pic） -->
        <div class="theme-label">Upload&nbsp;&nbsp;(Pic)</div>
        <!-- 图片上传 -->
        <div class="upload-list">
          <!-- 添加图片按钮 -->
          <label
            v-if="uploadedImagesFiles.length < maxImages"
            class="upload-item"
          >
            <input type="file" accept="image/*" multiple style="display:none" @change="handleAddImage" />
            <div class="upload-add"></div>
          </label>
          <!-- 预览已选择但未上传的图片 -->
          <template v-if="uploadedImagesFiles.length > 0">
            <label
              v-for="(file, index) in uploadedImagesFiles"
              :key="index"
              class="upload-item"
            >
              <div
                class="upload-image"
                :style="{ backgroundImage: file ? `url(${file.preview || file._previewUrl || URL.createObjectURL(file)})` : '' }"
              ></div>
              <van-icon class="upload-remove" name="clear" size="20" @click="handleRemoveImage(index)" color="#FF4E3B"/>
            </label>
          </template>
        </div>
        <!-- Release -->
        <div class="release-button" @click="handleRelease">Release</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useOtherStore } from '@/stores/other'
import { useUIStore } from '@/stores/ui'
import { usePostStore } from '@/stores/post'
import { useCurrentUserStore } from '@/stores/currentUser'
import BackButton from '@/components/back.vue'
import { uploadMultipleImages } from '@/utils/ossUpload.js'
import { goBackOrClose } from '@/utils/iosBridge'

const text = ref('')
const selectedTheme = ref(0)

const otherStore = useOtherStore()

const maxImages = 5
const uploadedImagesFiles = ref([]) // store selected File objects (local preview only)

const handleAddImage = (event) => {
  const files = Array.from(event.target.files)
  const remaining = maxImages - uploadedImagesFiles.value.length
  const toAdd = files.slice(0, remaining).map(file => {
    file.preview = window.URL.createObjectURL(file) // local preview only
    return file
  })
  uploadedImagesFiles.value.push(...toAdd)
}

const handleRemoveImage = (index) => {
  uploadedImagesFiles.value.splice(index, 1)
}

const uiStore = useUIStore()
const postStore = usePostStore()
const currentUserStore = useCurrentUserStore()
const handleRelease = async () => {
  if (!text.value.trim()) {
    uiStore.showToast('Please fill in the post text.')
    return
  }
  if (!uploadedImagesFiles.value.length) {
    uiStore.showToast('Please select at least one image.')
    return
  }

  if (uiStore.loading) return
  uiStore.showLoading()

  try {
    // 上传图片到 OSS
    const urls = await uploadMultipleImages(uploadedImagesFiles.value, 'template_development')

    // 构造新帖子对象
    const newPost = {
      dynamicId: String(postStore.posts.length + 1), // 生成唯一ID
      userId: currentUserStore.currentUser.userId, // 可以替换为当前用户ID
      dynamicType: 0,
      dynamicDesc: text.value,
      dynamicTitleType: selectedTheme.value,
      dynamicPic: urls,
      dynamicVideo: '', // 如果有视频可以赋值
      dynamicLikeCount: 0,
      dynamicCommentCount: 0
    }

    // 添加到帖子列表
    postStore.addPost(newPost)

    uiStore.showToast('Post released successfully')
    goBackOrClose()
    
  } catch (err) {
    console.error('上传失败', err)
    uiStore.showToast('Upload failed, please check your network.')
  } finally {
    uiStore.hideLoading()
  }
}
</script>

<style scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 228, 161, 1) 22%, rgba(248, 248, 246, 1) 42%, rgba(248, 248, 246, 1) 100%);
  overflow: hidden;
}

.back {
  padding-top: calc(100vh * 56 / 812);
  padding-left: calc(100vw * 20 / 375);
}

.back :deep(.outer-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  border-radius: 0;
  background: transparent;
}

.back :deep(.inner-box) {
  width: calc(100vw * 28 / 375);
  height: calc(100vw * 28 / 375);
  filter: brightness(0) saturate(100%) invert(16%) sepia(11%) saturate(1024%) hue-rotate(315deg) brightness(94%) contrast(85%);
}

.page-content {
  position: relative;
  width: 100vw;
  height: calc(100vh - calc(100vh * 96 / 812));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.input-box {
  position: relative;
  margin-top: calc(100vh * 22 / 812);
  margin-left: calc(100vw * 20 / 375);
  margin-right: calc(100vw * 9 / 375);
  height: calc(100vh * 192 / 812);
  border-radius: calc(100vw * 16 / 375);
  background: rgba(255, 255, 255, 1);
  padding: calc(100vh * 16 / 812) calc(100vw * 12 / 375);
  box-sizing: border-box;
}

.post-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 20 / 375);
  background: transparent;
  color: rgba(60, 48, 48, 1);
}

.post-textarea::placeholder {
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: 400;
  line-height: calc(100vw * 20 / 375);
  color: rgba(60, 48, 48, 0.48);
}

.text-count {
  position: absolute;
  right: calc(100vw * 14 / 375);
  bottom: calc(100vh * 16 / 812);
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 14 / 375);
  font-weight: normal;
  color: rgba(60, 48, 48, 0.42);
}

.theme-label {
  margin-top: calc(100vh * 28 / 812);
  margin-left: calc(100vw * 20 / 375);
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 20 / 375);
  font-weight: 700;
  line-height: calc(100vw * 23.1 / 375);
  color: rgba(60, 48, 48, 1);
  text-align: left;
}

.theme-list {
  display: flex;
  justify-content: flex-start;
  gap: calc(100vw * 9 / 375);
  margin-left: calc(100vw * 20 / 375);
  margin-top: calc(100vh * 22 / 812);
  padding-right: calc(100vw * 7 / 375);
}

.theme-item {
  height: calc(100vh * 41 / 812);
  border-radius: calc(100vw * 22 / 375);
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins-Regular', sans-serif;
  font-size: calc(100vw * 18 / 375);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  color: rgba(60, 48, 48, 1);
  cursor: pointer;
  padding: 0 calc(100vw * 18 / 375);
  box-sizing: border-box;
}

.theme-item.selected {
  background: rgba(255, 190, 25, 1);
  color: rgba(60, 48, 48, 1);
}

.upload-list {
  display: flex;
  overflow-x: auto;
  margin-top: calc(100vh * 13 / 812);
  padding-left: calc(100vw * 20 / 375);
  padding-right: calc(100vw * 20 / 375);
  gap: calc(100vw * 8 / 375);
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}
.upload-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.upload-item {
  width: calc(100vw * 110 / 375);
  height: calc(100vw * 110 / 375);
  flex-shrink: 0;
  border-radius: calc(100vw * 17 / 375);
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.upload-add {
  width: calc(100vw * 40 / 375);
  height: calc(100vw * 40 / 375);
  border-radius: 50%;
  background-color: rgba(255, 190, 25, 1);
  background-image: url('@/assets/uploadpic.png');
  background-size: calc(100vw * 40 / 375) calc(100vw * 40 / 375);
  background-position: center;
  background-repeat: no-repeat;
  margin: auto;
}

.upload-remove {
  position: absolute;
  top: calc(100vh * -4 / 812);
  right: calc(100vw * -4 / 375);
  width: calc(100vw * 26 / 375);
  height: calc(100vw * 26 / 375);
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 78, 59, 1) !important;
}

/* Release Button Styles */
.release-button {
  width: calc(100vw * 194 / 375);
  height: calc(100vh * 56 / 812);
  border-radius: calc(100vw * 40 / 375);
  background: rgba(255, 190, 25, 1);
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 16 / 375);
  font-weight: 700;
  line-height: 1;
  color: rgba(60, 48, 48, 1);
  cursor: pointer;
  margin: calc(100vh * 123 / 812) auto calc(100vh * 72 / 812) auto;
}
</style>
