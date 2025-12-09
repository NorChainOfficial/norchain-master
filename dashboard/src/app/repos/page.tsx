'use client'

import { RepoGrid } from '@/components/dashboard/RepoGrid'
import reposData from '@/data/repos.json'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitBranch, Lock, Globe, AlertCircle, Star } from 'lucide-react'
import type { Repository } from '@/types'

export default function ReposPage() {
  const repos = reposData as Repository[]
  const publicRepos = repos.filter((r) => r.visibility === 'public')
  const privateRepos = repos.filter((r) => r.visibility === 'private')
  const categories = Array.from(new Set(repos.map((r) => r.category)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Repositories</h1>
          <p className="text-muted-foreground">
            All repositories in the NorChainOfficial organization
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-1">
          <GitBranch className="h-4 w-4 mr-2" />
          {repos.length} repositories
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publicRepos.length}</p>
                <p className="text-xs text-muted-foreground">Public</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 p-2 rounded-lg">
                <Lock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{privateRepos.length}</p>
                <p className="text-xs text-muted-foreground">Private</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-norchain-500/10 p-2 rounded-lg">
                <Star className="h-5 w-5 text-norchain-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">10</p>
                <p className="text-xs text-muted-foreground">Phases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repository Grid */}
      <RepoGrid />
    </div>
  )
}

