export default defineNuxtRouteMiddleware(async (to, from) => {
  // Check if route requires auth (default: true)
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (!requiresAuth) return
  
  // For server-side: check cookie directly
  if (process.server) {
    const authCookie = useCookie('auth_token')
    if (!authCookie.value) {
      return navigateTo('/login')
    }
    return
  }
  
  // For client-side: use store
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
