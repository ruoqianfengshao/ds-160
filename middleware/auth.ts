import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Skip middleware on server
  if (process.server) return

  // Check if route requires auth
  const requiresAuth = to.meta.requiresAuth !== false

  // Redirect to login if not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
