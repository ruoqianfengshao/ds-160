import jwt from 'jsonwebtoken'
import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Get auth token from cookie
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }

    // Get user
    const userResult = await sql`
      SELECT id, email, created_at FROM users WHERE id = ${decoded.userId}
    `

    if (userResult.rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: 'User not found'
      })
    }

    const user = userResult.rows[0]

    // Get profile
    const profileResult = await sql`
      SELECT * FROM profiles WHERE id = ${user.id}
    `

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        profile: profileResult.rows[0] || null
      }
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token'
      })
    }
    
    if (error.statusCode) throw error
    
    console.error('Get user error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get user'
    })
  }
})
