# NorChain PM Dashboard

A standalone Next.js 14 dashboard application that provides real-time visibility into the NorChain ecosystem development progress.

## Features

- **Phase Progress** - Visual progress bars for all 10 development phases
- **Repository Health Grid** - Status indicators for all 14+ repositories
- **Task Board (Kanban)** - Filter tasks by role and phase
- **Compliance Dashboard** - Token classification and regulatory checklist
- **Activity Feed** - Recent commits, issues, and PRs across repos

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| State | React Query (TanStack Query) |
| Charts | Recharts |
| Data | GitHub API + Local JSON |

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token (optional, for higher API rate limits)
- Access to NorChainOfficial organization

### Installation

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env.local

# Add your GitHub token for better rate limits
# GITHUB_TOKEN=your_token_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

```bash
# Parse docs and build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Main dashboard
│   │   ├── phases/page.tsx     # Phase detail view
│   │   ├── repos/page.tsx      # Repository grid
│   │   ├── tasks/page.tsx      # Task board
│   │   ├── compliance/page.tsx # Compliance view
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── dashboard/          # Dashboard-specific components
│   ├── lib/
│   │   ├── github.ts           # GitHub API client
│   │   └── utils.ts            # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── data/                   # Static JSON data
│   └── types/                  # TypeScript types
├── scripts/
│   └── parse-docs.ts           # Markdown to JSON parser
└── public/
```

## Data Sources

### Static Data (from docs/)
- `ROADMAP.md` → phases.json
- `DEVELOPER_TASKS.md` → tasks.json
- `LEGAL_COMPLIANCE_ROADMAP.md` → compliance.json
- `REPOSITORY_STRUCTURE.md` → repos.json

### Dynamic Data (GitHub API)
- Repository stats (issues, PRs, commits)
- Activity feed
- Contributor activity

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | Server-side GitHub token for API requests | No |
| `NEXT_PUBLIC_GITHUB_TOKEN` | Client-side GitHub token | No |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Parse docs and build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run parse-docs` | Parse markdown docs into JSON |

## Design

- Dark theme by default (professional, developer-focused)
- NorChain brand colors as accents
- Clean, minimal UI inspired by Linear/Vercel dashboards
- Responsive down to tablet

## License

MIT © NorChain

