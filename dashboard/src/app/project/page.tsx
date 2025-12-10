'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  FileText,
  Map,
  Code,
  Shield,
  Sparkles,
  Save,
  Wand2,
  ChevronRight,
  Target,
  Layers,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Eye,
  Edit3,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Hash,
  ArrowRight,
  Clock,
  Zap,
  FileCode,
  ListChecks,
} from 'lucide-react'

interface DocumentSection {
  id: string
  title: string
  shortTitle: string
  icon: React.ElementType
  description: string
  placeholder: string
  color: string
}

const documentSections: DocumentSection[] = [
  {
    id: 'description',
    title: 'Project Description',
    shortTitle: 'Description',
    icon: BookOpen,
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    description: 'High-level overview of the project, its goals, and vision',
    placeholder: `# Project Overview

## Vision
Describe the project vision and long-term goals...

## Target Audience
Who are the primary users?

## Key Value Propositions
What makes this project unique?

## Success Metrics
How will success be measured?`,
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    shortTitle: 'Roadmap',
    icon: Map,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    description: 'Project timeline with milestones and deliverables',
    placeholder: `# Project Roadmap

## Phase 1: Foundation (Q1 2025)
- Milestone 1.1: Core infrastructure
- Milestone 1.2: Basic features
- Deliverable: MVP release

## Phase 2: Growth (Q2 2025)
- Milestone 2.1: Advanced features
- Milestone 2.2: Integrations
- Deliverable: v1.0 release

## Phase 3: Scale (Q3-Q4 2025)
- Milestone 3.1: Performance optimization
- Milestone 3.2: Enterprise features
- Deliverable: Enterprise release`,
  },
  {
    id: 'prd',
    title: 'PRD (Product Requirements)',
    shortTitle: 'PRD',
    icon: Target,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    description: 'Product requirements document with features and user stories',
    placeholder: `# Product Requirements Document

## Executive Summary
Brief overview of the product and its purpose.

## User Stories
### As a user, I want to...
- US-001: [User Story]
  - Acceptance Criteria:
  - Priority: High/Medium/Low

## Feature Requirements
### Feature 1: [Name]
- Description:
- User Impact:
- Technical Considerations:

## Non-Functional Requirements
- Performance:
- Security:
- Scalability:`,
  },
  {
    id: 'srsd',
    title: 'SRSD (Software Requirements)',
    shortTitle: 'SRSD',
    icon: FileText,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    description: 'Software requirements specification with technical details',
    placeholder: `# Software Requirements Specification Document

## 1. Introduction
### 1.1 Purpose
### 1.2 Scope
### 1.3 Definitions

## 2. System Overview
### 2.1 System Context
### 2.2 System Functions
### 2.3 User Characteristics

## 3. Functional Requirements
### FR-001: [Requirement Name]
- Description:
- Input:
- Output:
- Dependencies:

## 4. Non-Functional Requirements
### 4.1 Performance Requirements
### 4.2 Security Requirements
### 4.3 Availability Requirements

## 5. Interface Requirements
### 5.1 User Interfaces
### 5.2 API Interfaces
### 5.3 External Interfaces`,
  },
  {
    id: 'specifications',
    title: 'Technical Specifications',
    shortTitle: 'Tech Specs',
    icon: Code,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    description: 'Detailed technical specs, API contracts, and data models',
    placeholder: `# Technical Specifications

## API Contracts
### Endpoint: POST /api/v1/example
\`\`\`json
{
  "request": { },
  "response": { }
}
\`\`\`

## Data Models
### Entity: User
\`\`\`typescript
interface User {
  id: string;
  email: string;
  // ...
}
\`\`\`

## Database Schema
### Table: users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |

## Integration Points
- External Service 1:
- External Service 2:`,
  },
  {
    id: 'architecture',
    title: 'Architecture',
    shortTitle: 'Architecture',
    icon: Layers,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    description: 'System architecture, infrastructure, and component diagrams',
    placeholder: `# System Architecture

## High-Level Architecture
Describe the overall system architecture...

## Component Diagram
\`\`\`
┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │
└─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Database   │
                    └─────────────┘
\`\`\`

## Technology Stack
- Frontend:
- Backend:
- Database:
- Infrastructure:

## Deployment Architecture
Describe the deployment strategy...

## Security Architecture
Describe security measures...`,
  },
]

