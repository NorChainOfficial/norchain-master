import type { GitHubRepo, GitHubCommit, GitHubIssue, GitHubPR, Activity, RepositoryStats } from '@/types'
import { getRepoHealthStatus } from './utils'

const GITHUB_API_BASE = 'https://api.github.com'
const ORG_NAME = 'NorChainOfficial'

// Get token from environment or use unauthenticated (rate limited)
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  }
  
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}

// Fetch all repositories for the organization
export async function fetchOrgRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${ORG_NAME}/repos?per_page=100&sort=updated`,
      { headers: getHeaders(), next: { revalidate: 300 } }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Failed to fetch repos:', error)
    return []
  }
}

// Fetch repository details
export async function fetchRepo(repoName: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}`,
      { headers: getHeaders(), next: { revalidate: 300 } }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error(`Failed to fetch repo ${repoName}:`, error)
    return null
  }
}

// Fetch recent commits for a repository
export async function fetchRepoCommits(repoName: string, count = 10): Promise<GitHubCommit[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/commits?per_page=${count}`,
      { headers: getHeaders(), next: { revalidate: 60 } }
    )
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error(`Failed to fetch commits for ${repoName}:`, error)
    return []
  }
}

// Fetch open issues for a repository
export async function fetchRepoIssues(repoName: string, state = 'open'): Promise<GitHubIssue[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/issues?state=${state}&per_page=100`,
      { headers: getHeaders(), next: { revalidate: 60 } }
    )
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error(`Failed to fetch issues for ${repoName}:`, error)
    return []
  }
}

