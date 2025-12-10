export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log: {
        Row: {
          author: string | null
          author_avatar: string | null
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          author?: string | null
          author_avatar?: string | null
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          author?: string | null
          author_avatar?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      agent_configs: {
        Row: {
          allowed_actions: string[] | null
          autonomy_level: string
          created_at: string | null
          enabled: boolean | null
          id: string
          max_daily_executions: number | null
          project_id: string | null
          requires_approval: boolean | null
          task_type: string
          updated_at: string | null
        }
        Insert: {
          allowed_actions?: string[] | null
          autonomy_level: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          max_daily_executions?: number | null
          project_id?: string | null
          requires_approval?: boolean | null
          task_type: string
          updated_at?: string | null
        }
        Update: {
          allowed_actions?: string[] | null
          autonomy_level?: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          max_daily_executions?: number | null
          project_id?: string | null
          requires_approval?: boolean | null
          task_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_tasks: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          autonomy_level: string
          completed_at: string | null
          created_at: string | null
          description: string | null
          error_message: string | null
          execution_log: string | null
          id: string
          input_data: Json | null
          output_data: Json | null
          project_id: string | null
          requires_approval: boolean | null
          started_at: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          autonomy_level: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          error_message?: string | null
          execution_log?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          project_id?: string | null
          requires_approval?: boolean | null
          started_at?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          autonomy_level?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          error_message?: string | null
          execution_log?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          project_id?: string | null
          requires_approval?: boolean | null
          started_at?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          project_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_generated_content: {
        Row: {
          accepted: boolean | null
          content_type: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          generated_content: string
          id: string
          model_used: string | null
          original_content: string | null
          project_id: string | null
          prompt_used: string | null
          tokens_used: number | null
        }
        Insert: {
          accepted?: boolean | null
          content_type: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          generated_content: string
          id?: string
          model_used?: string | null
          original_content?: string | null
          project_id?: string | null
          prompt_used?: string | null
          tokens_used?: number | null
        }
        Update: {
          accepted?: boolean | null
          content_type?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          generated_content?: string
          id?: string
          model_used?: string | null
          original_content?: string | null
          project_id?: string | null
          prompt_used?: string | null
          tokens_used?: number | null
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          tokens_used?: number | null
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          action_data: Json | null
          confidence: number | null
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          project_id: string | null
          reasoning: string | null
          resolved_at: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          action_data?: Json | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          reasoning?: string | null
          resolved_at?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          action_data?: Json | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          reasoning?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      compliance_items: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          id: string
          item: string
          notes: string | null
          project_id: string | null
          required: boolean
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string
          id: string
          item: string
          notes?: string | null
          project_id?: string | null
          required?: boolean
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          item?: string
          notes?: string | null
          project_id?: string | null
          required?: boolean
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      deliverables: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          phase_id: number
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          phase_id: number
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          phase_id?: number
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      deployments: {
        Row: {
          artifact_url: string | null
          branch: string | null
          commit_message: string | null
          commit_sha: string | null
          completed_at: string | null
          created_at: string | null
          deployed_by: string | null
          duration_ms: number | null
          environment_id: string
          id: string
          logs: string | null
          rollback_to: string | null
          started_at: string | null
          status: string | null
          version: string | null
        }
        Insert: {
          artifact_url?: string | null
          branch?: string | null
          commit_message?: string | null
          commit_sha?: string | null
          completed_at?: string | null
          created_at?: string | null
          deployed_by?: string | null
          duration_ms?: number | null
          environment_id: string
          id?: string
          logs?: string | null
          rollback_to?: string | null
          started_at?: string | null
          status?: string | null
          version?: string | null
        }
        Update: {
          artifact_url?: string | null
          branch?: string | null
          commit_message?: string | null
          commit_sha?: string | null
          completed_at?: string | null
          created_at?: string | null
          deployed_by?: string | null
          duration_ms?: number | null
          environment_id?: string
          id?: string
          logs?: string | null
          rollback_to?: string | null
          started_at?: string | null
          status?: string | null
          version?: string | null
        }
        Relationships: []
      }
      environments: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          last_deploy_at: string | null
          name: string
          project_id: string | null
          provider: string | null
          provider_id: string | null
          status: string | null
          type: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          last_deploy_at?: string | null
          name: string
          project_id?: string | null
          provider?: string | null
          provider_id?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          last_deploy_at?: string | null
          name?: string
          project_id?: string | null
          provider?: string | null
          provider_id?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      health_check_history: {
        Row: {
          checked_at: string | null
          error_message: string | null
          health_check_id: string
          id: string
          response_time_ms: number | null
          status: string
          status_code: number | null
        }
        Insert: {
          checked_at?: string | null
          error_message?: string | null
          health_check_id: string
          id?: string
          response_time_ms?: number | null
          status: string
          status_code?: number | null
        }
        Update: {
          checked_at?: string | null
          error_message?: string | null
          health_check_id?: string
          id?: string
          response_time_ms?: number | null
          status?: string
          status_code?: number | null
        }
        Relationships: []
      }
      health_checks: {
        Row: {
          consecutive_failures: number | null
          created_at: string | null
          enabled: boolean | null
          endpoint: string
          environment_id: string
          expected_status: number | null
          id: string
          interval_seconds: number | null
          last_checked_at: string | null
          last_response_time_ms: number | null
          method: string | null
          name: string
          status: string | null
          timeout_ms: number | null
          updated_at: string | null
        }
        Insert: {
          consecutive_failures?: number | null
          created_at?: string | null
          enabled?: boolean | null
          endpoint: string
          environment_id: string
          expected_status?: number | null
          id?: string
          interval_seconds?: number | null
          last_checked_at?: string | null
          last_response_time_ms?: number | null
          method?: string | null
          name: string
          status?: string | null
          timeout_ms?: number | null
          updated_at?: string | null
        }
        Update: {
          consecutive_failures?: number | null
          created_at?: string | null
          enabled?: boolean | null
          endpoint?: string
          environment_id?: string
          expected_status?: number | null
          id?: string
          interval_seconds?: number | null
          last_checked_at?: string | null
          last_response_time_ms?: number | null
          method?: string | null
          name?: string
          status?: string | null
          timeout_ms?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      phases: {
        Row: {
          created_at: string
          duration: string
          focus: string
          id: number
          name: string
          progress: number
          project_id: string | null
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration: string
          focus: string
          id?: number
          name: string
          progress?: number
          project_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration?: string
          focus?: string
          id?: number
          name?: string
          progress?: number
          project_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      pipeline_runs: {
        Row: {
          branch: string | null
          commit_sha: string | null
          completed_at: string | null
          created_at: string | null
          duration_ms: number | null
          external_id: string | null
          id: string
          logs_url: string | null
          pipeline_id: string
          started_at: string | null
          status: string | null
          trigger: string | null
        }
        Insert: {
          branch?: string | null
          commit_sha?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          external_id?: string | null
          id?: string
          logs_url?: string | null
          pipeline_id: string
          started_at?: string | null
          status?: string | null
          trigger?: string | null
        }
        Update: {
          branch?: string | null
          commit_sha?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          external_id?: string | null
          id?: string
          logs_url?: string | null
          pipeline_id?: string
          started_at?: string | null
          status?: string | null
          trigger?: string | null
        }
        Relationships: []
      }
      pipelines: {
        Row: {
          config: Json | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          name: string
          project_id: string | null
          provider: string
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          project_id?: string | null
          provider: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          project_id?: string | null
          provider?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      project_dependencies: {
        Row: {
          created_at: string | null
          dependency_type: string
          depends_on_id: string
          id: string
          notes: string | null
          project_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_type: string
          depends_on_id: string
          id?: string
          notes?: string | null
          project_id: string
        }
        Update: {
          created_at?: string | null
          dependency_type?: string
          depends_on_id?: string
          id?: string
          notes?: string | null
          project_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          ai_context: Json | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          settings: Json | null
          slug: string
          status: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          ai_context?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          settings?: Json | null
          slug: string
          status?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          ai_context?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          settings?: Json | null
          slug?: string
          status?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: []
      }
      repositories: {
        Row: {
          category: string
          created_at: string
          default_branch: string | null
          description: string | null
          forks: number | null
          health: string | null
          id: string
          language: string | null
          last_commit_at: string | null
          name: string
          open_issues: number | null
          phase_id: number | null
          project_id: string | null
          stars: number | null
          updated_at: string
          url: string
          visibility: string
        }
        Insert: {
          category: string
          created_at?: string
          default_branch?: string | null
          description?: string | null
          forks?: number | null
          health?: string | null
          id?: string
          language?: string | null
          last_commit_at?: string | null
          name: string
          open_issues?: number | null
          phase_id?: number | null
          project_id?: string | null
          stars?: number | null
          updated_at?: string
          url: string
          visibility?: string
        }
        Update: {
          category?: string
          created_at?: string
          default_branch?: string | null
          description?: string | null
          forks?: number | null
          health?: string | null
          id?: string
          language?: string | null
          last_commit_at?: string | null
          name?: string
          open_issues?: number | null
          phase_id?: number | null
          project_id?: string | null
          stars?: number | null
          updated_at?: string
          url?: string
          visibility?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: string | null
          complexity: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          phase_id: number
          priority: string
          project_id: string | null
          role: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          complexity?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id: string
          phase_id: number
          priority?: string
          project_id?: string | null
          role: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          complexity?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          phase_id?: number
          priority?: string
          project_id?: string | null
          role?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_case_results: {
        Row: {
          case_id: string
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          run_id: string
          screenshot_url: string | null
          status: string
        }
        Insert: {
          case_id: string
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          run_id: string
          screenshot_url?: string | null
          status: string
        }
        Update: {
          case_id?: string
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          run_id?: string
          screenshot_url?: string | null
          status?: string
        }
        Relationships: []
      }
      test_cases: {
        Row: {
          ai_generated: boolean | null
          created_at: string | null
          description: string | null
          expected_result: string | null
          id: string
          name: string
          priority: string | null
          steps: Json | null
          suite_id: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          expected_result?: string | null
          id?: string
          name: string
          priority?: string | null
          steps?: Json | null
          suite_id: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          expected_result?: string | null
          id?: string
          name?: string
          priority?: string | null
          steps?: Json | null
          suite_id?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      test_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_ms: number | null
          environment: string | null
          id: string
          logs: string | null
          results: Json | null
          started_at: string | null
          status: string | null
          suite_id: string
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          environment?: string | null
          id?: string
          logs?: string | null
          results?: Json | null
          started_at?: string | null
          status?: string | null
          suite_id: string
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          environment?: string | null
          id?: string
          logs?: string | null
          results?: Json | null
          started_at?: string | null
          status?: string | null
          suite_id?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      test_suites: {
        Row: {
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_id: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tokens: {
        Row: {
          created_at: string
          description: string | null
          id: string
          kyc_required: boolean
          name: string
          symbol: string
          tradability: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          kyc_required?: boolean
          name: string
          symbol: string
          tradability: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          kyc_required?: boolean
          name?: string
          symbol?: string
          tradability?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          org_id: string
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          org_id: string
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier access
export type Organization = Database['public']['Tables']['organizations']['Row']
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']

export type Workspace = Database['public']['Tables']['workspaces']['Row']
export type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert']
export type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ProjectDependency = Database['public']['Tables']['project_dependencies']['Row']

export type Phase = Database['public']['Tables']['phases']['Row']
export type PhaseInsert = Database['public']['Tables']['phases']['Insert']
export type PhaseUpdate = Database['public']['Tables']['phases']['Update']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type Repository = Database['public']['Tables']['repositories']['Row']
export type RepositoryInsert = Database['public']['Tables']['repositories']['Insert']
export type RepositoryUpdate = Database['public']['Tables']['repositories']['Update']

export type ComplianceItem = Database['public']['Tables']['compliance_items']['Row']
export type ComplianceItemInsert = Database['public']['Tables']['compliance_items']['Insert']
export type ComplianceItemUpdate = Database['public']['Tables']['compliance_items']['Update']

export type ActivityLog = Database['public']['Tables']['activity_log']['Row']
export type ActivityLogInsert = Database['public']['Tables']['activity_log']['Insert']

export type Token = Database['public']['Tables']['tokens']['Row']
export type Deliverable = Database['public']['Tables']['deliverables']['Row']

// Testing types
export type TestSuite = Database['public']['Tables']['test_suites']['Row']
export type TestSuiteInsert = Database['public']['Tables']['test_suites']['Insert']
export type TestCase = Database['public']['Tables']['test_cases']['Row']
export type TestCaseInsert = Database['public']['Tables']['test_cases']['Insert']
export type TestRun = Database['public']['Tables']['test_runs']['Row']
export type TestCaseResult = Database['public']['Tables']['test_case_results']['Row']

// CI/CD types
export type Environment = Database['public']['Tables']['environments']['Row']
export type EnvironmentInsert = Database['public']['Tables']['environments']['Insert']
export type Deployment = Database['public']['Tables']['deployments']['Row']
export type DeploymentInsert = Database['public']['Tables']['deployments']['Insert']
export type HealthCheck = Database['public']['Tables']['health_checks']['Row']
export type HealthCheckHistory = Database['public']['Tables']['health_check_history']['Row']
export type Pipeline = Database['public']['Tables']['pipelines']['Row']
export type PipelineRun = Database['public']['Tables']['pipeline_runs']['Row']

// AI types
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row']
export type AIMessage = Database['public']['Tables']['ai_messages']['Row']
export type AISuggestion = Database['public']['Tables']['ai_suggestions']['Row']
export type AgentTask = Database['public']['Tables']['agent_tasks']['Row']
export type AgentConfig = Database['public']['Tables']['agent_configs']['Row']
export type AIGeneratedContent = Database['public']['Tables']['ai_generated_content']['Row']
