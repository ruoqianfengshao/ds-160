export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_token')

  return {
    success: true,
    message: 'Logged out successfully'
  }
})
