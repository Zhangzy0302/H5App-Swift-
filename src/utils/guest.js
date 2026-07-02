export function isGuestUser(currentUserStore) {
  return currentUserStore.currentUser?.isguest == 1
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
