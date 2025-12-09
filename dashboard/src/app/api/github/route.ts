import { NextResponse } from 'next/server'

const GITHUB_API_BASE = 'https://api.github.com'
const ORG_NAME = 'NorChainOfficial'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint parameter is required' },
      { status: 400 }
    )
  }

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    // Use server-side token for better rate limits
    const token = process.env.GITHUB_TOKEN
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const url = `${GITHUB_API_BASE}${endpoint}`
    const response = await fetch(url, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('GitHub API proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

