import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// Read JSON files dynamically (not cached at build time)
function readJsonFile(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/data', filename)
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  // Force dynamic - no caching
  const headers = {
    'Cache-Control': 'no-store, max-age=0',
  }

  switch (type) {
    case 'phases':
      return NextResponse.json(readJsonFile('phases.json'), { headers })
    case 'tasks':
      return NextResponse.json(readJsonFile('tasks.json'), { headers })
    case 'repos':
      return NextResponse.json(readJsonFile('repos.json'), { headers })
    case 'compliance':
      return NextResponse.json(readJsonFile('compliance.json'), { headers })
    case 'all':
      return NextResponse.json({
        phases: readJsonFile('phases.json'),
        tasks: readJsonFile('tasks.json'),
        repos: readJsonFile('repos.json'),
        compliance: readJsonFile('compliance.json'),
        updatedAt: new Date().toISOString(),
      }, { headers })
    default:
      return NextResponse.json(
        { error: 'Invalid type. Use: phases, tasks, repos, compliance, or all' },
        { status: 400, headers }
      )
  }
}

