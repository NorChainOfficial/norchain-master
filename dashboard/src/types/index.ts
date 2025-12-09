// Phase types
export interface Phase {
  id: number
  name: string
  focus: string
  duration: string
  status: 'pending' | 'active' | 'complete'
  progress: number
  deliverables: Deliverable[]
}

export interface Deliverable {
  name: string
  status: 'pending' | 'in_progress' | 'complete'
  description?: string
}

// Task types
export interface Task {
  id: string
  title: string
  description?: string
  role: TaskRole
  phase: number
  priority: 'high' | 'medium' | 'low'
  complexity: 'high' | 'medium' | 'low'
  status: TaskStatus
}

export type TaskRole =
  | 'blockchain'
  | 'contract'
  | 'backend'
  | 'frontend'
  | 'mobile-ios'
  | 'mobile-android'
  | 'devops'

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done'

// Repository types
export interface Repository {
  name: string
  description: string
  url: string
  visibility: 'public' | 'private'
  category: string
  phase: number
  defaultBranch: string
}

export interface RepositoryStats {
  name: string
  openIssues: number
  openPRs: number
  stars: number
  forks: number
  lastCommit: string
  lastActivity: string
  health: 'healthy' | 'warning' | 'critical'
}

// Compliance types
export interface Token {
  symbol: string
  name: string
  type: 'utility' | 'security'
  tradability: 'public' | 'private'
  kycRequired: boolean
  description: string
}

export interface ComplianceItem {
  id: string
  category: string
  item: string
  status: 'complete' | 'in_progress' | 'pending'
  required: boolean
}

export interface ComplianceData {
  tokens: Token[]
  checklist: ComplianceItem[]
  strategy: string
}

// Activity types
export interface Activity {
  id: string
  type: 'commit' | 'issue' | 'pr' | 'release' | 'milestone'
  repo: string
  title: string
  author: string
  authorAvatar?: string
  timestamp: string
  url: string
}

// GitHub API types
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  visibility: string
  default_branch: string
  created_at: string
  updated_at: string
  pushed_at: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
}

export interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  author: {
    login: string
    avatar_url: string
  } | null
  html_url: string
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  state: string
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  labels: Array<{
    name: string
    color: string
  }>
}

export interface GitHubPR {
  id: number
  number: number
  title: string
  state: string
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  merged_at: string | null
}

// Dashboard state types
export interface DashboardFilters {
  phase?: number
  role?: TaskRole
  status?: TaskStatus
  search?: string
}

export interface DashboardState {
  currentPhase: number
  filters: DashboardFilters
  view: 'grid' | 'list'
}

