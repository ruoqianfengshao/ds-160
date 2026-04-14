export default defineNuxtRouteMiddleware(async (to, from) => {
  // Check if route requires auth (default: true)
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (!requiresAuth) return
  
  const authStore = useAuthStore()
  
  // For server-side: check cookie directly
  if (process.server) {
    const authCookie = useCookie('auth_token')
    if (!authCookie.value) {
      return navigateTo('/login')
    }
    return
  }
  
  // For client-side: ensure auth state is loaded
  if (!authStore.user) {
    // Try to load user from server (cookie-based)
    await authStore.loadUser()
  }
  
  // Check authentication
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
