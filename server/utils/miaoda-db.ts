import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface QueryResult {
  rows: any[]
  rowCount: number
}

/**
 * Execute SQL query using miaoda-data-cli
 */
async function query(sqlQuery: string, params?: any[]): Promise<QueryResult> {
  // Replace parameterized queries with actual values
  let finalQuery = sqlQuery
  if (params && params.length > 0) {
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`
      let value: string
      
      if (param === null || param === undefined) {
        value = 'NULL'
      } else if (typeof param === 'string') {
        // Escape single quotes and wrap in quotes
        value = `'${param.replace(/'/g, "''")}'`
      } else if (typeof param === 'object') {
        // For JSONB columns
        value = `'${JSON.stringify(param).replace(/'/g, "''")}'::jsonb`
      } else {
        value = String(param)
      }
      
      finalQuery = finalQuery.replace(placeholder, value)
    })
  }

  try {
    const { stdout, stderr } = await execAsync(
      `npx -y @lark-apaas/miaoda-data-cli db sql --json '${finalQuery.replace(/'/g, "'\\''")}'`,
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
    )

    if (stderr && stderr.includes('ERROR')) {
      throw new Error(`SQL execution failed: ${stderr}`)
    }

    // Parse JSON output
    const result = JSON.parse(stdout)
    
    // Handle different response formats
    if (Array.isArray(result)) {
      // SELECT queries return array directly
      return {
        rows: result,
        rowCount: result.length
      }
    } else if (result.data) {
      return {
        rows: result.data,
        rowCount: result.data.length
      }
    } else if (result.affectedRows !== undefined) {
      // For INSERT/UPDATE/DELETE - Miaoda doesn't support RETURNING
      // Return empty rows but preserve rowCount for affected rows
      return {
        rows: [],
        rowCount: result.affectedRows
      }
    } else {
      return {
        rows: [],
        rowCount: 0
      }
    }
  } catch (error: any) {
    console.error('Database query error:', error)
    throw new Error(`Database query failed: ${error.message}`)
  }
}

// Template literal tag function to mimic @vercel/postgres sql`` API
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  // Build parameterized query
  let queryStr = strings[0]
  const params: any[] = []
  
  for (let i = 0; i < values.length; i++) {
    params.push(values[i])
    queryStr += `$${i + 1}${strings[i + 1]}`
  }
  
  return query(queryStr, params)
}

// Export types from original db.ts
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
