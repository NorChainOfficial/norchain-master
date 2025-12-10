'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task, TaskRole, TaskStatus, DashboardFilters } from '@/types'

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/v1/tasks')
  if (!res.ok) throw new Error('Failed to fetch tasks')
  const data = await res.json()
  // Map database fields to component fields
  return data.map((task: any) => ({
    id: task.id,
    title: task.title,
    role: task.role,
    phase: task.phase_id,
    priority: task.priority,
    complexity: task.complexity,
    status: task.status,
    description: task.description,
    assignee: task.assignee,
  }))
}

async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const res = await fetch(`/api/v1/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update task')
  return res.json()
}

async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await fetch('/api/v1/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: task.id,
      title: task.title,
      role: task.role,
      phase_id: task.phase,
      priority: task.priority || 'medium',
      complexity: task.complexity || 'medium',
      status: task.status || 'backlog',
    }),
  })
  if (!res.ok) throw new Error('Failed to create task')
  return res.json()
}

async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`/api/v1/tasks/${taskId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete task')
}

export function useTasks(initialFilters?: DashboardFilters) {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters || {})
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 10000, // 10 seconds
    refetchOnWindowFocus: true,
  })

  const updateMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.phase && task.phase !== filters.phase) return false
      if (filters.role && task.role !== filters.role) return false
      if (filters.status && task.status !== filters.status) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return task.title.toLowerCase().includes(searchLower)
      }
      return true
    })
  }, [tasks, filters])

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      in_progress: [],
      review: [],
      done: [],
    }

    filteredTasks.forEach((task) => {
      grouped[task.status].push(task)
    })

    return grouped
  }, [filteredTasks])

  const tasksByRole = useMemo(() => {
    const grouped: Record<string, Task[]> = {}

    tasks.forEach((task) => {
      if (!grouped[task.role]) {
        grouped[task.role] = []
      }
      grouped[task.role].push(task)
    })

    return grouped
  }, [tasks])

  const taskStats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.status === 'done').length
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length
    const backlog = tasks.filter((t) => t.status === 'backlog').length

    return {
      total,
      done,
      inProgress,
      backlog,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
    }
  }, [tasks])

  const roles: TaskRole[] = [
    'blockchain',
    'contract',
    'backend',
    'frontend',
    'mobile-ios',
    'mobile-android',
    'devops',
  ]

  return {
    tasks,
    filteredTasks,
    tasksByStatus,
    tasksByRole,
    taskStats,
    filters,
    setFilters,
    roles,
    isLoading,
    error,
    refetch,
    updateTask: (taskId: string, updates: Partial<Task>) =>
      updateMutation.mutate({ taskId, updates }),
    createTask: (task: Partial<Task>) => createMutation.mutate(task),
    deleteTask: (taskId: string) => deleteMutation.mutate(taskId),
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
