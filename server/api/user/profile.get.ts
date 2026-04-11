import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    const { rows } = await sql`
      SELECT u.id, u.email, u.created_at,
             p.full_name, p.avatar_url, p.plan, 
             p.sync_count, p.sync_limit, p.sync_reset_at
      FROM users u
      LEFT JOIN profiles p ON u.id = p.id
      WHERE u.id = ${userId}
    `

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return {
      success: true,
      user: rows[0]
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Get profile error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch profile'
    })
  }
})
