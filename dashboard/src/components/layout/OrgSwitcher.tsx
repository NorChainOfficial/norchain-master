'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus, Building2, Check, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useProject } from '@/contexts/ProjectContext'
import Image from 'next/image'

export function OrgSwitcher() {
  const [open, setOpen] = React.useState(false)
  const { currentOrg, organizations, setCurrentOrg } = useProject()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 py-2 h-auto hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            {currentOrg?.logo_url ? (
              <Image
                src={currentOrg.logo_url}
                alt={currentOrg.name}
                width={32}
                height={32}
                className="rounded-lg"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">
                {currentOrg?.name || 'Select Organization'}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentOrg?.slug ? `@${currentOrg.slug}` : 'No org selected'}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.slug}
                  onSelect={() => {
                    setCurrentOrg(org)
                    setOpen(false)
                  }}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  {org.logo_url ? (
                    <Image
                      src={org.logo_url}
                      alt={org.name}
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center">
                      <Building2 className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">{org.name}</span>
                    <span className="text-xs text-muted-foreground">@{org.slug}</span>
                  </div>
                  {currentOrg?.id === org.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem className="flex items-center gap-2 px-3 py-2">
                <Plus className="h-4 w-4" />
                <span>Create Organization</span>
              </CommandItem>
              <CommandItem className="flex items-center gap-2 px-3 py-2">
                <Settings className="h-4 w-4" />
                <span>Manage Organizations</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

