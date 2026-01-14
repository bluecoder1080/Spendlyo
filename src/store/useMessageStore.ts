import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Message, Role } from '@/lib/types-chat'

interface MessageState {
  messages: Message[]
  isLoading: boolean
  fetchMessages: () => Promise<void>
  sendMessage: (content: string, role?: Role) => Promise<void>
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  fetchMessages: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      set({ messages: [], isLoading: false })
      return
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true }) // Oldest first for chat

    if (error) {
      console.error('Error fetching messages:', error)
      set({ isLoading: false })
      return
    }

    set({ messages: data as Message[], isLoading: false })
  },

  sendMessage: async (content, role = 'user') => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Optimistic Update
    const optimisticId = crypto.randomUUID()
    const optimisticMessage: Message = {
      id: optimisticId,
      user_id: user.id,
      content,
      role,
      created_at: new Date().toISOString(),
    }

    set((state) => ({ messages: [...state.messages, optimisticMessage] }))

    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: user.id,
        content,
        role,
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      // Revert optimistic update? Or just let it fail silently/show toast.
      // For now, simpler to just refetch or rely on sync.
      // We will remove the optimistic message if it fails, or replace it with real one.
      set((state) => ({ 
          messages: state.messages.filter(m => m.id !== optimisticId) 
      }))
      return
    }

    if (data) {
        // Replace optimistic with real
        set((state) => ({
            messages: state.messages.map(m => m.id === optimisticId ? (data as Message) : m)
        }))
    }
  },
}))
