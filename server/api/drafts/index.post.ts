import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.userId
  const { title, formData, currentStep, completionPercentage } = await readBody(event)

  try {
    const { rows } = await sql`
      INSERT INTO ds160_drafts (user_id, title, form_data, current_step, completion_percentage)
      VALUES (
        ${userId},
        ${title || 'DS-160 Draft'},
        ${JSON.stringify(formData || {})},
        ${currentStep || 1},
        ${completionPercentage || 0}
      )
      RETURNING *
    `

    // Log sync
    await sql`
      INSERT INTO sync_history (user_id, draft_id, action)
      VALUES (${userId}, ${rows[0].id}, 'create')
    `

    return {
      success: true,
      draft: rows[0]
    }
  } catch (error) {
    console.error('Create draft error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create draft'
    })
  }
})