// Fetch pull requests for a repository
export async function fetchRepoPRs(repoName: string, state = 'open'): Promise<GitHubPR[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${ORG_NAME}/${repoName}/pulls?state=${state}&per_page=100`,
      { headers: getHeaders(), next: { revalidate: 60 } }
    )
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error(`Failed to fetch PRs for ${repoName}:`, error)
    return []
  }
}

// Fetch repository stats
export async function fetchRepoStats(repoName: string): Promise<RepositoryStats | null> {
  try {
    const [repo, commits] = await Promise.all([
      fetchRepo(repoName),
      fetchRepoCommits(repoName, 1),
    ])
    
    if (!repo) return null
    
    const lastCommitDate = commits[0]?.commit?.author?.date || repo.pushed_at
    const daysSinceLastCommit = Math.floor(
      (Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return {
      name: repo.name,
      openIssues: repo.open_issues_count,
      openPRs: 0, // Would need separate call
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      lastCommit: lastCommitDate,
      lastActivity: repo.updated_at,
      health: getRepoHealthStatus(daysSinceLastCommit, repo.open_issues_count),
    }
  } catch (error) {
    console.error(`Failed to fetch stats for ${repoName}:`, error)
    return null
  }
}

// GitHub Event types we care about
interface GitHubEvent {
  id: string
  type: string
  actor: {
    login: string
    avatar_url: string
  }
  repo: {
    name: string
    url: string
  }
  payload: {
    action?: string
    ref?: string
    ref_type?: string
    commits?: Array<{
      sha: string
      message: string
      url: string
    }>
    pull_request?: {
      title: string
      html_url: string
      number: number
      merged?: boolean
    }
    issue?: {
      title: string
      html_url: string
      number: number
    }
    release?: {
      tag_name: string
      name: string
      html_url: string
    }
    comment?: {
      html_url: string
      body: string
    }
    forkee?: {
      full_name: string
      html_url: string
    }
  }
  created_at: string
}

// Fetch organization events (all activity across all repos)
export async function fetchOrgEvents(limit = 50): Promise<GitHubEvent[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${ORG_NAME}/events?per_page=${Math.min(limit, 100)}`,
      { headers: getHeaders(), next: { revalidate: 60 } }
    )
    
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`)
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error('Failed to fetch org events:', error)
    return []
  }
}

// Convert GitHub event to our Activity type
function eventToActivity(event: GitHubEvent): Activity | Activity[] | null {
  const repoName = event.repo.name.replace(`${ORG_NAME}/`, '')
  const baseActivity = {
    author: event.actor.login,
    authorAvatar: event.actor.avatar_url,
    timestamp: event.created_at,
    repo: repoName,
  }

  switch (event.type) {
    case 'PushEvent':
      // Return all commits as separate activities
      if (event.payload.commits && event.payload.commits.length > 0) {
        return event.payload.commits.map((commit, index) => ({
          ...baseActivity,
          id: `${event.id}-${index}`,
          type: 'commit' as const,
          title: commit.message.split('\n')[0],
          url: `https://github.com/${ORG_NAME}/${repoName}/commit/${commit.sha}`,
        }))
      }
      return null

    case 'PullRequestEvent':
      if (event.payload.pull_request) {
        const action = event.payload.action
        const pr = event.payload.pull_request
        let title = `${action === 'opened' ? 'Opened' : action === 'closed' ? (pr.merged ? 'Merged' : 'Closed') : action} PR: ${pr.title}`
        return {
          ...baseActivity,
          id: event.id,
          type: 'pr' as const,
          title,
          url: pr.html_url,
        }
      }
      return null

    case 'IssuesEvent':
      if (event.payload.issue) {
        const action = event.payload.action
        return {
          ...baseActivity,
          id: event.id,
          type: 'issue' as const,
          title: `${action === 'opened' ? 'Opened' : action === 'closed' ? 'Closed' : action} issue: ${event.payload.issue.title}`,
          url: event.payload.issue.html_url,
        }
      }
      return null

    case 'IssueCommentEvent':
      if (event.payload.comment && event.payload.issue) {
        return {
          ...baseActivity,
          id: event.id,
          type: 'issue' as const,
          title: `Commented on: ${event.payload.issue.title}`,
          url: event.payload.comment.html_url,
        }
      }
      return null

    case 'ReleaseEvent':
      if (event.payload.release) {
        return {
          ...baseActivity,
          id: event.id,
          type: 'release' as const,
          title: `Released ${event.payload.release.tag_name}: ${event.payload.release.name || 'New release'}`,
          url: event.payload.release.html_url,
        }
      }
      return null

    case 'CreateEvent':
      if (event.payload.ref_type === 'branch') {
        return {
          ...baseActivity,
          id: event.id,
          type: 'commit' as const,
          title: `Created branch: ${event.payload.ref}`,
          url: `https://github.com/${ORG_NAME}/${repoName}/tree/${event.payload.ref}`,
        }
      } else if (event.payload.ref_type === 'tag') {
        return {
          ...baseActivity,
          id: event.id,
          type: 'release' as const,
          title: `Created tag: ${event.payload.ref}`,
          url: `https://github.com/${ORG_NAME}/${repoName}/releases/tag/${event.payload.ref}`,
        }
      } else if (event.payload.ref_type === 'repository') {
        return {
          ...baseActivity,
          id: event.id,
          type: 'milestone' as const,
          title: `Created repository: ${repoName}`,
          url: `https://github.com/${ORG_NAME}/${repoName}`,
        }
      }
      return null

    case 'DeleteEvent':
      return {
        ...baseActivity,
        id: event.id,
        type: 'commit' as const,
        title: `Deleted ${event.payload.ref_type}: ${event.payload.ref}`,
        url: `https://github.com/${ORG_NAME}/${repoName}`,
      }

    case 'ForkEvent':
      if (event.payload.forkee) {
        return {
          ...baseActivity,
          id: event.id,
          type: 'milestone' as const,
          title: `Forked to ${event.payload.forkee.full_name}`,
          url: event.payload.forkee.html_url,
        }
      }
      return null

    case 'WatchEvent':
      return {
        ...baseActivity,
        id: event.id,
        type: 'milestone' as const,
        title: `Starred ${repoName}`,
        url: `https://github.com/${ORG_NAME}/${repoName}`,
      }

    case 'PullRequestReviewEvent':
      if (event.payload.pull_request) {
        return {
          ...baseActivity,
          id: event.id,
          type: 'pr' as const,
          title: `Reviewed PR: ${event.payload.pull_request.title}`,
          url: event.payload.pull_request.html_url,
        }
      }
      return null

    case 'PullRequestReviewCommentEvent':
      if (event.payload.pull_request && event.payload.comment) {
        return {
          ...baseActivity,
          id: event.id,
          type: 'pr' as const,
          title: `Commented on PR: ${event.payload.pull_request.title}`,
          url: event.payload.comment.html_url,
        }
      }
      return null

    default:
      return null
  }
}

// Fetch activity feed using GitHub Events API
export async function fetchActivityFeed(repoNames: string[], limit = 20): Promise<Activity[]> {
  try {
    // Use the org events endpoint for comprehensive activity
    const events = await fetchOrgEvents(100)
    
    const activities: Activity[] = []
    
    for (const event of events) {
      const activity = eventToActivity(event)
      if (activity) {
        if (Array.isArray(activity)) {
          activities.push(...activity)
        } else {
          activities.push(activity)
        }
      }
    }
    
    // Filter by repo names if specified
    let filteredActivities = activities
    if (repoNames.length > 0) {
      filteredActivities = activities.filter(a => repoNames.includes(a.repo))
    }
    
    // Sort by timestamp (newest first) and limit
    filteredActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    return filteredActivities.slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch activity feed:', error)
    return []
  }
}

// Batch fetch stats for multiple repos
export async function fetchAllRepoStats(repoNames: string[]): Promise<Map<string, RepositoryStats>> {
  const statsMap = new Map<string, RepositoryStats>()
  
  // Fetch in parallel with rate limiting
  const batchSize = 5
  for (let i = 0; i < repoNames.length; i += batchSize) {
    const batch = repoNames.slice(i, i + batchSize)
    const results = await Promise.all(
      batch.map((name) => fetchRepoStats(name))
    )
    
    results.forEach((stats, index) => {
      if (stats) {
        statsMap.set(batch[index], stats)
      }
    })
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < repoNames.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  
  return statsMap
}
