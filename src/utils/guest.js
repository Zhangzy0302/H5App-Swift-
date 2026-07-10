export function isGuestUser(currentUserStore) {
  const currentUser = currentUserStore.currentUser
  if (!currentUser) return true

  return !String(currentUser.email || '').trim() || !String(currentUser.password || '').trim()
}

export function requireLoginForGuest(currentUserStore, uiStore) {
  if (isGuestUser(currentUserStore)) {
    uiStore.openToLogin()
    return true
  }

  return false
}

export function preventGuestInput(event, currentUserStore, uiStore) {
  if (!requireLoginForGuest(currentUserStore, uiStore)) return false

  event?.target?.blur?.()
  return true
}
