import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.userId
  const draftId = getRouterParam(event, 'id')

  if (!draftId) {
    throw createError({
      statusCode: 400,
      message: 'Draft ID is required'
    })
  }

  try {
    const { rows } = await sql`
      SELECT * FROM ds160_drafts
      WHERE id = ${draftId} AND user_id = ${userId}
    `

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Draft not found'
      })
    }

    return {
      success: true,
      draft: rows[0]
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Get draft error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch draft'
    })
  }
})
