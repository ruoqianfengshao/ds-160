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

    // Get update data
    const updates = await readBody(event)

    // Validate allowed fields
    const allowedFields = ['full_name', 'avatar_url']
    const updateData: any = {}
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No valid fields to update'
      })
    }

    // Update profile
    const result = await sql`
      UPDATE profiles 
      SET ${sql(updateData)}, updated_at = NOW()
      WHERE id = ${decoded.userId}
      RETURNING *
    `

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Profile not found'
      })
    }

    return {
      success: true,
      profile: result.rows[0]
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token'
      })
    }
    
    if (error.statusCode) throw error
    
    console.error('Update profile error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update profile'
    })
  }
})
