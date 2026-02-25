import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    registerSW({
      onNeedRefresh() {
        console.log('New content available, refresh to update.')
      },
      onOfflineReady() {
        console.log('App ready to work offline.')
      },
    })
  }
}
