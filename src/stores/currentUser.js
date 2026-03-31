import { defineStore } from 'pinia'
import currentUserData from '../data/currentUser.json'

export const useCurrentUserStore = defineStore('currentUser', {
    state: () => ({
        currentUser: window.currentUser || currentUserData
    }),
    actions: {
        setCurrentUser(user) {
            this.currentUser = user
        window.currentUser = user
        console.log("currentUser:", window.currentUser)
      }
      
      
    }
})

// ⭐️ 关键：挂到 window
window.updateCurrentUser = function (user) {
    const currentUserStore = useCurrentUserStore()
    currentUserStore.setCurrentUser(user)
}