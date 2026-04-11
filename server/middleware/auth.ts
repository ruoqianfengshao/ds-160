import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const protectedPaths = ['/api/drafts', '/api/user']
  
  if (!protectedPaths.some(path => event.path?.startsWith(path))) {
    return
  }

  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string }
    
    event.context.userId = decoded.userId
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token'
    })
  }
})
