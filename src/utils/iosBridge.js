// Send updated users list to iOS
export function sendUsersToIOS(users) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.userListUpdate
      ) {
          // 解开 Vue Proxy，保证纯数组对象
          const plainUsers = JSON.parse(JSON.stringify(users))
          window.webkit.messageHandlers.userListUpdate.postMessage({ users: plainUsers })
      } else {
          console.warn('iOS handler userListUpdate not found')
      }
  } catch (e) {
      console.error('sendUsersToIOS error', e)
  }
}

// Send updated posts list to iOS
export function sendPostsToIOS(posts) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.postsUpdate
      ) {
          // 解开 Vue Proxy，保证纯数组对象
          const plainPosts = JSON.parse(JSON.stringify(posts))
          window.webkit.messageHandlers.postsUpdate.postMessage({ posts: plainPosts })
          window.webkit.messageHandlers.postsUpdate.postMessage(posts)
      } else {
          console.warn('iOS handler postsUpdate not found')
      }
  } catch (e) {
      console.error('sendPostsToIOS error', e)
  }
}

// Send updated chats list to iOS
export function sendChatsToIOS(chats) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.chatsUpdate
      ) {
          // 解开 Vue Proxy，保证纯数组对象
          const plainChats = JSON.parse(JSON.stringify(chats))
          window.webkit.messageHandlers.chatsUpdate.postMessage({ chats: plainChats })
      } else {
          console.warn('iOS handler chatsUpdate not found')
      }
  } catch (e) {
      console.error('sendChatsToIOS error', e)
  }
}

// Send updated messages list to iOS
export function sendMessagesToIOS(messages) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.messagesUpdate
      ) {
          // 解开 Vue Proxy，保证纯数组对象
          const plainMessages = JSON.parse(JSON.stringify(messages))
          window.webkit.messageHandlers.messagesUpdate.postMessage({ messages: plainMessages })
      } else {
          console.warn('iOS handler messagesUpdate not found')
      }
  } catch (e) {
      console.error('sendMessagesToIOS error', e)
  }
}

// Send updated comments list to iOS
export function sendCommentsToIOS(comments) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.commentsUpdate
      ) {
          // 解开 Vue Proxy，保证纯数组对象
          const plainComments = JSON.parse(JSON.stringify(comments))
          window.webkit.messageHandlers.commentsUpdate.postMessage({ comments: plainComments })
      } else {
          console.warn('iOS handler commentsUpdate not found')
      }
  } catch (e) {
      console.error('sendCommentsToIOS error', e)
  }
}

// Notify iOS that user logged out
export function sendLogoutToIOS(isLogout) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.logout
      ) {
          window.webkit.messageHandlers.logout.postMessage({ isLogout: isLogout })
      } else {
          console.warn('iOS handler logout not found')
      }
  } catch (e) {
      console.error('sendLogoutToIOS error', e)
  }
}

// Handle page back or close action
export function goBackOrClose() {
  if (window.history.state.back) {
      history.back()
  } else {
      // iOS WKWebView callback to close the page
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.close) {
          window.webkit.messageHandlers.close.postMessage({})
      } else {
          console.warn('WebKit close handler not found')
      }
  }
}

// Notify iOS to start in-app purchase
export function sendPaymentToIOS(payKey) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.payment
      ) {
          window.webkit.messageHandlers.payment.postMessage({ payKey: payKey })
          // iOS 端回调支付结果会通过 JS 调用 window[callbackName](success)
      } else {
          console.warn('iOS handler payment not found')
      }
  } catch (e) {
      console.error('sendPaymentToIOS error', e)
  }
}

// Notify iOS that page showLoading
export function sendShowLoadingToIOS(isShow) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.showLoading
      ) {
          window.webkit.messageHandlers.showLoading.postMessage({ isShow: isShow })
      } else {
          console.warn('iOS handler showLoading not found')
      }
  } catch (e) {
      console.error('sendShowLoadingToIOS error', e)
  }
}

// Notify iOS that page showToast
export function sendShowToastToIOS(toastMsg) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.showToast
      ) {
          window.webkit.messageHandlers.showToast.postMessage({ toastMsg: toastMsg })
      } else {
          console.warn('iOS handler showToast not found')
      }
  } catch (e) {
      console.error('sendShowToastToIOS error', e)
  }
}

// Send new user data to iOS
export function sendNewUserDataToIOS(newUserData) {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.newUserData
      ) {
          window.webkit.messageHandlers.newUserData.postMessage({ newUserData: newUserData })
      } else {
          console.warn('iOS handler newUserData not found')
      }
  } catch (e) {
      console.error('sendNewUserDataToIOS error', e)
  }
}

// Handle page back or close action
export function sendToLoginToIOS() {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.toLogin
      ) {
          window.webkit.messageHandlers.toLogin.postMessage({})
      } else {
          console.warn('iOS handler toLogin not found')
      }
  } catch (e) {
      console.error('sendToLoginToIOS error', e)
  }
}

// Ask iOS to resend the initial native data snapshot
export function sendRequestNativeDataToIOS() {
  try {
      if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.requestNativeData
      ) {
          window.webkit.messageHandlers.requestNativeData.postMessage({})
      } else {
          console.warn('iOS handler requestNativeData not found')
      }
  } catch (e) {
      console.error('sendRequestNativeDataToIOS error', e)
  }
}
