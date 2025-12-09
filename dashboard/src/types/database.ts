export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      phases: {
        Row: {
          id: number
          name: string
          focus: string
          duration: string
          status: 'pending' | 'active' | 'complete'
          progress: number
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          focus: string
          duration: string
          status?: 'pending' | 'active' | 'complete'
          progress?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          focus?: string
          duration?: string
          status?: 'pending' | 'active' | 'complete'
          progress?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      deliverables: {
        Row: {
          id: string
          phase_id: number
          name: string
          description: string | null
          status: 'pending' | 'in_progress' | 'complete'
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phase_id: number
          name: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'complete'
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phase_id?: number
          name?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'complete'
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          role: 'blockchain' | 'contract' | 'backend' | 'frontend' | 'mobile-ios' | 'mobile-android' | 'devops'
          phase_id: number
          priority: 'high' | 'medium' | 'low'
          complexity: 'high' | 'medium' | 'low'
          status: 'backlog' | 'in_progress' | 'review' | 'done'
          assignee: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          role: 'blockchain' | 'contract' | 'backend' | 'frontend' | 'mobile-ios' | 'mobile-android' | 'devops'
          phase_id: number
          priority?: 'high' | 'medium' | 'low'
          complexity?: 'high' | 'medium' | 'low'
          status?: 'backlog' | 'in_progress' | 'review' | 'done'
          assignee?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          role?: 'blockchain' | 'contract' | 'backend' | 'frontend' | 'mobile-ios' | 'mobile-android' | 'devops'
          phase_id?: number
          priority?: 'high' | 'medium' | 'low'
          complexity?: 'high' | 'medium' | 'low'
          status?: 'backlog' | 'in_progress' | 'review' | 'done'
          assignee?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      repositories: {
        Row: {
          id: string
          name: string
          description: string | null
          url: string
          visibility: 'public' | 'private'
          category: string
          phase_id: number | null
          default_branch: string | null
          language: string | null
          stars: number
          forks: number
          open_issues: number
          last_commit_at: string | null
          health: 'healthy' | 'warning' | 'critical'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          url: string
          visibility?: 'public' | 'private'
          category: string
          phase_id?: number | null
          default_branch?: string | null
          language?: string | null
          stars?: number
          forks?: number
          open_issues?: number
          last_commit_at?: string | null
          health?: 'healthy' | 'warning' | 'critical'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          url?: string
          visibility?: 'public' | 'private'
          category?: string
          phase_id?: number | null
          default_branch?: string | null
          language?: string | null
          stars?: number
          forks?: number
          open_issues?: number
          last_commit_at?: string | null
          health?: 'healthy' | 'warning' | 'critical'
          created_at?: string
          updated_at?: string
        }
      }
      tokens: {
        Row: {
          id: string
          symbol: string
          name: string
          type: 'utility' | 'security'
          tradability: 'public' | 'private'
          kyc_required: boolean
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          type: 'utility' | 'security'
          tradability: 'public' | 'private'
          kyc_required?: boolean
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          type?: 'utility' | 'security'
          tradability?: 'public' | 'private'
          kyc_required?: boolean
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      compliance_items: {
        Row: {
          id: string
          category: string
          item: string
          status: 'pending' | 'in_progress' | 'complete'
          required: boolean
          notes: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          category: string
          item: string
          status?: 'pending' | 'in_progress' | 'complete'
          required?: boolean
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          item?: string
          status?: 'pending' | 'in_progress' | 'complete'
          required?: boolean
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          type: 'commit' | 'issue' | 'pr' | 'release' | 'milestone' | 'task_update' | 'phase_update' | 'compliance_update'
          entity_type: string
          entity_id: string
          title: string
          description: string | null
          author: string | null
          author_avatar: string | null
          url: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'commit' | 'issue' | 'pr' | 'release' | 'milestone' | 'task_update' | 'phase_update' | 'compliance_update'
          entity_type: string
          entity_id: string
          title: string
          description?: string | null
          author?: string | null
          author_avatar?: string | null
          url?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'commit' | 'issue' | 'pr' | 'release' | 'milestone' | 'task_update' | 'phase_update' | 'compliance_update'
          entity_type?: string
          entity_id?: string
          title?: string
          description?: string | null
          author?: string | null
          author_avatar?: string | null
          url?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
  }
}

// Helper types
export type Phase = Database['public']['Tables']['phases']['Row']
export type PhaseInsert = Database['public']['Tables']['phases']['Insert']
export type PhaseUpdate = Database['public']['Tables']['phases']['Update']

export type Deliverable = Database['public']['Tables']['deliverables']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Repository = Database['public']['Tables']['repositories']['Row']
export type Token = Database['public']['Tables']['tokens']['Row']
export type ComplianceItem = Database['public']['Tables']['compliance_items']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']

