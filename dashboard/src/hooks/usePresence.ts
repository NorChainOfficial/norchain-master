'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface PresencePayload {
  user_id: string
  status: 'online' | 'away' | 'busy' | 'offline'
  current_page?: string
  last_seen: string
}

type PresenceState = Record<string, PresencePayload[]>

export function usePresence(projectId?: string, userId?: string) {
  const [presenceState, setPresenceState] = useState<PresenceState>({})
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!projectId || !userId) return

    const presenceChannel = supabase.channel(`presence:${projectId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState() as unknown as PresenceState
        setPresenceState(state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: userId,
            status: 'online',
            current_page: window.location.pathname,
            last_seen: new Date().toISOString(),
          })
        }
      })

    setChannel(presenceChannel)

    // Update presence on page change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        presenceChannel.track({
          user_id: userId,
          status: 'away',
          current_page: window.location.pathname,
          last_seen: new Date().toISOString(),
        })
      } else {
        presenceChannel.track({
          user_id: userId,
          status: 'online',
          current_page: window.location.pathname,
          last_seen: new Date().toISOString(),
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      presenceChannel.unsubscribe()
    }
  }, [projectId, userId, supabase])

  const updateStatus = useCallback(
    async (status: 'online' | 'away' | 'busy' | 'offline') => {
      if (!channel || !userId) return

      await channel.track({
        user_id: userId,
        status,
        current_page: window.location.pathname,
        last_seen: new Date().toISOString(),
      })
    },
    [channel, userId]
  )

  const getOnlineUsers = useCallback(() => {
    return Object.entries(presenceState).flatMap(([key, presences]) =>
      presences.filter((p) => p.status === 'online')
    )
  }, [presenceState])

  const getUserStatus = useCallback(
    (userId: string) => {
      const presences = presenceState[userId]
      if (!presences || presences.length === 0) return 'offline'
      return presences[0].status
    },
    [presenceState]
  )

  return {
    presenceState,
    updateStatus,
    getOnlineUsers,
    getUserStatus,
  }
}

export default usePresence

