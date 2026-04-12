import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { email, password, fullName } = await readBody(event)

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: '请输入邮箱和密码'
    })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: '邮箱格式不正确'
    })
  }

  // Password validation
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: '密码至少需要 6 个字符'
    })
  }

  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.rows.length > 0) {
      throw createError({
        statusCode: 409,
        message: '该邮箱已被注册'
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const userResult = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${passwordHash})
      RETURNING id, email, created_at
    `

    const user = userResult.rows[0]

    // Create profile
    await sql`
      INSERT INTO profiles (id, full_name, plan, sync_count, sync_limit)
      VALUES (${user.id}, ${fullName || null}, 'free', 0, 3)
    `

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
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Signup error:', error)
    throw createError({
      statusCode: 500,
      message: '注册失败，请稍后重试'
    })
  }
})
