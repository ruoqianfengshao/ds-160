// Switch to Miaoda Database (managed PostgreSQL service)
import { sql } from './miaoda-db'

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
  user_id: string
  full_name?: string
  purpose?: string
  visa_type?: string
  country?: string
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
