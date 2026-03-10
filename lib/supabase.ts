import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          imei: string
          service_id: string
          api_order_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          result: Record<string, unknown> | null
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          imei: string
          service_id: string
          api_order_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          result?: Record<string, unknown> | null
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          imei?: string
          service_id?: string
          api_order_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          result?: Record<string, unknown> | null
          price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          name: string
          api_service_id: string
          api_price: number
          sell_price: number
          delivery_time: string
          category: string
          description: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          api_service_id: string
          api_price: number
          sell_price: number
          delivery_time: string
          category: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          api_service_id?: string
          api_price?: number
          sell_price?: number
          delivery_time?: string
          category?: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          id: string
          sync_type: string
          status: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sync_type: string
          status: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sync_type?: string
          status?: string
          message?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
