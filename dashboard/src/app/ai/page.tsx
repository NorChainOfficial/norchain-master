'use client'

import { AISuggestions } from '@/components/ai/AISuggestions'
import { NaturalLanguagePlanner } from '@/components/ai/NaturalLanguagePlanner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Sparkles, Wand2, Brain, MessageSquare, BarChart3 } from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'

const aiFeatures = [
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: 'Chat with your AI PM about project planning and decisions',
    status: 'active',
  },
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    description: 'Get AI-powered recommendations for your project',
    status: 'active',
  },
  {
    icon: Wand2,
    title: 'Natural Language Planning',
    description: 'Describe features and let AI create the plan',
    status: 'active',
  },
  {
    icon: Brain,
    title: 'Auto Descriptions',
    description: 'Generate detailed descriptions for tasks and phases',
    status: 'active',
  },
  {
    icon: BarChart3,
    title: 'Project Analysis',
    description: 'Get SWOT analysis and insights for your project',
    status: 'beta',
  },
]

export default function AIPage() {
  const { currentProject } = useProject()

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered tools to help you manage your project
          </p>
        </div>
        {currentProject && (
          <Badge variant="outline" className="text-sm py-1.5 px-3">
            Project: {currentProject.name}
          </Badge>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {aiFeatures.map((feature) => (
          <Card key={feature.title} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    {feature.status === 'beta' && (
                      <Badge variant="secondary" className="text-xs">
                        Beta
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Suggestions */}
        <AISuggestions className="lg:col-span-1" />

        {/* Natural Language Planner */}
        <NaturalLanguagePlanner className="lg:col-span-1" />
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">How to use AI features</CardTitle>
          <CardDescription>
            Make the most of your AI Product Manager
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">1. Set your API key</h4>
            <p className="text-sm text-muted-foreground">
              Add ANTHROPIC_API_KEY to your .env.local file to enable AI features.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. Select a project</h4>
            <p className="text-sm text-muted-foreground">
              AI suggestions are context-aware based on your current project.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Use the chat assistant</h4>
            <p className="text-sm text-muted-foreground">
              Click the chat button in the bottom right for quick questions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

