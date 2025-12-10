'use client'

import { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'

interface Channel {
  id: string
  name: string
  description: string
  type: 'public' | 'private' | 'direct'
  project_id: string
}

interface Message {
  id: string
  content: string
  channel_id: string
  user_id: string
  created_at: string
  user?: {
    id: string
    name: string
    avatar_url?: string
  }
}

export function useChat(projectId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)

  // Fetch channels
  const { data: channels = [], isLoading: channelsLoading } = useQuery({
    queryKey: ['chat-channels', projectId],
    queryFn: async () => {
      if (!projectId) return []
      const response = await fetch(`/api/v1/chat?project_id=${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch channels')
      return response.json()
    },
    enabled: !!projectId,
  })

  // Fetch messages for active channel
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages', activeChannelId],
    queryFn: async () => {
      if (!activeChannelId) return []
      const response = await fetch(`/api/v1/chat?channel_id=${activeChannelId}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      return response.json()
    },
    enabled: !!activeChannelId,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      channelId,
      content,
      userId,
    }: {
      channelId: string
      content: string
      userId: string
    }) => {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channelId,
          user_id: userId,
          content,
        }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      return response.json()
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ['chat-messages', activeChannelId],
        (old: Message[] = []) => [...old, newMessage]
      )
    },
  })

  // Real-time subscription for new messages
  useEffect(() => {
    if (!activeChannelId) return

    const channel = supabase
      .channel(`chat:${activeChannelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${activeChannelId}`,
        },
        async (payload) => {
          // Fetch the full message with user info
          const { data: message } = await supabase
            .from('chat_messages')
            .select('*, user:users(*)')
            .eq('id', payload.new.id)
            .single()

          if (message) {
            queryClient.setQueryData(
              ['chat-messages', activeChannelId],
              (old: Message[] = []) => {
                // Avoid duplicates
                if (old.some((m) => m.id === message.id)) return old
                return [...old, message]
              }
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [activeChannelId, supabase, queryClient])

  // Set first channel as active
  useEffect(() => {
    if (channels.length > 0 && !activeChannelId) {
      setActiveChannelId(channels[0].id)
    }
  }, [channels, activeChannelId])

  const sendMessage = useCallback(
    async (content: string, userId: string) => {
      if (!activeChannelId) return
      return sendMessageMutation.mutateAsync({
        channelId: activeChannelId,
        content,
        userId,
      })
    },
    [activeChannelId, sendMessageMutation]
  )

  return {
    channels,
    messages,
    activeChannelId,
    setActiveChannelId,
    sendMessage,
    channelsLoading,
    messagesLoading,
    isSending: sendMessageMutation.isPending,
  }
}

export default useChat

