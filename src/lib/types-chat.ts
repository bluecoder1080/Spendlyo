export type Role = 'user' | 'system'

export interface Message {
  id: string
  user_id: string
  content: string
  role: Role
  created_at: string
}
