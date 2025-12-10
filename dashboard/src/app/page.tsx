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
    <div className="p-8 space-y-8 min-h-full">
      {/* Stats Overview */}
      <StatsCards />

      {/* Main Content Grid - Activity Feed matches Phase Progress height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Phase Progress */}
        <div className="lg:col-span-2">
          <PhaseProgress />
        </div>

        {/* Right Column - Activity Feed - Stretches to match left column */}
        <div className="lg:row-span-1">
          <ActivityFeed className="h-full min-h-[500px] lg:min-h-0" maxHeight="calc(100% - 120px)" />
        </div>
      </div>

      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Repositories */}
        <Card variant="glass" className="group flex flex-col">
          <CardHeader className="pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Repositories</CardTitle>
              <Link 
                href="/repos" 
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <RepoList />
          </CardContent>
        </Card>

        {/* Tasks Preview */}
        <Card variant="glass" className="group flex flex-col">
          <CardHeader className="pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Active Tasks</CardTitle>
              <Link 
                href="/tasks" 
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <TaskList />
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card variant="glass" className="group flex flex-col">
          <CardHeader className="pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Compliance</CardTitle>
              <Link 
                href="/compliance" 
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ComplianceStatus />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
