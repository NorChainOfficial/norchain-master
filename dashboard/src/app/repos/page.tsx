'use client'

import * as React from 'react'
import { RepoGrid } from '@/components/dashboard/RepoGrid'
import { useRepositories } from '@/hooks/useRepositories'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GitBranch, Lock, Globe, AlertCircle, Star, Plus, Loader2, RefreshCw } from 'lucide-react'

const categoryOptions = [
  { value: 'core', label: 'Core Infrastructure' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'contracts', label: 'Smart Contracts' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'sdk', label: 'SDK / Developer Tools' },
  { value: 'docs', label: 'Documentation' },
]

const visibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
]

const techStackOptions = [
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Solidity', label: 'Solidity' },
  { value: 'Swift', label: 'Swift' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'React', label: 'React' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'NestJS', label: 'NestJS' },
]

export default function ReposPage() {
  const { repositories, stats, isLoading, refetch } = useRepositories()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [newRepo, setNewRepo] = React.useState({
    name: '',
    description: '',
    category: 'core',
    visibility: 'public',
    tech_stack: [] as string[],
  })

  const categories = Array.from(new Set(repositories.map((r) => r.category)))

  const handleCreateRepo = async () => {
    if (!newRepo.name.trim()) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/v1/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRepo.name.trim(),
          slug: newRepo.name.toLowerCase().replace(/\s+/g, '-'),
          description: newRepo.description.trim(),
          category: newRepo.category,
          visibility: newRepo.visibility,
          tech_stack: newRepo.tech_stack,
          github_url: `https://github.com/NorChainOfficial/${newRepo.name.toLowerCase().replace(/\s+/g, '-')}`,
        }),
      })
      
      if (response.ok) {
        setDialogOpen(false)
        setNewRepo({ name: '', description: '', category: 'core', visibility: 'public', tech_stack: [] })
        refetch()
      } else {
        const error = await response.json()
        alert(`Failed to create repository: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating repository:', error)
      alert('Failed to create repository. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTechStack = (tech: string) => {
    setNewRepo(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(tech)
        ? prev.tech_stack.filter(t => t !== tech)
        : [...prev.tech_stack, tech]
    }))
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Repositories</h1>
          <p className="text-muted-foreground text-lg">
            All repositories in the NorChainOfficial organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-base px-4 py-1.5">
            <GitBranch className="h-4 w-4 mr-2" />
            {repositories.length} repositories
          </Badge>
          <Button variant="outline" size="lg" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="lg" onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Repository
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-xl">
                <Globe className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.public}</p>
                <p className="text-sm text-muted-foreground">Public</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-warning/10 p-3 rounded-xl">
                <Lock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.private}</p>
                <p className="text-sm text-muted-foreground">Private</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold">10</p>
                <p className="text-sm text-muted-foreground">Phases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repository Grid */}
      <RepoGrid />

      {/* Add Repository Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-start gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg">
                <GitBranch className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 pt-1">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-2xl font-bold">Add Repository</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Track a new repository in the NorChain organization
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="repo-name" className="text-sm font-semibold">
                Repository Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="repo-name"
                value={newRepo.name}
                onChange={(e) => setNewRepo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="norchain-new-service"
                className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo-desc" className="text-sm font-semibold">Description</Label>
              <Input
                id="repo-desc"
                value={newRepo.description}
                onChange={(e) => setNewRepo(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the repository"
                className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Category</Label>
                <Select
                  value={newRepo.category}
                  onValueChange={(value) => setNewRepo(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Visibility</Label>
                <Select
                  value={newRepo.visibility}
                  onValueChange={(value) => setNewRepo(prev => ({ ...prev, visibility: value }))}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityOptions.map((vis) => (
                      <SelectItem key={vis.value} value={vis.value}>
                        <div className="flex items-center gap-2">
                          {vis.value === 'public' ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          {vis.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Tech Stack</Label>
              <div className="flex flex-wrap gap-2">
                {techStackOptions.map((tech) => (
                  <button
                    key={tech.value}
                    type="button"
                    onClick={() => toggleTechStack(tech.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      newRepo.tech_stack.includes(tech.value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {tech.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="px-8 py-5 bg-muted/30 border-t gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRepo}
              disabled={!newRepo.name.trim() || isSubmitting}
              className="h-11 px-6 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Repository
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
