'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarProps } from './avatar'

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  users: Array<{
    id: string
    name: string
    avatar_url?: string
    status?: 'online' | 'away' | 'busy' | 'offline'
  }>
  max?: number
  size?: AvatarProps['size']
  showStatus?: boolean
}

export function AvatarStack({
  className,
  users,
  max = 4,
  size = 'sm',
  showStatus = false,
  ...props
}: AvatarStackProps) {
  const visibleUsers = users.slice(0, max)
  const remainingCount = users.length - max

  return (
    <div
      className={cn('flex -space-x-2', className)}
      {...props}
    >
      {visibleUsers.map((user, index) => (
        <Avatar
          key={user.id}
          src={user.avatar_url}
          alt={user.name}
          size={size}
          status={user.status}
          showStatus={showStatus}
          className={cn(
            'ring-2 ring-background transition-all duration-200 hover:z-10 hover:scale-110',
            'cursor-pointer'
          )}
          style={{ zIndex: visibleUsers.length - index }}
          title={user.name}
        />
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-full',
            'bg-muted ring-2 ring-background',
            'text-xs font-semibold text-muted-foreground',
            'cursor-pointer hover:bg-muted/80 transition-colors',
            size === 'xs' && 'h-6 w-6 text-[10px]',
            size === 'sm' && 'h-8 w-8 text-xs',
            size === 'md' && 'h-10 w-10 text-sm',
            size === 'lg' && 'h-12 w-12 text-base',
            size === 'xl' && 'h-16 w-16 text-lg'
          )}
          title={`+${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

export default AvatarStack

