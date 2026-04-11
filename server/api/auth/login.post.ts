import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  try {
    // Check if user exists
    const { rows } = await sql`
      SELECT id, email, password_hash FROM users WHERE email = ${email}
    `

    if (rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }

    const user = rows[0]

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }

    // Get profile
    const profileResult = await sql`
      SELECT * FROM profiles WHERE id = ${user.id}
    `

    const profile = profileResult.rows[0]

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
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

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        profile: profile || null
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      message: 'Login failed'
    })
  }
})
