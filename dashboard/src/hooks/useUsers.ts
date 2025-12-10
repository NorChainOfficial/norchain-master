'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: string
  created_at: string
}

export function useUsers() {
  const supabase = createClient()

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name')

      if (error) throw error
      return data as User[]
    },
  })

  return {
    users,
    isLoading,
    error,
    refetch,
  }
}

export default useUsers

