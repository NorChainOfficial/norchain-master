'use client'

import { StatsCards } from '@/components/dashboard/StatsCards'
import { PhaseProgress } from '@/components/dashboard/PhaseProgress'
import { RepoList } from '@/components/dashboard/RepoGrid'
import { TaskList } from '@/components/dashboard/TaskBoard'
import { ComplianceStatus } from '@/components/dashboard/CompliancePanel'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Phase Progress */}
        <div className="lg:col-span-2">
          <PhaseProgress />
        </div>

        {/* Right Column - Activity Feed */}
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repositories */}
        <Card variant="glass" className="group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Repositories</CardTitle>
              <Link 
                href="/repos" 
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <RepoList />
          </CardContent>
        </Card>

        {/* Tasks Preview */}
        <Card variant="glass" className="group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Tasks</CardTitle>
              <Link 
                href="/tasks" 
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <TaskList />
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card variant="glass" className="group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Compliance</CardTitle>
              <Link 
                href="/compliance" 
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ComplianceStatus />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
