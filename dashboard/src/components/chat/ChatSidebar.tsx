'use client'

import { useState, useEffect, useRef } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MessageSquare,
  X,
  Hash,
  Plus,
  Send,
  ChevronDown,
  Users,
  Settings,
  Smile,
  Paperclip,
} from 'lucide-react'

interface Channel {
  id: string
  name: string
  description: string
  type: 'public' | 'private' | 'direct'
}

interface Message {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
}

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { currentProject } = useProject()
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentProject?.id && isOpen) {
      fetchChannels()
    }
  }, [currentProject?.id, isOpen])

  useEffect(() => {
    if (activeChannel) {
      fetchMessages()
    }
  }, [activeChannel?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChannels = async () => {
    if (!currentProject?.id) return
    
    try {
      const response = await fetch(`/api/v1/chat?project_id=${currentProject.id}`)
      if (response.ok) {
        const data = await response.json()
        setChannels(data)
        if (data.length > 0 && !activeChannel) {
          setActiveChannel(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error)
    }
  }

  const fetchMessages = async () => {
    if (!activeChannel?.id) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/chat?channel_id=${activeChannel.id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel?.id) return

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: activeChannel.id,
          user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Demo user
          content: newMessage,
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages((prev) => [...prev, message])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className={cn(
        'fixed right-0 top-0 h-full w-96 bg-card border-l shadow-xl z-50',
        'transform transition-transform duration-300 ease-smooth',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="font-semibold">Chat</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-[calc(100%-4rem)]">
        {/* Channel List */}
        <div className="w-16 border-r bg-muted/30 flex flex-col items-center py-4 gap-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center',
                'transition-all duration-200',
                activeChannel?.id === channel.id
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-muted hover:bg-muted-foreground/10'
              )}
              title={channel.name}
            >
              <Hash className="h-5 w-5" />
            </button>
          ))}
          <button
            className="h-10 w-10 rounded-xl flex items-center justify-center bg-muted hover:bg-muted-foreground/10 transition-colors mt-auto"
            title="Add Channel"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeChannel ? (
            <>
              {/* Channel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{activeChannel.name}</span>
                  </div>
                  {activeChannel.description && (
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {activeChannel.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <Users className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const showAvatar =
                      index === 0 ||
                      messages[index - 1].user.id !== message.user.id
                    
                    return (
                      <div
                        key={message.id}
                        className={cn('flex gap-3', !showAvatar && 'ml-11')}
                      >
                        {showAvatar && (
                          <Avatar
                            src={message.user.avatar_url}
                            alt={message.user.name}
                            size="sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          {showAvatar && (
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium">
                                {message.user.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-foreground/90">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                  <button className="p-1.5 rounded-lg hover:bg-muted-foreground/10 transition-colors">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${activeChannel.name}`}
                    className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <button className="p-1.5 rounded-lg hover:bg-muted-foreground/10 transition-colors">
                    <Smile className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      newMessage.trim()
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Select a channel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar

