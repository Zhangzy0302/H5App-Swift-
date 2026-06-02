import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
    const loading = ref(false)
    const toastMessage = ref('')
    const showComment = ref(false)
    const showToLogin = ref(false)

    function showLoading() {
        loading.value = true
    }

    function hideLoading() {
        loading.value = false
    }

    function showToast(message, duration = 1500) {
        toastMessage.value = message
        setTimeout(() => { toastMessage.value = '' }, duration)
    }

    function openComment() {
        showComment.value = true
    }

    function closeComment() {
        showComment.value = false
    }

    function openToLogin() {
        showToLogin.value = true
    }

    function closeToLogin() {
        showToLogin.value = false
    }

    return {
        loading,
        showLoading,
        hideLoading,
        toastMessage,
        showToast,
        showComment,
        openComment,
        closeComment,
        showToLogin,
        openToLogin,
        closeToLogin
    }
})