'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface TagBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string
  label: string
  removable?: boolean
  onRemove?: () => void
  size?: 'sm' | 'md' | 'lg'
}

// Predefined color mappings for common tag colors
const colorVariants: Record<string, string> = {
  '#ef4444': 'bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25',
  '#f97316': 'bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/25',
  '#f59e0b': 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25',
  '#eab308': 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/25',
  '#84cc16': 'bg-lime-500/15 text-lime-600 dark:text-lime-400 hover:bg-lime-500/25',
  '#22c55e': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25',
  '#14b8a6': 'bg-teal-500/15 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25',
  '#06b6d4': 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/25',
  '#0ea5e9': 'bg-sky-500/15 text-sky-600 dark:text-sky-400 hover:bg-sky-500/25',
  '#3b82f6': 'bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25',
  '#6366f1': 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/25',
  '#8b5cf6': 'bg-violet-500/15 text-violet-600 dark:text-violet-400 hover:bg-violet-500/25',
  '#a855f7': 'bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-500/25',
  '#d946ef': 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-500/25',
  '#ec4899': 'bg-pink-500/15 text-pink-600 dark:text-pink-400 hover:bg-pink-500/25',
  '#f43f5e': 'bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25',
}

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1.5',
  lg: 'px-2.5 py-1 text-sm gap-2',
}

export function TagBadge({
  className,
  color = '#6366f1',
  label,
  removable = false,
  onRemove,
  size = 'md',
  ...props
}: TagBadgeProps) {
  const colorClass = colorVariants[color] || 'bg-muted text-muted-foreground hover:bg-muted/80'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        'transition-all duration-200 cursor-default',
        colorClass,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className={cn(
            'rounded-full p-0.5 -mr-0.5',
            'hover:bg-black/10 dark:hover:bg-white/10',
            'transition-colors duration-150'
          )}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}

export default TagBadge

