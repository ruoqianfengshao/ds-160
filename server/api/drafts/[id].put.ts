import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.userId
  const draftId = getRouterParam(event, 'id')
  const { title, formData, currentStep, completionPercentage, status } = await readBody(event)

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

    // Update draft
    const { rows } = await sql`
      UPDATE ds160_drafts
      SET title = COALESCE(${title}, title),
          form_data = COALESCE(${formData ? JSON.stringify(formData) : null}::jsonb, form_data),
          current_step = COALESCE(${currentStep}, current_step),
          completion_percentage = COALESCE(${completionPercentage}, completion_percentage),
          status = COALESCE(${status}, status),
          last_synced_at = NOW()
      WHERE id = ${draftId}
      RETURNING *
    `

    // Log sync
    await sql`
      INSERT INTO sync_history (user_id, draft_id, action)
      VALUES (${userId}, ${draftId}, 'update')
    `

    return {
      success: true,
      draft: rows[0]
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Update draft error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update draft'
    })
  }
})
