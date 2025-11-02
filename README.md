# Next.js Documentation MCP Server

The fastest offline Next.js documentation server for AI coding assistants using Model Context Protocol (MCP).

## Features

- **Offline-First**: Works without internet connectivity
- **Fast Search**: Sub-second response times using FlexSearch
- **Version-Aware**: Search across Next.js versions (13, 14, 15)
- **Code-Rich**: Every result includes working code examples
- **Privacy-First**: No external API calls or tracking
- **Production-Ready**: Built with TypeScript and Next.js 16

## Prerequisites

- Node.js 18+ 
- npm/pnpm/yarn
- Git (for cloning Next.js docs)

## Installation

### 1. Clone this repository
```bash
git clone <your-repo-url>
cd nextjs-docs-mcp
npm install
```

### 2. Download Next.js Documentation
```bash
mkdir -p docs-data
cd docs-data
git init
git remote add origin https://github.com/vercel/next.js.git
git config core.sparseCheckout true
echo "docs/*" >> .git/info/sparse-checkout
git pull --depth 1 origin canary
cd ..
```

### 3. Process Documentation
```bash
npm run process-docs
npm run build:index
```

### 4. Start Server
```bash
npm run dev
```

## MCP Client Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "nextjs-docs": {
      "command": "node",
      "args": ["/path/to/nextjs-docs-mcp/.next/server/app/api/sse/route.js"]
    }
  }
}
```

### Cursor / Windsurf

Configure MCP endpoint: `http://localhost:3000/api/sse`

## Available Tools

### `search_nextjs_docs`
Search Next.js documentation with filters
- `query`: Search query or question
- `version`: Filter by version (13, 14, 15, latest)
- `category`: Filter by category
- `limit`: Max results (1-50)
- `includeCodeExamples`: Include code blocks

### `get_nextjs_doc`
Get full documentation page by ID

### `list_nextjs_categories`
Get available categories and statistics

## Configuration

Create `.env.local`:
```bash
# Optional: Upstash Redis for caching
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Optional: Enable verbose logging
MCP_VERBOSE_LOGS=false
```

## Deployment to Vercel

```bash
vercel
```

Ensure environment variables are set in Vercel dashboard.

## Architecture

- **Search Engine**: FlexSearch with BM25 ranking
- **Cache Layer**: Optional Upstash Redis
- **MCP Handler**: Vercel mcp-handler
- **Documentation**: Processed MDX files from Next.js repo

## Performance

- Search: <100ms (in-memory)
- Cache Hit: <50ms (Redis)
- First Load: ~2s (index loading)
- Memory: ~50MB (index + runtime)

## License

MIT

## Credits

Built for the Next.js community. Documentation source: [Next.js](https://github.com/vercel/next.js)
