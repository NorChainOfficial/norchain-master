'use client'

import * as React from 'react'
import { usePhases } from '@/hooks/usePhases'
import { PhaseCard } from '@/components/dashboard/PhaseCard'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Loader2, RefreshCw, Layers, Edit2 } from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'complete', label: 'Complete' },
]

export default function PhasesPage() {
  const { phases, currentPhase, overallProgress, completedPhases, totalPhases, refetch } = usePhases()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedPhase, setSelectedPhase] = React.useState<typeof phases[0] | null>(null)
  const [newPhase, setNewPhase] = React.useState({
    name: '',
    focus: '',
    duration: '2 months',
    status: 'pending',
  })

  const handleCreatePhase = async () => {
    if (!newPhase.name.trim()) return
    
    setIsSubmitting(true)
    try {
      const nextId = phases.length > 0 ? Math.max(...phases.map(p => p.id)) + 1 : 1
      const response = await fetch('/api/v1/phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: nextId,
          name: newPhase.name.trim(),
          focus: newPhase.focus.trim(),
          duration: newPhase.duration,
          status: newPhase.status,
          progress: 0,
        }),
      })
      
      if (response.ok) {
        setDialogOpen(false)
        setNewPhase({ name: '', focus: '', duration: '2 months', status: 'pending' })
        refetch()
      } else {
        const error = await response.json()
        alert(`Failed to create phase: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating phase:', error)
      alert('Failed to create phase. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditPhase = async () => {
    if (!selectedPhase) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/v1/phases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPhase.id,
          name: selectedPhase.name,
          focus: selectedPhase.focus,
          duration: selectedPhase.duration,
          status: selectedPhase.status,
          progress: selectedPhase.progress,
        }),
      })
      
      if (response.ok) {
        setEditDialogOpen(false)
        setSelectedPhase(null)
        refetch()
      } else {
        const error = await response.json()
        alert(`Failed to update phase: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating phase:', error)
      alert('Failed to update phase. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (phase: typeof phases[0]) => {
    setSelectedPhase({ ...phase })
    setEditDialogOpen(true)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Development Phases</h1>
          <p className="text-muted-foreground text-lg">
            Track progress across all {totalPhases} development phases
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="active" className="text-base px-4 py-1.5">
            Phase {currentPhase.id}: {currentPhase.name}
          </Badge>
          <Button variant="outline" size="lg" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="lg" onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Phase
          </Button>
        </div>
      </div>

      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Overall Progress</h2>
              <p className="text-base text-muted-foreground">
                {completedPhases} of {totalPhases} phases completed
              </p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-bold text-primary">
                {overallProgress}%
              </span>
            </div>
          </div>
          <Progress
            value={overallProgress}
            className="h-3"
            indicatorClassName="bg-primary"
          />
        </CardContent>
      </Card>

      {/* Phase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {phases.map((phase) => (
          <div key={phase.id} className="relative group">
            <PhaseCard
              phase={phase}
              isActive={phase.id === currentPhase.id}
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              onClick={() => openEditDialog(phase)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Current Phase Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Phase {currentPhase.id}: {currentPhase.name}
          </CardTitle>
          <p className="text-base text-muted-foreground">{currentPhase.focus}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-base">
                  <span>Current</span>
                  <span className="font-semibold">{currentPhase.progress}%</span>
                </div>
                <Progress
                  value={currentPhase.progress}
                  className="h-2.5"
                  indicatorClassName="bg-primary"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Duration: {currentPhase.duration}
                </p>
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Deliverables</h3>
              <div className="space-y-2">
                {currentPhase.deliverables.map((deliverable) => (
                  <div
                    key={deliverable.name}
                    className="flex items-center justify-between rounded-xl border px-4 py-3"
                  >
                    <span className="text-base">{deliverable.name}</span>
                    <Badge
                      variant={
                        deliverable.status === 'complete'
                          ? 'success'
                          : deliverable.status === 'in_progress'
                            ? 'active'
                            : 'pending'
                      }
                    >
                      {deliverable.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Phase Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-start gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg">
                <Layers className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 pt-1">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-2xl font-bold">Add New Phase</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Create a new development phase
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phase-name" className="text-sm font-semibold">
                Phase Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phase-name"
                value={newPhase.name}
                onChange={(e) => setNewPhase(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Smart Contract Development"
                className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase-focus" className="text-sm font-semibold">Focus</Label>
              <Input
                id="phase-focus"
                value={newPhase.focus}
                onChange={(e) => setNewPhase(prev => ({ ...prev, focus: e.target.value }))}
                placeholder="Token & governance contracts"
                className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Duration</Label>
                <Input
                  value={newPhase.duration}
                  onChange={(e) => setNewPhase(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="2 months"
                  className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Status</Label>
                <Select
                  value={newPhase.status}
                  onValueChange={(value) => setNewPhase(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              onClick={handleCreatePhase}
              disabled={!newPhase.name.trim() || isSubmitting}
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
                  Create Phase
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Phase Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
            <div className="flex items-start gap-5">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shadow-lg">
                <Edit2 className="h-7 w-7 text-amber-500" />
              </div>
              <div className="flex-1 pt-1">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-2xl font-bold">Edit Phase</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Update phase details and progress
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          {selectedPhase && (
            <div className="px-8 py-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Phase Name</Label>
                <Input
                  value={selectedPhase.name}
                  onChange={(e) => setSelectedPhase(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Focus</Label>
                <Input
                  value={selectedPhase.focus}
                  onChange={(e) => setSelectedPhase(prev => prev ? { ...prev, focus: e.target.value } : null)}
                  className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedPhase.progress}
                    onChange={(e) => setSelectedPhase(prev => prev ? { ...prev, progress: parseInt(e.target.value) || 0 } : null)}
                    className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Status</Label>
                  <Select
                    value={selectedPhase.status}
                    onValueChange={(value) => setSelectedPhase(prev => prev ? { ...prev, status: value } : null)}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-8 py-5 bg-muted/30 border-t gap-3">
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditPhase}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
