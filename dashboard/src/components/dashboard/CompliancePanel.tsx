'use client'

import { useCompliance } from '@/hooks/useCompliance'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Zap,
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
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 shrink-0">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-primary text-lg leading-tight">{strategy}</h3>
              <p className="text-sm text-muted-foreground leading-tight mt-1">
                MiCA-safe tokenization approach for EU regulatory compliance
              </p>
            </div>
          </div>
        </CardContent>
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      </Card>

      {/* Token Cards */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <Zap className="h-5 w-5 text-muted-foreground shrink-0" />
          <h3 className="font-semibold leading-none">Token Classification</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tokens.map((token, index) => (
            <TokenCard key={token.symbol} token={token} index={index} />
          ))}
        </div>
      </div>

      {/* Compliance Progress */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Compliance Checklist</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums">{complianceStats.completionRate}%</span>
              <span className="text-xs text-muted-foreground">complete</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
                  style={{ width: `${complianceStats.completionRate}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {complianceStats.complete}/{complianceStats.total}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Complete ({complianceStats.complete})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">In Progress ({complianceStats.inProgress})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Pending ({complianceStats.pending})</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <ScrollArea className="h-[300px]">
            <div className="space-y-6 pr-4">
              {Object.entries(checklistByCategory).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <ComplianceChecklistItem key={item.id} item={item} index={index} />
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
  index: number
}

export function TokenCard({ token, index }: TokenCardProps) {
  const isUtility = token.type === 'utility'

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20',
        'hover:-translate-y-1',
        'animate-slide-up opacity-0',
        isUtility
          ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10'
          : 'border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10'
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white shadow-lg shrink-0',
                isUtility 
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20' 
                  : 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20'
              )}
            >
              {token.symbol.slice(0, 2)}
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-semibold leading-tight">{token.symbol}</p>
              <p className="text-sm text-muted-foreground leading-tight">{token.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge
            className={cn(
              'text-[10px]',
              isUtility 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            )}
          >
            {token.type}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {token.tradability === 'public' ? (
              <Globe className="h-3 w-3 mr-1" />
            ) : (
              <Lock className="h-3 w-3 mr-1" />
            )}
            {token.tradability}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {token.description}
        </p>

        <div className="pt-3 border-t">
          {token.kycRequired ? (
            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium">
              <Lock className="h-3 w-3" />
              KYC Required
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
              <CheckCircle2 className="h-3 w-3" />
              No KYC Required
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ComplianceChecklistItemProps {
  item: ComplianceItem
  index: number
}

function ComplianceChecklistItem({ item, index }: ComplianceChecklistItemProps) {
  const StatusIcon =
    item.status === 'complete'
      ? CheckCircle2
      : item.status === 'in_progress'
        ? Clock
        : Circle

  const statusConfig = {
    complete: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    in_progress: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    pending: { color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
  }

  const config = statusConfig[item.status]

  return (
    <div 
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-200',
        'hover:bg-muted/50',
        config.border,
        'animate-slide-up opacity-0'
      )}
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
    >
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', config.bg)}>
        <StatusIcon className={cn('h-[18px] w-[18px]', config.color)} />
      </div>
      <span className="flex-1 leading-tight">{item.item}</span>
      {item.required && (
        <AlertTriangle className="h-[18px] w-[18px] text-amber-500 shrink-0" />
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
  
  const riskConfig = {
    High: { color: 'text-red-500', bg: 'bg-red-500/10', gradient: 'from-red-500 to-red-600' },
    Medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', gradient: 'from-amber-500 to-amber-600' },
    Low: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', gradient: 'from-emerald-500 to-emerald-600' },
  }

  const config = riskConfig[riskLevel]

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
            <p className={cn('text-3xl font-bold', config.color)}>{riskLevel}</p>
          </div>
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl',
              config.bg
            )}
          >
            <AlertTriangle className={cn('h-7 w-7', config.color)} />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
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
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-sm font-bold tabular-nums">{complianceStats.completionRate}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${complianceStats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-lg bg-emerald-500/10">
          <p className="text-lg font-bold text-emerald-500 tabular-nums">{complianceStats.complete}</p>
          <p className="text-[10px] text-muted-foreground">Complete</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-amber-500/10">
          <p className="text-lg font-bold text-amber-500 tabular-nums">{complianceStats.inProgress}</p>
          <p className="text-[10px] text-muted-foreground">In Progress</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted">
          <p className="text-lg font-bold tabular-nums">{complianceStats.pending}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Token Summary */}
      <div className="pt-3 border-t">
        <p className="text-xs text-muted-foreground mb-2">Token Classification</p>
        <div className="flex items-center gap-2">
          {tokens.map((token) => (
            <Badge
              key={token.symbol}
              className={cn(
                'text-[10px]',
                token.type === 'utility' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              )}
            >
              {token.symbol}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
