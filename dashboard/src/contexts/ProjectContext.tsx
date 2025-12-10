'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Organization, Workspace, Project } from '@/types/database'

interface ProjectContextType {
  // Current selections
  currentOrg: Organization | null
  currentWorkspace: Workspace | null
  currentProject: Project | null
  
  // Data
  organizations: Organization[]
  workspaces: Workspace[]
  projects: Project[]
  
  // Loading states
  isLoading: boolean
  
  // Actions
  setCurrentOrg: (org: Organization | null) => void
  setCurrentWorkspace: (workspace: Workspace | null) => void
  setCurrentProject: (project: Project | null) => void
  refreshOrganizations: () => Promise<void>
  refreshWorkspaces: () => Promise<void>
  refreshProjects: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  
  const [isLoading, setIsLoading] = useState(true)

  const refreshOrganizations = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/organizations')
      if (res.ok) {
        const data = await res.json()
        setOrganizations(data)
        // Auto-select first org if none selected
        if (!currentOrg && data.length > 0) {
          setCurrentOrg(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    }
  }, [currentOrg])

  const refreshWorkspaces = useCallback(async () => {
    if (!currentOrg) {
      setWorkspaces([])
      return
    }
    try {
      const res = await fetch(`/api/v1/workspaces?org_id=${currentOrg.id}`)
      if (res.ok) {
        const data = await res.json()
        setWorkspaces(data)
        // Auto-select first workspace if none selected
        if (!currentWorkspace && data.length > 0) {
          setCurrentWorkspace(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
    }
  }, [currentOrg, currentWorkspace])

  const refreshProjects = useCallback(async () => {
    if (!currentWorkspace) {
      setProjects([])
      return
    }
    try {
      const res = await fetch(`/api/v1/projects?workspace_id=${currentWorkspace.id}`)
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
        // Auto-select first project if none selected
        if (!currentProject && data.length > 0) {
          setCurrentProject(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }, [currentWorkspace, currentProject])

  // Load organizations on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await refreshOrganizations()
      setIsLoading(false)
    }
    init()
  }, [])

  // Load workspaces when org changes
  useEffect(() => {
    if (currentOrg) {
      setCurrentWorkspace(null)
      setCurrentProject(null)
      refreshWorkspaces()
    }
  }, [currentOrg?.id])

  // Load projects when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      setCurrentProject(null)
      refreshProjects()
    }
  }, [currentWorkspace?.id])

  // Persist selections to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && currentOrg) {
      localStorage.setItem('norchain_current_org', currentOrg.id)
    }
  }, [currentOrg])

  useEffect(() => {
    if (typeof window !== 'undefined' && currentWorkspace) {
      localStorage.setItem('norchain_current_workspace', currentWorkspace.id)
    }
  }, [currentWorkspace])

  useEffect(() => {
    if (typeof window !== 'undefined' && currentProject) {
      localStorage.setItem('norchain_current_project', currentProject.id)
    }
  }, [currentProject])

  return (
    <ProjectContext.Provider
      value={{
        currentOrg,
        currentWorkspace,
        currentProject,
        organizations,
        workspaces,
        projects,
        isLoading,
        setCurrentOrg,
        setCurrentWorkspace,
        setCurrentProject,
        refreshOrganizations,
        refreshWorkspaces,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}

export function useCurrentProject() {
  const { currentProject } = useProject()
  return currentProject
}

export function useCurrentWorkspace() {
  const { currentWorkspace } = useProject()
  return currentWorkspace
}

export function useCurrentOrg() {
  const { currentOrg } = useProject()
  return currentOrg
}

