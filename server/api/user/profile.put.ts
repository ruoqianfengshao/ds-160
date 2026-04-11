import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = event.context.userId
  const { fullName, avatarUrl } = await readBody(event)

  try {
    await sql`
      UPDATE profiles
      SET full_name = ${fullName || null},
          avatar_url = ${avatarUrl || null}
      WHERE id = ${userId}
    `

    return {
      success: true,
      message: 'Profile updated successfully'
    }
  } catch (error) {
    console.error('Update profile error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update profile'
    })
  }
})
