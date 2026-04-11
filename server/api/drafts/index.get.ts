import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.userId

  try {
    const { rows } = await sql`
      SELECT id, title, current_step, completion_percentage, 
             status, created_at, updated_at, last_synced_at
      FROM ds160_drafts
      WHERE user_id = ${userId} AND status != 'archived'
      ORDER BY updated_at DESC
    `

    return {
      success: true,
      drafts: rows
    }
  } catch (error) {
    console.error('List drafts error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch drafts'
    })
  }
})
