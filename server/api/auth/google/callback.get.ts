import { google } from 'googleapis'
import jwt from 'jsonwebtoken'
import { sql } from '~/server/utils/db'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Authorization code is required'
    })
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info from Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    })

    const { data: googleUser } = await oauth2.userinfo.get()

    if (!googleUser.email) {
      throw createError({
        statusCode: 400,
        message: 'Could not retrieve email from Google'
      })
    }

    // Check if user exists
    const existingUserResult = await sql`
      SELECT id, email FROM users WHERE email = ${googleUser.email}
    `

    let userId: string

    if (existingUserResult.rows.length > 0) {
      // User exists, use existing ID
      userId = existingUserResult.rows[0].id
    } else {
      // Create new user (no password needed for OAuth users)
      const newUserResult = await sql`
        INSERT INTO users (email, password_hash)
        VALUES (${googleUser.email}, 'OAUTH_GOOGLE')
        RETURNING id
      `
      userId = newUserResult.rows[0].id

      // Create profile
      await sql`
        INSERT INTO profiles (id, full_name, avatar_url)
        VALUES (${userId}, ${googleUser.name || null}, ${googleUser.picture || null})
      `
    }

    // Get profile
    const profileResult = await sql`
      SELECT * FROM profiles WHERE id = ${userId}
    `

    const profile = profileResult.rows[0]

    // Generate JWT
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    })

    // Redirect to dashboard
    return sendRedirect(event, '/dashboard')
  } catch (error: any) {
    console.error('Google OAuth error:', error)
    
    // Redirect to login page with error
    return sendRedirect(event, '/login?error=oauth_failed')
  }
})
