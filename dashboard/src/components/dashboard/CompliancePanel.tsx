'use client'

import { useCompliance } from '@/hooks/useCompliance'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  Circle,
  Clock,
  Shield,
  Lock,
  Globe,
  AlertTriangle,
} from 'lucide-react'
import type { Token, ComplianceItem } from '@/types'

export function CompliancePanel() {
  const {
    tokens,
    checklistByCategory,
    complianceStats,
    strategy,
  } = useCompliance()

  return (
    <div className="space-y-6">
      {/* Strategy Banner */}
      <Card className="bg-norchain-500/5 border-norchain-500/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-norchain-400" />
            <div>
              <h3 className="font-semibold text-norchain-400">{strategy}</h3>
              <p className="text-sm text-muted-foreground">
                MiCA-safe tokenization approach for EU regulatory compliance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Cards */}
      <div>
        <h3 className="text-sm font-medium mb-3">Token Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <TokenCard key={token.symbol} token={token} />
          ))}
        </div>
      </div>

      {/* Compliance Progress */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Compliance Checklist</CardTitle>
            <Badge variant="outline">
              {complianceStats.complete}/{complianceStats.total} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{complianceStats.completionRate}%</span>
            </div>
            <Progress
              value={complianceStats.completionRate}
              className="h-2"
              indicatorClassName="bg-norchain-500"
            />
          </div>

          <Separator className="my-4" />

          <ScrollArea className="h-[300px]">
            <div className="space-y-6 pr-4">
              {Object.entries(checklistByCategory).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium mb-2">{category}</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <ComplianceChecklistItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

interface TokenCardProps {
  token: Token
}

export function TokenCard({ token }: TokenCardProps) {
  const isUtility = token.type === 'utility'

  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        isUtility
          ? 'border-success/30 bg-success/5'
          : 'border-warning/30 bg-warning/5'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white',
                isUtility ? 'bg-success' : 'bg-warning'
              )}
            >
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <CardTitle className="text-sm">{token.symbol}</CardTitle>
              <p className="text-xs text-muted-foreground">{token.name}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={isUtility ? 'success' : 'warning'}
              className="text-xs"
            >
              {token.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {token.tradability === 'public' ? (
                <Globe className="h-3 w-3 mr-1" />
              ) : (
                <Lock className="h-3 w-3 mr-1" />
              )}
              {token.tradability}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-3">
            {token.description}
          </p>

          <div className="flex items-center gap-1 text-xs">
            {token.kycRequired ? (
              <Badge variant="destructive" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                KYC Required
              </Badge>
            ) : (
              <Badge variant="success" className="text-xs">
                No KYC
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ComplianceChecklistItemProps {
  item: ComplianceItem
}

function ComplianceChecklistItem({ item }: ComplianceChecklistItemProps) {
  const StatusIcon =
    item.status === 'complete'
      ? CheckCircle2
      : item.status === 'in_progress'
        ? Clock
        : Circle

  const statusColors = {
    complete: 'text-success',
    in_progress: 'text-warning',
    pending: 'text-muted-foreground',
  }

  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
      <StatusIcon className={cn('h-4 w-4 shrink-0', statusColors[item.status])} />
      <span className="flex-1 text-sm">{item.item}</span>
      {item.required && (
        <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
      )}
    </div>
  )
}

// Risk Score Card
export function RiskScoreCard() {
  const { complianceStats } = useCompliance()

  // Calculate a simple risk score (higher completion = lower risk)
  const riskScore = 100 - complianceStats.completionRate
  const riskLevel =
    riskScore > 60 ? 'High' : riskScore > 30 ? 'Medium' : 'Low'
  const riskColor =
    riskLevel === 'High'
      ? 'text-destructive'
      : riskLevel === 'Medium'
        ? 'text-warning'
        : 'text-success'

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Risk Level</p>
            <p className={cn('text-2xl font-bold', riskColor)}>{riskLevel}</p>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              riskLevel === 'High'
                ? 'bg-destructive/10'
                : riskLevel === 'Medium'
                  ? 'bg-warning/10'
                  : 'bg-success/10'
            )}
          >
            <AlertTriangle className={cn('h-6 w-6', riskColor)} />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Based on {complianceStats.pending} pending compliance items
        </p>
      </CardContent>
    </Card>
  )
}

// Compact version for dashboard
export function ComplianceStatus() {
  const { complianceStats, tokens } = useCompliance()

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Compliance</span>
        <span className="text-sm font-medium">{complianceStats.completionRate}%</span>
      </div>
      <Progress
        value={complianceStats.completionRate}
        className="h-1.5"
        indicatorClassName="bg-norchain-400"
      />

      {/* Token Summary */}
      <div className="flex items-center gap-2">
        {tokens.map((token) => (
          <Badge
            key={token.symbol}
            variant={token.type === 'utility' ? 'success' : 'warning'}
            className="text-xs"
          >
            {token.symbol}
          </Badge>
        ))}
      </div>
    </div>
  )
}

