'use client'

import * as React from 'react'
import { useState } from 'react'
import { 
  Sparkles, 
  Loader2, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Shield,
  Zap,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProject } from '@/contexts/ProjectContext'
import type { Recommendation } from '@/lib/ai/claude'

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  task: Target,
  phase: Sparkles,
  risk: AlertTriangle,
  optimization: Zap,
  compliance: Shield,
  security: Shield,
}

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
}

interface AISuggestionsProps {
  className?: string
}

export function AISuggestions({ className }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const { currentProject } = useProject()

  const fetchSuggestions = async () => {
    if (!currentProject) {
      setError('Please select a project first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectContext: {
            name: currentProject.name,
            description: currentProject.description,
            aiContext: currentProject.ai_context,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get recommendations')
      }

      const data = await response.json()
      setSuggestions(data.recommendations || [])
    } catch (err) {
      console.error('Failed to fetch suggestions:', err)
      setError('Failed to load AI suggestions. Make sure ANTHROPIC_API_KEY is configured.')
    } finally {
      setIsLoading(false)
    }
  }

  const dismissSuggestion = (id: string) => {
    setDismissedIds((prev) => new Set(Array.from(prev).concat(id)))
  }

  const acceptSuggestion = async (suggestion: Recommendation) => {
    // TODO: Implement accepting suggestions (create tasks, phases, etc.)
    console.log('Accepting suggestion:', suggestion)
    dismissSuggestion(suggestion.id)
  }

  const visibleSuggestions = suggestions.filter((s) => !dismissedIds.has(s.id))

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Suggestions
          </CardTitle>
          <CardDescription>
            Smart recommendations for your project
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSuggestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {suggestions.length > 0 ? 'Refresh' : 'Get Suggestions'}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mb-4">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing your project...</p>
          </div>
        ) : visibleSuggestions.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {visibleSuggestions.map((suggestion) => {
                const IconComponent = typeIcons[suggestion.type] || Sparkles
                return (
                  <div
                    key={suggestion.id}
                    className="p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {suggestion.title}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn('capitalize text-xs', priorityColors[suggestion.priority])}
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {suggestion.description}
                        </p>
                        {suggestion.reasoning && (
                          <p className="text-xs text-muted-foreground/70 italic line-clamp-1">
                            {suggestion.reasoning}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="default"
                            className="h-8"
                            onClick={() => acceptSuggestion(suggestion)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            onClick={() => dismissSuggestion(suggestion.id)}
                          >
                            Dismiss
                          </Button>
                          {suggestion.confidence && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {Math.round(suggestion.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">No suggestions yet</h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Click &quot;Get Suggestions&quot; to get AI-powered recommendations for your project.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-medium mb-1">All caught up!</h3>
            <p className="text-sm text-muted-foreground">
              You&apos;ve reviewed all suggestions.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchSuggestions}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Get New Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

