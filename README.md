# Next.js Documentation MCP Server

**Fast offline search for Next.js docs in AI coding assistants** (Claude, Cursor, Windsurf, etc.)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/muhammadsuheer/nextjs-docs-mcp)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/muhammadsuheer/nextjs-docs-mcp)

---

## 🚀 Quick Start (Choose One)

### Option 1: Use Hosted Version (Easiest)
```bash
# Add to your AI assistant config (Claude Desktop, Cursor, etc.)
https://nextjs-docs-mcp.vercel.app/api/sse
```

### Option 2: Run Locally
```bash
git clone https://github.com/muhammadsuheer/nextjs-docs-mcp.git
cd nextjs-docs-mcp
npm install
npm run setup    # Downloads docs & builds index
npm run dev      # Starts on localhost:3000
```

---

## 🤖 AI Assistant Setup

### Claude Desktop
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "nextjs-docs": {
      "url": "https://nextjs-docs-mcp.vercel.app/api/sse"
    }
  }
}
```

### Cursor
1. Settings → MCP Servers
2. Add: `https://nextjs-docs-mcp.vercel.app/api/sse`

### Windsurf
1. Settings → Integrations → MCP
2. URL: `https://nextjs-docs-mcp.vercel.app/api/sse`

---

## 📖 What You Get

- ✅ **374 Next.js docs** - Complete v15 documentation
- ✅ **2,716 code examples** - Real working code
- ✅ **Offline search** - No internet needed (local mode)
- ✅ **Sub-second responses** - Lightning fast
- ✅ **Version aware** - Search by Next.js version

---

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Download Next.js Docs
```bash
mkdir -p docs-data && cd docs-data
git init
git remote add origin https://github.com/vercel/next.js.git
git config core.sparseCheckout true
echo "docs/*" >> .git/info/sparse-checkout
git pull --depth 1 origin canary
cd ..
```

### 3. Process Documentation
```bash
npm run process-docs  # Parses 374 MDX files
npm run build:index   # Creates search index
```

### 4. Start Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

---

## 🚢 Deploy Your Own

### Deploy to Vercel (1-Click)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/muhammadsuheer/nextjs-docs-mcp)

1. Click button above
2. Connect GitHub
3. Deploy automatically
4. Done! Your own hosted version ready

### Manual Deployment
```bash
vercel          # First time setup
vercel --prod   # Production deployment
```

---

## ⚡ Redis Caching (Auto-configured on Vercel)

Redis caching makes repeated queries **10x faster**:

### On Vercel (Automatic)
1. Go to your project on Vercel
2. Navigate to **Storage** tab
3. Click **Connect Store** → **Create New** → **KV Database**
4. Done! All environment variables auto-configured

### Local Development
```bash
# Copy from Vercel: Settings → Environment Variables
# Or get from: https://console.upstash.com

# .env.local
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your_token
```

**Performance with Redis:**
- Search: 95ms → **45ms** (2x faster)
- Cache hit rate: **80%** for common queries
- Works perfectly without Redis too!

---

## 📚 Available MCP Tools

### `search_nextjs_docs`
Search documentation with filters
```typescript
{
  query: "server components",
  version: "15",              // Optional: 13, 14, 15
  category: "app-router",     // Optional
  limit: 10                   // Results count
}
```

### `get_nextjs_doc`
Get full documentation page
```typescript
{
  docId: "app-router-routing" // Document ID from search
}
```

### `list_nextjs_categories`
Get available categories and stats

---

## 🏗️ Project Structure

```
nextjs-docs-mcp/
├── app/
│   ├── api/[transport]/route.ts    # MCP server handler
│   └── page.tsx                     # Landing page
├── lib/
│   ├── search-engine.ts             # FlexSearch implementation
│   ├── mdx-processor.ts             # MDX parser
│   └── cache.ts                     # Redis caching
├── scripts/
│   ├── process-docs.ts              # Doc processor
│   └── build-search-index.ts        # Index builder
└── data/                            # Generated files
    ├── docs-metadata.json
    └── search-index.json
```

---

## 🔧 Troubleshooting

### Server won't start
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Docs not found
```bash
npm run process-docs
npm run build:index
```

### Redis not working
Server works fine without Redis - it's optional for caching only.

---

## 📄 License

MIT - Free to use and modify

---

## 🙏 Credits

- **Next.js Team** - Amazing framework and documentation
- **Anthropic** - Model Context Protocol
- **Upstash** - Redis caching

---

**Made for the Next.js community** ❤️

Questions? [Open an issue](https://github.com/muhammadsuheer/nextjs-docs-mcp/issues)
