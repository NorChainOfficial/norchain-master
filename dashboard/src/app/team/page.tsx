'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Users,
  UserPlus,
  Mail,
  MoreVertical,
  Shield,
  Crown,
  User,
  Eye,
  Search,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Edit3,
  UserMinus,
  Send,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Activity,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

interface TeamMember {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'pending' | 'active' | 'inactive'
  invited_at: string
  joined_at: string | null
  user: {
    id: string
    name: string
    email: string
    avatar_url: string
  }
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: User,
  viewer: Eye,
}

const roleColors = {
  owner: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  admin: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30',
  member: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  viewer: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
}

const statusColors = {
  pending: 'bg-amber-500',
  active: 'bg-emerald-500',
  inactive: 'bg-slate-400',
}

const roleDescriptions = {
  owner: 'Full access. Can manage all settings, billing, and delete the project.',
  admin: 'Can manage team members, settings, and all project content.',
  member: 'Can view and edit tasks, phases, and project content.',
  viewer: 'Read-only access to project content.',
}

type RoleType = 'admin' | 'member' | 'viewer'

export default function TeamPage() {
  const { currentProject } = useProject()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Dialog states
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  
  // Form states
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<RoleType>('member')
  const [editRole, setEditRole] = useState<RoleType>('member')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (currentProject?.id) {
      fetchTeam()
    }
  }, [currentProject?.id])

  const fetchTeam = async () => {
    if (!currentProject?.id) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/team?project_id=${currentProject.id}`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Failed to fetch team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !currentProject?.id) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/v1/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: currentProject.id,
          email: inviteEmail.trim(),
          name: inviteName.trim() || inviteEmail.split('@')[0],
          role: inviteRole,
        }),
      })
      
      if (response.ok) {
        await fetchTeam()
        setShowInviteDialog(false)
        setInviteEmail('')
        setInviteName('')
        setInviteRole('member')
      }
    } catch (error) {
      console.error('Failed to invite:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedMember) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/v1/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedMember.id,
          role: editRole,
        }),
      })
      
      if (response.ok) {
        await fetchTeam()
        setShowEditDialog(false)
        setSelectedMember(null)
      }
    } catch (error) {
      console.error('Failed to update role:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!selectedMember) return
    
    setSubmitting(true)
    try {
      const response = await fetch(`/api/v1/team?id=${selectedMember.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchTeam()
        setShowRemoveDialog(false)
        setSelectedMember(null)
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendInvite = async (member: TeamMember) => {
    console.log('Resending invite to:', member.user?.email)
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://norchain.org/invite/${currentProject?.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setEditRole(member.role === 'owner' ? 'admin' : member.role)
    setShowEditDialog(true)
  }

  const openRemoveDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowRemoveDialog(true)
  }

  const filteredMembers = members.filter(m =>
    m.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    admins: members.filter(m => m.role === 'admin' || m.role === 'owner').length,
  }

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center">
          <Users className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h2 className="text-xl font-semibold">No Project Selected</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Select a project from the dropdown to manage team members and permissions.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Team Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage team members and permissions for <span className="font-medium text-foreground">{currentProject.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchTeam} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowInviteDialog(true)} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="card-soft">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-soft">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-soft">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-soft">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.admins}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Invite Link */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleCopyInviteLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-emerald-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Invite Link
            </>
          )}
        </Button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No team members match your search' : 'No team members yet'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowInviteDialog(true)} variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite your first team member
              </Button>
            )}
          </div>
        ) : (
          filteredMembers.map((member) => {
            const RoleIcon = roleIcons[member.role]
            const isOwner = member.role === 'owner'
            
            return (
              <Card key={member.id} className="card-elevated hover:shadow-float transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={member.user?.avatar_url}
                        alt={member.user?.name}
                        size="lg"
                        status={member.status === 'active' ? 'online' : member.status === 'pending' ? 'away' : 'offline'}
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{member.user?.name || 'Unknown'}</h3>
                        <p className="text-sm text-muted-foreground truncate">{member.user?.email}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {member.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleResendInvite(member)}>
                            <Send className="h-4 w-4 mr-2" />
                            Resend Invite
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => openEditDialog(member)} disabled={isOwner}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openRemoveDialog(member)} 
                          disabled={isOwner}
                          className="text-red-600 focus:text-red-600"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`${roleColors[member.role]} border`}>
                      <RoleIcon className="h-3 w-3 mr-1.5" />
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`h-2 w-2 rounded-full ${statusColors[member.status]} ${member.status === 'active' ? 'animate-pulse' : ''}`} />
                      {member.status === 'active' ? 'Active' : member.status === 'pending' ? 'Pending' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Activity className="h-3 w-3" />
                      {member.joined_at 
                        ? `Joined ${new Date(member.joined_at).toLocaleDateString()}`
                        : `Invited ${new Date(member.invited_at).toLocaleDateString()}`
                      }
                    </span>
                    {isOwner && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Project Owner
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Enhanced Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-8 pb-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-3 text-white mb-2">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Invite Team Member</h2>
                  <p className="text-white/70 text-sm">Add collaborators to {currentProject.name}</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4">
              <Sparkles className="h-5 w-5 text-white/30" />
            </div>
            <div className="absolute bottom-4 right-8">
              <div className="flex -space-x-2">
                {['bg-pink-400', 'bg-yellow-400', 'bg-green-400'].map((color, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full ${color} border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white/80`}>
                    {['A', 'B', 'C'][i]}
                  </div>
                ))}
                <div className="h-8 w-8 rounded-full bg-white/20 border-2 border-white/20 flex items-center justify-center text-xs font-medium text-white">
                  +5
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Content - Overlapping Card Effect */}
          <div className="relative -mt-8 mx-4 mb-4">
            <div className="bg-card rounded-2xl border shadow-xl p-6 space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="invite-email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="h-12 text-base bg-muted/50 border-0 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="invite-name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="invite-name"
                  placeholder="John Doe"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="h-12 text-base bg-muted/50 border-0 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              
              {/* Role Selection - Card Style */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Role</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(['admin', 'member', 'viewer'] as const).map((role) => {
                    const Icon = roleIcons[role]
                    const isSelected = inviteRole === role
                    const colors = {
                      admin: 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400',
                      member: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400',
                      viewer: 'border-slate-400 bg-slate-400/10 text-slate-600 dark:text-slate-400',
                    }
                    
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setInviteRole(role)}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-200
                          ${isSelected 
                            ? colors[role] 
                            : 'border-transparent bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <Icon className="h-6 w-6 mb-2 mx-auto" />
                        <p className="font-medium text-sm capitalize">{role}</p>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {roleDescriptions[inviteRole]}
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 pb-6 pt-0 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setShowInviteDialog(false)} className="text-muted-foreground">
              Cancel
            </Button>
            <Button 
              onClick={handleInvite} 
              disabled={submitting || !inviteEmail.trim()}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 px-6"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Invite
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
          <div className="p-6 pb-4">
            <DialogHeader className="p-0">
              <DialogTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Edit3 className="h-5 w-5 text-violet-500" />
                </div>
                Change Role
              </DialogTitle>
              <DialogDescription className="mt-2">
                Update permissions for this team member
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {selectedMember && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <Avatar
                  src={selectedMember.user?.avatar_url}
                  alt={selectedMember.user?.name}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{selectedMember.user?.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{selectedMember.user?.email}</p>
                </div>
                <Badge className={`${roleColors[selectedMember.role]} border shrink-0`}>
                  {selectedMember.role}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="px-6 pb-4">
            <Label className="text-sm font-medium mb-3 block">New Role</Label>
            <div className="space-y-2">
              {(['admin', 'member', 'viewer'] as const).map((role) => {
                const Icon = roleIcons[role]
                const isSelected = editRole === role
                
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setEditRole(role)}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                      ${isSelected 
                        ? 'border-violet-500 bg-violet-500/5' 
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                      }
                    `}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-violet-500/20 text-violet-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium capitalize">{role}</p>
                      <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-violet-500" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={submitting}>
              {submitting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Remove Member Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-lg">Remove Team Member</DialogTitle>
                <DialogDescription>This action cannot be undone</DialogDescription>
              </div>
            </div>
            
            {selectedMember && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 mb-4">
                <Avatar
                  src={selectedMember.user?.avatar_url}
                  alt={selectedMember.user?.name}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{selectedMember.user?.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{selectedMember.user?.email}</p>
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <strong className="text-foreground">{selectedMember?.user?.name}</strong> from 
              the project? They will lose access immediately.
            </p>
          </div>
          
          <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember} disabled={submitting}>
              {submitting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
