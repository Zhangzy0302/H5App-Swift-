import { defineStore } from 'pinia'
import usersData from '../data/users.json'
import { useCurrentUserStore } from './currentUser'
import { sendUsersToIOS } from '@/utils/iosBridge'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: window.userList || usersData,  // 初始化为本地 JSON
  }),
  actions: {
    getUserById(id) {
      return this.users.find(user => String(user.userId) === String(id))
    },
    getOtherUserInChat(chatUserIds) {
      const currentUserStore = useCurrentUserStore()
      const myId = currentUserStore.currentUser.userId
      const otherId = chatUserIds.find(id => id !== myId)
      return this.getUserById(otherId)
    },
    // 公共方法：更新用户信息并通知iOS
    updateUser(userId, newData) {
      const user = this.users.find(u => String(u.userId) === String(userId))
      if (user) {
        Object.assign(user, newData)

        // 如果是当前登录用户，同步更新 currentUserStore
        const currentUserStore = useCurrentUserStore()
        if (String(userId) === String(currentUserStore.currentUser.userId)) {
          currentUserStore.setCurrentUser({ ...currentUserStore.currentUser, ...newData })
        }

        window.userList = this.users

        // 通知iOS
        sendUsersToIOS(this.users)
      }
    },
  }
})
