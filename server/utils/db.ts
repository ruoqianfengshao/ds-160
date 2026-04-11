import { sql } from '@vercel/postgres'

export { sql }

export interface User {
  id: string
  email: string
  password_hash: string
  created_at: Date
  updated_at: Date
}

export interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  plan: 'free' | 'premium' | 'enterprise'
  sync_count: number
  sync_limit: number
  sync_reset_at: Date
  created_at: Date
  updated_at: Date
}

export interface Draft {
  id: string
  user_id: string
  title: string
  form_data: any
  current_step: number
  completion_percentage: number
  status: 'draft' | 'submitted' | 'archived'
  created_at: Date
  updated_at: Date
  last_synced_at?: Date
}
