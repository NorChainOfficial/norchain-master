'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Pencil,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
  ListTodo,
  Layers,
  GitBranch,
  Shield,
  RefreshCw,
} from 'lucide-react'

// Types
interface Task {
  id: string
  title: string
  role: string
  phase_id: number
  priority: string
  complexity: string
  status: string
}

interface Phase {
  id: number
  name: string
  focus: string
  duration: string
  status: string
  progress: number
}

interface Repository {
  id: string
  name: string
  description: string
  url: string
  visibility: string
  category: string
  phase_id: number
}

interface ComplianceItem {
  id: string
  category: string
  item: string
  status: string
  required: boolean
}

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState('tasks')
  const queryClient = useQueryClient()

  // Fetch data
  const { data: tasks = [], refetch: refetchTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/v1/tasks')
      return res.json()
    },
  })

  const { data: phases = [], refetch: refetchPhases, isLoading: phasesLoading } = useQuery({
    queryKey: ['phases'],
    queryFn: async () => {
      const res = await fetch('/api/v1/phases')
      return res.json()
    },
  })

  const { data: repos = [], refetch: refetchRepos, isLoading: reposLoading } = useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      const res = await fetch('/api/v1/repositories')
      return res.json()
    },
  })

  const { data: complianceData, refetch: refetchCompliance, isLoading: complianceLoading } = useQuery({
    queryKey: ['compliance'],
    queryFn: async () => {
      const res = await fetch('/api/v1/compliance')
      return res.json()
    },
  })

  const compliance = complianceData?.checklist || []

  const refreshAll = () => {
    refetchTasks()
    refetchPhases()
    refetchRepos()
    refetchCompliance()
  }

  return (
    <div className="flex flex-col h-full p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Content Manager</h1>
          <p className="text-muted-foreground text-lg">
            Add, edit, and delete tasks, phases, repositories, and compliance items
          </p>
        </div>
        <button
          onClick={refreshAll}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border hover:bg-muted transition-colors text-base font-medium"
        >
          <RefreshCw className="h-5 w-5" />
          Refresh
        </button>
      </div>

      {/* Tabs - Flex grow */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 shrink-0">
          <TabsTrigger value="tasks" className="flex items-center gap-2 py-3">
            <ListTodo className="h-5 w-5" />
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="phases" className="flex items-center gap-2 py-3">
            <Layers className="h-5 w-5" />
            Phases ({phases.length})
          </TabsTrigger>
          <TabsTrigger value="repos" className="flex items-center gap-2 py-3">
            <GitBranch className="h-5 w-5" />
            Repos ({repos.length})
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2 py-3">
            <Shield className="h-5 w-5" />
            Compliance ({compliance.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6 flex-1 min-h-0">
          <TasksManager tasks={tasks} onRefresh={refetchTasks} isLoading={tasksLoading} />
        </TabsContent>

        <TabsContent value="phases" className="mt-6 flex-1 min-h-0 overflow-auto">
          <PhasesManager phases={phases} onRefresh={refetchPhases} isLoading={phasesLoading} />
        </TabsContent>

        <TabsContent value="repos" className="mt-6 flex-1 min-h-0">
          <ReposManager repos={repos} onRefresh={refetchRepos} isLoading={reposLoading} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6 flex-1 min-h-0 overflow-auto">
          <ComplianceManager items={compliance} onRefresh={refetchCompliance} isLoading={complianceLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ============================================
// TASKS MANAGER
// ============================================
function TasksManager({ tasks, onRefresh, isLoading }: { tasks: Task[]; onRefresh: () => void; isLoading: boolean }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<Task | null>(null)
  const [bulkStatus, setBulkStatus] = useState('')

  const addMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const res = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: () => { onRefresh(); setIsAddOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: string }) => {
      const res = await fetch(`/api/v1/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: () => { onRefresh(); setEditItem(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/v1/tasks/${id}`, { method: 'DELETE' })
    },
    onSuccess: onRefresh,
  })

  const bulkMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      if (status === 'delete') {
        await Promise.all(ids.map(id => fetch(`/api/v1/tasks/${id}`, { method: 'DELETE' })))
      } else {
        await Promise.all(ids.map(id => 
          fetch(`/api/v1/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          })
        ))
      }
    },
    onSuccess: () => { onRefresh(); setSelected(new Set()); setBulkStatus('') },
  })

  const toggleAll = () => {
    setSelected(selected.size === tasks.length ? new Set() : new Set(tasks.map(t => t.id)))
  }

  if (isLoading) return <LoadingState />

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Tasks</CardTitle>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90">
            <Plus className="h-5 w-5" /> Add Task
          </button>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-4 mt-4 p-4 bg-muted rounded-xl">
            <span className="font-semibold">{selected.size} selected</span>
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Action..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">→ Backlog</SelectItem>
                <SelectItem value="in_progress">→ In Progress</SelectItem>
                <SelectItem value="review">→ Review</SelectItem>
                <SelectItem value="done">→ Done</SelectItem>
                <SelectItem value="delete">🗑️ Delete</SelectItem>
              </SelectContent>
            </Select>
            <button onClick={() => bulkMutation.mutate({ ids: Array.from(selected), status: bulkStatus })} disabled={!bulkStatus} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
              Apply
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="text-left border-b-2">
                <th className="p-4 w-14">
                  <button 
                    onClick={toggleAll}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    {selected.size === tasks.length ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                  </button>
                </th>
                <th className="p-4 w-28 text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="p-4 w-36 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="p-4 w-24 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Phase</th>
                <th className="p-4 w-60 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-4 w-28 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => {
                // Handle both phase_id and phase field names
                const phaseNumber = task.phase_id ?? (task as any).phase ?? '-'
                return (
                  <tr 
                    key={task.id} 
                    className={cn(
                      'transition-all duration-150 group',
                      'hover:bg-muted/50',
                      selected.has(task.id) && 'bg-primary/5 hover:bg-primary/10'
                    )}
                  >
                    <td className="p-4">
                      <button 
                        onClick={() => setSelected(s => { const n = new Set(s); n.has(task.id) ? n.delete(task.id) : n.add(task.id); return n })}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        {selected.has(task.id) ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <code className="px-2.5 py-1.5 rounded-lg bg-muted font-mono text-sm">{task.id}</code>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-base">{task.title}</span>
                    </td>
                    <td className="p-4">
                      <RoleBadge role={task.role} />
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-base border border-primary/20">
                        {phaseNumber}
                      </span>
                    </td>
                    <td className="p-4"><StatusBadge status={task.status} /></td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditItem(task)} 
                          className="p-2.5 rounded-xl hover:bg-muted transition-colors border"
                          title="Edit task"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => confirm('Are you sure you want to delete this task?') && deleteMutation.mutate(task.id)} 
                          className="p-2.5 rounded-xl hover:bg-destructive/10 transition-colors border border-destructive/20"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <p className="text-sm text-muted-foreground">Create a new task for the project</p>
          </DialogHeader>
          <TaskForm onSubmit={(d) => addMutation.mutate(d)} onCancel={() => setIsAddOpen(false)} isLoading={addMutation.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <p className="text-sm text-muted-foreground">Update task details</p>
          </DialogHeader>
          {editItem && <TaskForm initialData={editItem} onSubmit={(d) => updateMutation.mutate({ id: editItem.id, ...d })} onCancel={() => setEditItem(null)} isLoading={updateMutation.isPending} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function TaskForm({ initialData, onSubmit, onCancel, isLoading }: { initialData?: Task; onSubmit: (d: Partial<Task>) => void; onCancel: () => void; isLoading: boolean }) {
  const [data, setData] = useState<Partial<Task>>(initialData || { id: '', title: '', role: 'backend', phase_id: 1, priority: 'medium', complexity: 'medium', status: 'backlog' })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data) }}>
      <div className="px-6 py-4 space-y-5">
        {!initialData && <Input label="Task ID" value={data.id || ''} onChange={(v) => setData({ ...data, id: v })} placeholder="e.g. t1-10" />}
        <Input label="Title" value={data.title || ''} onChange={(v) => setData({ ...data, title: v })} placeholder="Enter task title" required />
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Role" value={data.role || ''} onChange={(v) => setData({ ...data, role: v })} options={['blockchain', 'contract', 'backend', 'frontend', 'mobile-ios', 'mobile-android', 'devops']} />
          <SelectField label="Phase" value={data.phase_id?.toString() || '1'} onChange={(v) => setData({ ...data, phase_id: parseInt(v) })} options={['1','2','3','4','5','6','7','8','9','10']} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SelectField label="Priority" value={data.priority || ''} onChange={(v) => setData({ ...data, priority: v })} options={['high', 'medium', 'low']} />
          <SelectField label="Complexity" value={data.complexity || ''} onChange={(v) => setData({ ...data, complexity: v })} options={['high', 'medium', 'low']} />
          <SelectField label="Status" value={data.status || ''} onChange={(v) => setData({ ...data, status: v })} options={['backlog', 'in_progress', 'review', 'done']} />
        </div>
      </div>
      <DialogFooter>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border hover:bg-muted transition-colors font-medium">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </DialogFooter>
    </form>
  )
}

// ============================================
// PHASES MANAGER
// ============================================
function PhasesManager({ phases, onRefresh, isLoading }: { phases: Phase[]; onRefresh: () => void; isLoading: boolean }) {
  const [editItem, setEditItem] = useState<Phase | null>(null)

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Phase> & { id: number }) => {
      const res = await fetch(`/api/v1/phases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: () => { onRefresh(); setEditItem(null) },
  })

  if (isLoading) return <LoadingState />

  return (
    <Card>
      <CardHeader><CardTitle>Phases</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {phases.map((phase) => (
            <div key={phase.id} className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">{phase.id}</div>
              <div className="flex-1">
                <p className="font-medium">{phase.name}</p>
                <p className="text-sm text-muted-foreground">{phase.focus}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold">{phase.progress}%</p>
                  <StatusBadge status={phase.status} />
                </div>
                <button onClick={() => setEditItem(phase)} className="p-2 hover:bg-muted rounded-lg"><Pencil className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Phase {editItem?.id}</DialogTitle>
            <p className="text-sm text-muted-foreground">Update phase details and progress</p>
          </DialogHeader>
          {editItem && <PhaseForm initialData={editItem} onSubmit={(d) => updateMutation.mutate({ id: editItem.id, ...d })} onCancel={() => setEditItem(null)} isLoading={updateMutation.isPending} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function PhaseForm({ initialData, onSubmit, onCancel, isLoading }: { initialData: Phase; onSubmit: (d: Partial<Phase>) => void; onCancel: () => void; isLoading: boolean }) {
  const [data, setData] = useState(initialData)
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data) }}>
      <div className="px-6 py-4 space-y-5">
        <Input label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
        <Input label="Focus" value={data.focus} onChange={(v) => setData({ ...data, focus: v })} />
        <Input label="Duration" value={data.duration} onChange={(v) => setData({ ...data, duration: v })} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Progress</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={data.progress} 
                onChange={(e) => setData({ ...data, progress: parseInt(e.target.value) })} 
                className="flex-1 h-2 accent-primary" 
              />
              <span className="text-lg font-bold tabular-nums w-12">{data.progress}%</span>
            </div>
          </div>
          <SelectField label="Status" value={data.status} onChange={(v) => setData({ ...data, status: v })} options={['pending', 'active', 'complete']} />
        </div>
      </div>
      <DialogFooter>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border hover:bg-muted transition-colors font-medium">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Update Phase
        </button>
      </DialogFooter>
    </form>
  )
}

// ============================================
// REPOS MANAGER
// ============================================
function ReposManager({ repos, onRefresh, isLoading }: { repos: Repository[]; onRefresh: () => void; isLoading: boolean }) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<Repository | null>(null)

  const addMutation = useMutation({
    mutationFn: async (data: Partial<Repository>) => {
      const res = await fetch('/api/v1/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: () => { onRefresh(); setIsAddOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Repository> & { id: string }) => {
      const res = await fetch(`/api/v1/repositories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: () => { onRefresh(); setEditItem(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await fetch(`/api/v1/repositories/${id}`, { method: 'DELETE' }) },
    onSuccess: onRefresh,
  })

  if (isLoading) return <LoadingState />

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Repositories</CardTitle>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium">
            <Plus className="h-5 w-5" /> Add Repo
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {repos.map((repo) => (
              <div key={repo.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium">{repo.name}</p>
                  <p className="text-xs text-muted-foreground">{repo.description}</p>
                </div>
                <Badge variant="outline">{repo.category}</Badge>
                <Badge variant={repo.visibility === 'public' ? 'success' : 'warning'}>{repo.visibility}</Badge>
                <button onClick={() => setEditItem(repo)} className="p-1 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => confirm('Delete?') && deleteMutation.mutate(repo.id)} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Repository</DialogTitle>
            <p className="text-sm text-muted-foreground">Register a new repository in the ecosystem</p>
          </DialogHeader>
          <RepoForm onSubmit={(d) => addMutation.mutate(d)} onCancel={() => setIsAddOpen(false)} isLoading={addMutation.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Repository</DialogTitle>
            <p className="text-sm text-muted-foreground">Update repository details</p>
          </DialogHeader>
          {editItem && <RepoForm initialData={editItem} onSubmit={(d) => updateMutation.mutate({ id: editItem.id, ...d })} onCancel={() => setEditItem(null)} isLoading={updateMutation.isPending} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function RepoForm({ initialData, onSubmit, onCancel, isLoading }: { initialData?: Repository; onSubmit: (d: Partial<Repository>) => void; onCancel: () => void; isLoading: boolean }) {
  const [data, setData] = useState<Partial<Repository>>(initialData || { name: '', description: '', url: '', visibility: 'public', category: 'Core', phase_id: 1 })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data) }}>
      <div className="px-6 py-4 space-y-5">
        <Input label="Repository Name" value={data.name || ''} onChange={(v) => setData({ ...data, name: v })} placeholder="e.g. norchain-node" required />
        <Input label="Description" value={data.description || ''} onChange={(v) => setData({ ...data, description: v })} placeholder="Brief description of the repository" />
        <Input label="GitHub URL" value={data.url || ''} onChange={(v) => setData({ ...data, url: v })} placeholder="https://github.com/NorChainOfficial/..." required />
        <div className="grid grid-cols-3 gap-4">
          <SelectField label="Visibility" value={data.visibility || ''} onChange={(v) => setData({ ...data, visibility: v })} options={['public', 'private']} />
          <SelectField label="Category" value={data.category || ''} onChange={(v) => setData({ ...data, category: v })} options={['Core', 'Wallet', 'Services', 'Tools', 'DevOps']} />
          <SelectField label="Phase" value={data.phase_id?.toString() || '1'} onChange={(v) => setData({ ...data, phase_id: parseInt(v) })} options={['1','2','3','4','5','6','7','8','9','10']} />
        </div>
      </div>
      <DialogFooter>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border hover:bg-muted transition-colors font-medium">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {initialData ? 'Update Repository' : 'Add Repository'}
        </button>
      </DialogFooter>
    </form>
  )
}

// ============================================
// COMPLIANCE MANAGER
// ============================================
function ComplianceManager({ items, onRefresh, isLoading }: { items: ComplianceItem[]; onRefresh: () => void; isLoading: boolean }) {
  const [editItem, setEditItem] = useState<ComplianceItem | null>(null)

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ComplianceItem> & { id: string }) => {
      const res = await fetch(`/api/v1/compliance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: () => { onRefresh(); setEditItem(null) },
  })

  if (isLoading) return <LoadingState />

  const byCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ComplianceItem[]>)

  return (
    <Card>
      <CardHeader><CardTitle>Compliance Items</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(byCategory).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="font-medium mb-2">{category}</h3>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <span className="font-mono text-xs w-8">{item.id}</span>
                    <span className="flex-1">{item.item}</span>
                    <StatusBadge status={item.status} />
                    <button onClick={() => setEditItem(item)} className="p-1 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Compliance Status</DialogTitle>
            <p className="text-sm text-muted-foreground">Change the status of this compliance item</p>
          </DialogHeader>
          {editItem && (
            <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: editItem.id, status: editItem.status }) }}>
              <div className="px-6 py-4 space-y-5">
                <div className="p-4 rounded-xl bg-muted/50 border">
                  <p className="font-medium">{editItem.item}</p>
                  <p className="text-sm text-muted-foreground mt-1">Category: {editItem.category}</p>
                </div>
                <SelectField label="Status" value={editItem.status} onChange={(v) => setEditItem({ ...editItem, status: v })} options={['pending', 'in_progress', 'complete']} />
              </div>
              <DialogFooter>
                <button type="button" onClick={() => setEditItem(null)} className="px-5 py-2.5 rounded-xl border hover:bg-muted transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={updateMutation.isPending} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                  {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update Status
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// ============================================
// SHARED COMPONENTS
// ============================================
function Input({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">{label}</label>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border bg-background text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 rounded-xl text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o} className="py-3">
              <span className="capitalize">{o.replace('_', ' ')}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    blockchain: { bg: 'bg-orange-500/15', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
    contract: { bg: 'bg-purple-500/15', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
    backend: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
    frontend: { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
    'mobile-ios': { bg: 'bg-pink-500/15', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/30' },
    'mobile-android': { bg: 'bg-green-500/15', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30' },
    devops: { bg: 'bg-cyan-500/15', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/30' },
  }
  const c = config[role] || { bg: 'bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30' }
  
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border capitalize',
      c.bg, c.text, c.border
    )}>
      {role.replace('-', ' ')}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    done: { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
    complete: { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
    in_progress: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-500 animate-pulse' },
    active: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-500 animate-pulse' },
    review: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-500' },
    backlog: { bg: 'bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30', dot: 'bg-slate-400' },
    pending: { bg: 'bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30', dot: 'bg-slate-400' },
  }
  const c = config[status as keyof typeof config] || config.pending
  
  return (
    <span className={cn(
      'inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-semibold border min-w-[7rem]',
      c.bg, c.text, c.border
    )}>
      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', c.dot)} />
      <span className="capitalize">{status.replace('_', ' ')}</span>
    </span>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

