'use client'

import { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { MentionInput } from '@/components/ui/mention-input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MessageSquare,
  Send,
  MoreVertical,
  Edit2,
  Trash2,
  Reply,
  RefreshCw,
} from 'lucide-react'

interface User {
  id: string
  name: string
  email?: string
  avatar_url?: string
}

interface Comment {
  id: string
  content: string
  user: User
  created_at: string
  updated_at: string
  is_edited: boolean
  replies?: Comment[]
}

interface CommentThreadProps {
  entityType: string
  entityId: string
  currentUserId?: string
  users?: User[]
  className?: string
}

export function CommentThread({
  entityType,
  entityId,
  currentUserId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Demo user
  users = [],
  className,
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [entityType, entityId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/v1/comments?entity_type=${entityType}&entity_id=${entityId}`
      )
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (parentId?: string) => {
    const content = parentId ? replyContent : newComment
    if (!content.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/v1/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          user_id: currentUserId,
          content,
          parent_id: parentId,
        }),
      })

      if (response.ok) {
        if (parentId) {
          setReplyContent('')
          setReplyingTo(null)
        } else {
          setNewComment('')
        }
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/v1/comments?id=${commentId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={cn(
        'group animate-fade-in',
        isReply ? 'ml-12 mt-3' : 'py-4'
      )}
    >
      <div className="flex gap-3">
        <Avatar
          src={comment.user?.avatar_url}
          alt={comment.user?.name}
          size={isReply ? 'sm' : 'md'}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(comment.created_at)}
            </span>
            {comment.is_edited && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>
          
          <div className="text-sm text-foreground/90 whitespace-pre-wrap">
            {comment.content.split(/(@\w+)/g).map((part, i) =>
              part.startsWith('@') ? (
                <span key={i} className="mention">{part}</span>
              ) : (
                part
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </button>
            {comment.user?.id === currentUserId && (
              <>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.user?.name}...`}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-muted border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(comment.id)
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => handleSubmit(comment.id)}
                disabled={!replyContent.trim() || submitting}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 border-l-2 border-border pl-3">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>
        </div>
        <button
          onClick={fetchComments}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          disabled={loading}
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-1 divide-y">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">No comments yet</p>
            <p className="text-xs">Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>

      {/* New Comment Input */}
      <div className="mt-4 pt-4 border-t">
        <MentionInput
          users={users}
          value={newComment}
          onChange={setNewComment}
          placeholder="Write a comment... Use @ to mention someone"
        />
        <div className="flex justify-end mt-2">
          <Button
            onClick={() => handleSubmit()}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CommentThread

