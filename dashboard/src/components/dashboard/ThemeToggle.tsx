'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/50">
        <div className="h-5 w-5 animate-pulse rounded bg-muted-foreground/20" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/50 hover:bg-muted transition-all duration-200 focus-ring"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center justify-between cursor-pointer py-3',
            theme === 'light' && 'bg-muted'
          )}
        >
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5" />
            <span className="text-base">Light</span>
          </div>
          {theme === 'light' && <Check className="h-5 w-5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center justify-between cursor-pointer py-3',
            theme === 'dark' && 'bg-muted'
          )}
        >
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5" />
            <span className="text-base">Dark</span>
          </div>
          {theme === 'dark' && <Check className="h-5 w-5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center justify-between cursor-pointer py-3',
            theme === 'system' && 'bg-muted'
          )}
        >
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5" />
            <span className="text-base">System</span>
          </div>
          {theme === 'system' && <Check className="h-5 w-5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
