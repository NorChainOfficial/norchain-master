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

// Fetch activity feed across all repos
export async function fetchActivityFeed(repoNames: string[], limit = 20): Promise<Activity[]> {
  const activities: Activity[] = []
  
  try {
    // Fetch recent commits from each repo
    const commitPromises = repoNames.slice(0, 5).map(async (repoName) => {
      const commits = await fetchRepoCommits(repoName, 5)
      return commits.map((commit): Activity => ({
        id: commit.sha,
        type: 'commit',
        repo: repoName,
        title: commit.commit.message.split('\n')[0],
        author: commit.author?.login || commit.commit.author.name,
        authorAvatar: commit.author?.avatar_url,
        timestamp: commit.commit.author.date,
        url: commit.html_url,
      }))
    })
    
    const commitResults = await Promise.all(commitPromises)
    commitResults.forEach((commits) => activities.push(...commits))
    
    // Sort by timestamp and limit
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    return activities.slice(0, limit)
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

