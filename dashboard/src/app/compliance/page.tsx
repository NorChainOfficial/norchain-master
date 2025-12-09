'use client'

import { CompliancePanel, RiskScoreCard } from '@/components/dashboard/CompliancePanel'
import { useCompliance } from '@/hooks/useCompliance'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Shield, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

export default function CompliancePage() {
  const { complianceStats, tokens } = useCompliance()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
        <p className="text-muted-foreground">
          MiCA-safe tokenization strategy and regulatory compliance tracking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-norchain-500/10 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-norchain-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tokens.length}</p>
                <p className="text-xs text-muted-foreground">Tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 p-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{complianceStats.complete}</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{complianceStats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{complianceStats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-sm font-bold">{complianceStats.completionRate}%</p>
                </div>
                <Progress
                  value={complianceStats.completionRate}
                  className="h-2"
                  indicatorClassName="bg-norchain-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskScoreCard />
        <Card className="md:col-span-2">
          <CardContent className="py-4">
            <h3 className="font-medium mb-2">Regulatory Strategy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our &quot;Private First — Regulated Later&quot; approach ensures we avoid
              triggering EU MiCA regulations and Norwegian FSA oversight while
              building compliant infrastructure.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Key Principles:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• No public token sales</li>
                  <li>• KYC-gated transfers only</li>
                  <li>• Whitelist-based access</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Technical Controls:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Transfer restrictions on-chain</li>
                  <li>• Investor registry smart contract</li>
                  <li>• Pause mechanism for emergencies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Compliance Panel */}
      <CompliancePanel />
    </div>
  )
}

