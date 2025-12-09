'use client'

import { useMemo, useState } from 'react'
import tasksData from '@/data/tasks.json'
import type { Task, TaskRole, TaskStatus, DashboardFilters } from '@/types'

export function useTasks(initialFilters?: DashboardFilters) {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters || {})
  const tasks = tasksData as Task[]
  
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
      completionRate: Math.round((done / total) * 100),
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
  }
}

