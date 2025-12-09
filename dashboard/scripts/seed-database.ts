/**
 * Seed the Supabase database with initial NorChain PM Dashboard data
 * 
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.error('   Set these environment variables and try again.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read JSON data files
function readDataFile(filename: string) {
  const filePath = path.join(process.cwd(), 'src/data', filename)
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }
  return null
}

async function seedPhases() {
  console.log('🔄 Seeding phases...')
  
  const phasesData = readDataFile('phases.json')
  if (!phasesData) {
    console.log('   ⚠️ No phases.json found, skipping')
    return
  }

  for (const phase of phasesData) {
    const { deliverables, ...phaseData } = phase
    
    // Insert phase
    const { data: insertedPhase, error: phaseError } = await supabase
      .from('phases')
      .upsert({
        id: phase.id,
        name: phase.name,
        focus: phase.focus,
        duration: phase.duration,
        status: phase.status,
        progress: phase.progress,
        sort_order: phase.id
      }, { onConflict: 'id' })
      .select()
      .single()
    
    if (phaseError) {
      console.error(`   ❌ Error inserting phase ${phase.id}:`, phaseError.message)
      continue
    }
    
    // Insert deliverables
    if (deliverables && deliverables.length > 0) {
      for (let i = 0; i < deliverables.length; i++) {
        const del = deliverables[i]
        const { error: delError } = await supabase
          .from('deliverables')
          .upsert({
            phase_id: phase.id,
            name: del.name,
            description: del.description || null,
            status: del.status,
            sort_order: i
          }, { onConflict: 'phase_id,name', ignoreDuplicates: true })
        
        if (delError && !delError.message.includes('duplicate')) {
          console.error(`   ❌ Error inserting deliverable:`, delError.message)
        }
      }
    }
  }
  
  console.log(`   ✅ Seeded ${phasesData.length} phases`)
}

async function seedTasks() {
  console.log('🔄 Seeding tasks...')
  
  const tasksData = readDataFile('tasks.json')
  if (!tasksData) {
    console.log('   ⚠️ No tasks.json found, skipping')
    return
  }

  for (const task of tasksData) {
    const { error } = await supabase
      .from('tasks')
      .upsert({
        id: task.id,
        title: task.title,
        description: task.description || null,
        role: task.role,
        phase_id: task.phase,
        priority: task.priority,
        complexity: task.complexity,
        status: task.status
      }, { onConflict: 'id' })
    
    if (error) {
      console.error(`   ❌ Error inserting task ${task.id}:`, error.message)
    }
  }
  
  console.log(`   ✅ Seeded ${tasksData.length} tasks`)
}

async function seedRepositories() {
  console.log('🔄 Seeding repositories...')
  
  const reposData = readDataFile('repos.json')
  if (!reposData) {
    console.log('   ⚠️ No repos.json found, skipping')
    return
  }

  for (const repo of reposData) {
    const { error } = await supabase
      .from('repositories')
      .upsert({
        name: repo.name,
        description: repo.description,
        url: repo.url,
        visibility: repo.visibility,
        category: repo.category,
        phase_id: repo.phase,
        default_branch: repo.defaultBranch || 'main'
      }, { onConflict: 'name' })
    
    if (error) {
      console.error(`   ❌ Error inserting repo ${repo.name}:`, error.message)
    }
  }
  
  console.log(`   ✅ Seeded ${reposData.length} repositories`)
}

async function seedCompliance() {
  console.log('🔄 Seeding compliance data...')
  
  const complianceData = readDataFile('compliance.json')
  if (!complianceData) {
    console.log('   ⚠️ No compliance.json found, skipping')
    return
  }

  // Seed tokens
  if (complianceData.tokens) {
    for (const token of complianceData.tokens) {
      const { error } = await supabase
        .from('tokens')
        .upsert({
          symbol: token.symbol,
          name: token.name,
          type: token.type,
          tradability: token.tradability,
          kyc_required: token.kycRequired,
          description: token.description
        }, { onConflict: 'symbol' })
      
      if (error) {
        console.error(`   ❌ Error inserting token ${token.symbol}:`, error.message)
      }
    }
    console.log(`   ✅ Seeded ${complianceData.tokens.length} tokens`)
  }

  // Seed compliance checklist
  if (complianceData.checklist) {
    for (const item of complianceData.checklist) {
      const { error } = await supabase
        .from('compliance_items')
        .upsert({
          id: item.id,
          category: item.category,
          item: item.item,
          status: item.status,
          required: item.required
        }, { onConflict: 'id' })
      
      if (error) {
        console.error(`   ❌ Error inserting compliance item ${item.id}:`, error.message)
      }
    }
    console.log(`   ✅ Seeded ${complianceData.checklist.length} compliance items`)
  }

  // Seed strategy setting
  if (complianceData.strategy) {
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'compliance_strategy',
        value: complianceData.strategy
      }, { onConflict: 'key' })
    
    if (error) {
      console.error(`   ❌ Error inserting strategy:`, error.message)
    }
  }
}

async function main() {
  console.log('🚀 Starting database seed...\n')
  
  try {
    await seedPhases()
    await seedTasks()
    await seedRepositories()
    await seedCompliance()
    
    console.log('\n✨ Database seeded successfully!')
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

main()

