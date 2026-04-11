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
    // Check ownership
    const checkResult = await sql`
      SELECT id FROM ds160_drafts
      WHERE id = ${draftId} AND user_id = ${userId}
    `

    if (checkResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Draft not found'
      })
    }

    // Delete draft
    await sql`
      DELETE FROM ds160_drafts
      WHERE id = ${draftId}
    `

    // Log sync
    await sql`
      INSERT INTO sync_history (user_id, draft_id, action)
      VALUES (${userId}, ${draftId}, 'delete')
    `

    return {
      success: true,
      message: 'Draft deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Delete draft error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete draft'
    })
  }
})
