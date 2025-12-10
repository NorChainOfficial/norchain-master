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
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-2 w-10"><button onClick={toggleAll}>{selected.size === tasks.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}</button></th>
                <th className="p-2 w-20">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2 w-24">Role</th>
                <th className="p-2 w-16">Phase</th>
                <th className="p-2 w-24">Status</th>
                <th className="p-2 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className={cn('border-b hover:bg-muted/50', selected.has(task.id) && 'bg-primary/5')}>
                  <td className="p-2"><button onClick={() => setSelected(s => { const n = new Set(s); n.has(task.id) ? n.delete(task.id) : n.add(task.id); return n })}>{selected.has(task.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}</button></td>
                  <td className="p-2 font-mono text-xs">{task.id}</td>
                  <td className="p-2">{task.title}</td>
                  <td className="p-2"><Badge variant="outline">{task.role}</Badge></td>
                  <td className="p-2">{task.phase_id}</td>
                  <td className="p-2"><StatusBadge status={task.status} /></td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <button onClick={() => setEditItem(task)} className="p-1 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => confirm('Delete?') && deleteMutation.mutate(task.id)} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Task</DialogTitle></DialogHeader>
          <TaskForm onSubmit={(d) => addMutation.mutate(d)} isLoading={addMutation.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
          {editItem && <TaskForm initialData={editItem} onSubmit={(d) => updateMutation.mutate({ id: editItem.id, ...d })} isLoading={updateMutation.isPending} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function TaskForm({ initialData, onSubmit, isLoading }: { initialData?: Task; onSubmit: (d: Partial<Task>) => void; isLoading: boolean }) {
  const [data, setData] = useState<Partial<Task>>(initialData || { id: '', title: '', role: 'backend', phase_id: 1, priority: 'medium', complexity: 'medium', status: 'backlog' })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data) }} className="space-y-4">
      {!initialData && <Input label="ID" value={data.id || ''} onChange={(v) => setData({ ...data, id: v })} placeholder="t1-10" />}
      <Input label="Title" value={data.title || ''} onChange={(v) => setData({ ...data, title: v })} required />
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Role" value={data.role || ''} onChange={(v) => setData({ ...data, role: v })} options={['blockchain', 'contract', 'backend', 'frontend', 'mobile-ios', 'mobile-android', 'devops']} />
        <SelectField label="Phase" value={data.phase_id?.toString() || '1'} onChange={(v) => setData({ ...data, phase_id: parseInt(v) })} options={['1','2','3','4','5','6','7','8','9','10']} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <SelectField label="Priority" value={data.priority || ''} onChange={(v) => setData({ ...data, priority: v })} options={['high', 'medium', 'low']} />
        <SelectField label="Complexity" value={data.complexity || ''} onChange={(v) => setData({ ...data, complexity: v })} options={['high', 'medium', 'low']} />
        <SelectField label="Status" value={data.status || ''} onChange={(v) => setData({ ...data, status: v })} options={['backlog', 'in_progress', 'review', 'done']} />
      </div>
      <DialogFooter>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
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
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Phase {editItem?.id}</DialogTitle></DialogHeader>
          {editItem && <PhaseForm initialData={editItem} onSubmit={(d) => updateMutation.mutate({ id: editItem.id, ...d })} isLoading={updateMutation.isPending} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function PhaseForm({ initialData, onSubmit, isLoading }: { initialData: Phase; onSubmit: (d: Partial<Phase>) => void; isLoading: boolean }) {
  const [data, setData] = useState(initialData)
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data) }} className="space-y-4">
      <Input label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
      <Input label="Focus" value={data.focus} onChange={(v) => setData({ ...data, focus: v })} />
      <Input label="Duration" value={data.duration} onChange={(v) => setData({ ...data, duration: v })} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Progress</label>
          <input type="range" min="0" max="100" value={data.progress} onChange={(e) => setData({ ...data, progress: parseInt(e.target.value) })} className="w-full mt-1" />
          <span className="text-sm">{data.progress}%</span>
        </div>
        <SelectField label="Status" value={data.status} onChange={(v) => setData({ ...data, status: v })} options={['pending', 'active', 'complete']} />
      </div>
      <DialogFooter>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
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
        <DialogContent><DialogHeader><DialogTitle>Add Repository</DialogTitle></DialogHeader>
          <RepoForm onSubmit={(d) => addMutation.mutate(d)} isLoading={addMutation.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Repository</DialogTitle></DialogHeader>
          {editItem && <RepoForm initialData={editItem} onSubmit={(d) => updateMutation.mutate({ id: editItem.id, ...d })} isLoading={updateMutation.isPending} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function RepoForm({ initialData, onSubmit, isLoading }: { initialData?: Repository; onSubmit: (d: Partial<Repository>) => void; isLoading: boolean }) {
  const [data, setData] = useState<Partial<Repository>>(initialData || { name: '', description: '', url: '', visibility: 'public', category: 'Core', phase_id: 1 })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data) }} className="space-y-4">
      <Input label="Name" value={data.name || ''} onChange={(v) => setData({ ...data, name: v })} required />
      <Input label="Description" value={data.description || ''} onChange={(v) => setData({ ...data, description: v })} />
      <Input label="URL" value={data.url || ''} onChange={(v) => setData({ ...data, url: v })} required />
      <div className="grid grid-cols-3 gap-3">
        <SelectField label="Visibility" value={data.visibility || ''} onChange={(v) => setData({ ...data, visibility: v })} options={['public', 'private']} />
        <SelectField label="Category" value={data.category || ''} onChange={(v) => setData({ ...data, category: v })} options={['Core', 'Wallet', 'Services', 'Tools', 'DevOps']} />
        <SelectField label="Phase" value={data.phase_id?.toString() || '1'} onChange={(v) => setData({ ...data, phase_id: parseInt(v) })} options={['1','2','3','4','5','6','7','8','9','10']} />
      </div>
      <DialogFooter>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
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
        <DialogContent><DialogHeader><DialogTitle>Edit Compliance Item</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: editItem.id, status: editItem.status }) }} className="space-y-4">
              <p className="text-sm">{editItem.item}</p>
              <SelectField label="Status" value={editItem.status} onChange={(v) => setEditItem({ ...editItem, status: v })} options={['pending', 'in_progress', 'complete']} />
              <DialogFooter>
                <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Save</button>
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
      <label className="text-sm font-medium">{label}</label>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        required={required}
        className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm" 
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o.replace('_', ' ')}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn(
      'text-xs',
      status === 'done' || status === 'complete' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
      status === 'in_progress' || status === 'active' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
      status === 'review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
      'bg-muted text-muted-foreground'
    )}>
      {status.replace('_', ' ')}
    </Badge>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

