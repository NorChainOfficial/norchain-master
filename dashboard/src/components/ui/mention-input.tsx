'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar } from './avatar'

interface User {
  id: string
  name: string
  email?: string
  avatar_url?: string
}

export interface MentionInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  users?: User[]
  value?: string
  onChange?: (value: string) => void
  onMention?: (user: User) => void
}

export function MentionInput({
  className,
  users = [],
  value = '',
  onChange,
  onMention,
  placeholder = 'Type a message...',
  ...props
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [mentionQuery, setMentionQuery] = React.useState('')
  const [mentionStart, setMentionStart] = React.useState(-1)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)

  const filteredUsers = React.useMemo(() => {
    if (!mentionQuery) return users.slice(0, 5)
    const query = mentionQuery.toLowerCase()
    return users
      .filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email?.toLowerCase().includes(query)
      )
      .slice(0, 5)
  }, [users, mentionQuery])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart || 0
    
    onChange?.(newValue)
    
    // Check for @ mention trigger
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      // Only show suggestions if there's no space after @ (active mention)
      if (!textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex)
        setMentionQuery(textAfterAt)
        setShowSuggestions(true)
        setSelectedIndex(0)
        return
      }
    }
    
    setShowSuggestions(false)
    setMentionStart(-1)
    setMentionQuery('')
  }

  const insertMention = (user: User) => {
    if (mentionStart === -1) return
    
    const before = value.slice(0, mentionStart)
    const after = value.slice(mentionStart + mentionQuery.length + 1)
    const newValue = `${before}@${user.name} ${after}`
    
    onChange?.(newValue)
    onMention?.(user)
    setShowSuggestions(false)
    setMentionStart(-1)
    setMentionQuery('')
    
    // Focus back to textarea
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filteredUsers.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        if (filteredUsers[selectedIndex]) {
          e.preventDefault()
          insertMention(filteredUsers[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full min-h-[80px] px-4 py-3 rounded-xl resize-none',
          'bg-muted/50 border border-transparent',
          'text-foreground placeholder:text-muted-foreground',
          'transition-all duration-200 ease-smooth',
          'focus:outline-none focus:bg-background focus:border-primary/50',
          'focus:ring-2 focus:ring-primary/20',
          className
        )}
        {...props}
      />
      
      {/* Mention Suggestions Dropdown */}
      {showSuggestions && filteredUsers.length > 0 && (
        <div
          ref={suggestionsRef}
          className={cn(
            'absolute left-0 right-0 top-full mt-1 z-50',
            'bg-popover border border-border rounded-xl shadow-lg',
            'overflow-hidden animate-slide-up'
          )}
        >
          {filteredUsers.map((user, index) => (
            <button
              key={user.id}
              type="button"
              onClick={() => insertMention(user)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-left',
                'transition-colors duration-150',
                index === selectedIndex 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted'
              )}
            >
              <Avatar
                src={user.avatar_url}
                alt={user.name}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MentionInput

