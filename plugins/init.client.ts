import { useAuthStore } from '~/stores/auth'
import { useDS160Store } from '~/stores/ds160'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const ds160Store = useDS160Store()

  // Initialize auth
  await authStore.initialize()

  // Initialize DS160 store
  await ds160Store.initialize()
})