export default function ProjectPage() {
  const { currentProject } = useProject()
  const [activeTab, setActiveTab] = useState('description')
  const [documents, setDocuments] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [generating, setGenerating] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalDocuments, setOriginalDocuments] = useState<Record<string, string>>({})

  // Fetch project documents on load
  useEffect(() => {
    if (currentProject?.id) {
      fetchDocuments()
    } else {
      setLoading(false)
    }
  }, [currentProject?.id])

  // Track changes
  useEffect(() => {
    const currentContent = documents[activeTab] || ''
    const originalContent = originalDocuments[activeTab] || ''
    setHasChanges(currentContent !== originalContent)
  }, [documents, activeTab, originalDocuments])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave(activeTab)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        setViewMode(v => v === 'edit' ? 'preview' : 'edit')
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, isFullscreen])

  const fetchDocuments = async () => {
    if (!currentProject?.id) return

    setLoading(true)
    try {
      const response = await fetch(`/api/v1/projects/${currentProject.id}/documents`)
      if (response.ok) {
        const data = await response.json()
        const docs = {
          description: data.project?.description || '',
          roadmap: data.project?.roadmap || '',
          prd: data.project?.prd || '',
          srsd: data.project?.srsd || '',
          specifications: data.project?.specifications || '',
          architecture: data.project?.architecture || '',
        }
        setDocuments(docs)
        setOriginalDocuments(docs)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (sectionId: string) => {
    if (!currentProject?.id) return

    setSaving(true)
    setSaveStatus('idle')
    try {
      const response = await fetch(`/api/v1/projects/${currentProject.id}/documents`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: sectionId,
          content: documents[sectionId],
        }),
      })

      if (response.ok) {
        setSaveStatus('success')
        setLastSaved(new Date())
        setOriginalDocuments(prev => ({ ...prev, [sectionId]: documents[sectionId] }))
        setHasChanges(false)
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleAIGenerate = async (sectionId: string) => {
    setGenerating(sectionId)
    try {
      const response = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: sectionId,
          projectName: currentProject?.name || 'Project',
          projectDescription: documents.description,
          existingContent: documents[sectionId],
          context: {
            roadmap: documents.roadmap,
            prd: documents.prd,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          setDocuments(prev => ({
            ...prev,
            [sectionId]: data.content,
          }))
        }
      }
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setGenerating(null)
    }
  }

  const handleCopyContent = useCallback(async (sectionId: string) => {
    const content = documents[sectionId]
    if (content) {
      await navigator.clipboard.writeText(content)
      setCopiedSection(sectionId)
      setTimeout(() => setCopiedSection(null), 2000)
    }
  }, [documents])

  const handleExtractTasks = async () => {
    // TODO: Implement task extraction from documents
    console.log('Extract tasks from documents')
  }

  const handleGeneratePhases = async () => {
    // TODO: Implement phase generation from roadmap
    console.log('Generate phases from roadmap')
  }

  const activeSection = documentSections.find(s => s.id === activeTab)

  const stats = useMemo(() => {
    const completed = documentSections.filter(s => (documents[s.id]?.trim().length || 0) > 50).length
    const wordCount = Object.values(documents).reduce((acc, doc) => acc + (doc?.split(/\s+/).filter(Boolean).length || 0), 0)
    const charCount = Object.values(documents).reduce((acc, doc) => acc + (doc?.length || 0), 0)
    return {
      completed,
      total: documentSections.length,
      percentage: Math.round((completed / documentSections.length) * 100),
      wordCount,
      charCount,
    }
  }, [documents])

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border">
            <FolderKanban className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Project Selected</h2>
          <p className="text-muted-foreground max-w-md">
            Select a project from the dropdown in the navbar to view and edit its documentation.
          </p>
        </div>
        <Button variant="outline" size="lg" className="mt-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col gap-6 p-6 min-h-full transition-all duration-300",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border">
            <FolderKanban className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Project Documentation</h1>
              <Badge variant="secondary" className="font-semibold">
                {currentProject.name}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1.5">
                <ListChecks className="h-4 w-4" />
                {stats.completed}/{stats.total} sections
              </span>
              <span className="flex items-center gap-1.5">
                <FileCode className="h-4 w-4" />
                {stats.wordCount.toLocaleString()} words
              </span>
              {lastSaved && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Saved {formatRelativeTime(lastSaved)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExtractTasks}
            className="hidden md:flex"
          >
            <Target className="h-4 w-4 mr-2" />
            Extract Tasks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeneratePhases}
            className="hidden md:flex"
          >
            <Layers className="h-4 w-4 mr-2" />
            Generate Phases
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="shrink-0">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Documentation Progress</span>
          <span className="font-semibold text-primary">{stats.percentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Document Navigation - Horizontal Scroll */}
      <div className="shrink-0 -mx-6 px-6">
        <ScrollArea className="pb-2">
          <div className="flex gap-2 min-w-max">
            {documentSections.map((section, index) => {
              const hasContent = (documents[section.id]?.trim().length || 0) > 50
              const isActive = activeTab === section.id
              const Icon = section.icon

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={cn(
                    "group relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200",
                    "hover:shadow-md hover:-translate-y-0.5",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : hasContent
                      ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-muted/50 hover:bg-muted border-transparent"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-foreground/20"
                      : hasContent
                      ? "bg-emerald-500/20"
                      : "bg-background"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive
                        ? "text-primary-foreground"
                        : hasContent
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-left">
                    <p className={cn(
                      "text-sm font-medium whitespace-nowrap",
                      !isActive && !hasContent && "text-muted-foreground"
                    )}>
                      {section.shortTitle}
                    </p>
                    {hasContent && !isActive && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Complete
                      </p>
                    )}
                    {!hasContent && !isActive && (
                      <p className="text-[10px] text-muted-foreground">
                        Empty
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Document Editor */}
        <Card className={cn(
          "flex-1 flex flex-col min-h-[500px] transition-all duration-300",
          isFullscreen && "shadow-2xl"
        )}>
          <CardHeader className="pb-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeSection && (
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border",
                    activeSection.color
                  )}>
                    <activeSection.icon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {activeSection?.title}
                    {hasChanges && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </CardTitle>
                  <CardDescription>{activeSection?.description}</CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center rounded-lg bg-muted p-0.5">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      viewMode === 'edit'
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      viewMode === 'preview'
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                </div>

                {/* Copy Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyContent(activeTab)}
                  disabled={!documents[activeTab]}
                  className="h-9 w-9 p-0"
                >
                  {copiedSection === activeTab ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                {/* Fullscreen Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(f => !f)}
                  className="h-9 w-9 p-0"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* AI Generate */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIGenerate(activeTab)}
                  disabled={generating === activeTab}
                  className="gap-2"
                >
                  {generating === activeTab ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {generating === activeTab ? 'Generating...' : 'AI Generate'}
                </Button>

                {/* Save Button */}
                <Button
                  size="sm"
                  onClick={() => handleSave(activeTab)}
                  disabled={saving || !hasChanges}
                  className={cn(
                    "min-w-[100px] gap-2 transition-all",
                    saveStatus === 'success' && "bg-emerald-500 hover:bg-emerald-600"
                  )}
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : saveStatus === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : saveStatus === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading documents...</p>
                </div>
              </div>
            ) : viewMode === 'edit' ? (
              <Textarea
                className={cn(
                  "flex-1 min-h-full resize-none font-mono text-sm leading-relaxed border-0 rounded-none",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "p-4"
                )}
                placeholder={activeSection?.placeholder}
                value={documents[activeTab] || ''}
                onChange={(e) => setDocuments(prev => ({
                  ...prev,
                  [activeTab]: e.target.value,
                }))}
              />
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownPreview content={documents[activeTab] || activeSection?.placeholder || ''} />
                </div>
              </ScrollArea>
            )}
          </CardContent>

          {/* Editor Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{(documents[activeTab]?.length || 0).toLocaleString()} characters</span>
              <span>{(documents[activeTab]?.split(/\s+/).filter(Boolean).length || 0).toLocaleString()} words</span>
              <span>{(documents[activeTab]?.split('\n').length || 0).toLocaleString()} lines</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">⌘S</kbd>
              <span>Save</span>
              <span className="mx-2">•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">⌘E</kbd>
              <span>Toggle Preview</span>
            </div>
          </div>
        </Card>

        {/* AI Suggestions Panel */}
        {!isFullscreen && (
          <Card className="w-80 shrink-0 hidden xl:flex flex-col">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription>
                AI-powered tools to help you write
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 gap-3">
              {/* Generate Content */}
              <ActionButton
                icon={Wand2}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                title="Generate Content"
                description={`Create ${activeSection?.shortTitle.toLowerCase()}`}
                onClick={() => handleAIGenerate(activeTab)}
                disabled={generating !== null}
                loading={generating === activeTab}
              />

              {/* Improve Content */}
              <ActionButton
                icon={Sparkles}
                iconBg="bg-amber-500/10"
                iconColor="text-amber-500"
                title="Improve Content"
                description="Enhance with more details"
                onClick={() => {}}
              />

              {/* Extract Tasks */}
              <ActionButton
                icon={Target}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-500"
                title="Extract Tasks"
                description="Create tasks from this document"
                onClick={handleExtractTasks}
              />

              {/* Generate Phases */}
              <ActionButton
                icon={Layers}
                iconBg="bg-blue-500/10"
                iconColor="text-blue-500"
                title="Generate Phases"
                description="Create phases from roadmap"
                onClick={handleGeneratePhases}
              />

              {/* Quick Templates */}
              <div className="mt-auto pt-4 border-t space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Quick Tips</p>
                <div className="text-xs text-muted-foreground p-3 rounded-xl bg-muted/50 space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Use Markdown formatting for better structure
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    AI Generate works best with existing context
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Extract tasks once docs are complete
                  </p>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Shield className="h-4 w-4" />
                  Check Compliance
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Action Button Component
function ActionButton({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  onClick,
  disabled,
  loading,
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
        "border border-transparent hover:border-border",
        "hover:bg-muted/50 hover:shadow-sm",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", iconBg)}>
        {loading ? (
          <RefreshCw className={cn("h-5 w-5 animate-spin", iconColor)} />
        ) : (
          <Icon className={cn("h-5 w-5", iconColor)} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

// Simple Markdown Preview (basic parsing)
function MarkdownPreview({ content }: { content: string }) {
  const html = useMemo(() => {
    return content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-muted overflow-x-auto my-4"><code>$2</code></pre>')
      .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm">$1</code>')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="my-4">')
      .replace(/\n/g, '<br />')
  }, [content])

  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  )
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
