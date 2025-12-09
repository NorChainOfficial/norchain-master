'use client'

import { StatsCards } from '@/components/dashboard/StatsCards'
import { PhaseProgress } from '@/components/dashboard/PhaseProgress'
import { RepoList } from '@/components/dashboard/RepoGrid'
import { TaskList } from '@/components/dashboard/TaskBoard'
import { ComplianceStatus } from '@/components/dashboard/CompliancePanel'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">NorChain PM Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time visibility into the NorChain ecosystem development
        </p>
      </div>

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <RepoList />
          </CardContent>
        </Card>

        {/* Tasks Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList />
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceStatus />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

