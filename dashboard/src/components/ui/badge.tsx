import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning:
          'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        // Role badges
        blockchain: 'border-transparent bg-orange-500/20 text-orange-400',
        contract: 'border-transparent bg-purple-500/20 text-purple-400',
        backend: 'border-transparent bg-blue-500/20 text-blue-400',
        frontend: 'border-transparent bg-green-500/20 text-green-400',
        mobile: 'border-transparent bg-pink-500/20 text-pink-400',
        devops: 'border-transparent bg-yellow-500/20 text-yellow-400',
        // Status badges
        pending: 'border-transparent bg-muted text-muted-foreground',
        active: 'border-transparent bg-norchain-500/20 text-norchain-400',
        complete: 'border-transparent bg-success/20 text-success',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

