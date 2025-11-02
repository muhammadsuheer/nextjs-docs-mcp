# Contributing to Next.js Docs MCP

Thank you for your interest in contributing! 🎉

## Development Setup

```bash
# Clone the repo
git clone https://github.com/muhammadsuheer/nextjs-docs-mcp.git
cd nextjs-docs-mcp

# Install dependencies
npm install

# Build (downloads docs automatically)
npm run build

# Start development server
npm run dev
```

## Project Structure

```
nextjs-docs-mcp/
├── app/
│   ├── api/
│   │   ├── mcp/route.ts              # Main MCP endpoint
│   │   └── test-redis/route.ts       # Redis test endpoint
│   ├── page.tsx                      # Landing page
│   └── setup/page.tsx                # Setup instructions
├── lib/
│   ├── search-engine.ts              # FlexSearch implementation
│   ├── mdx-processor.ts              # MDX parser
│   ├── cache.ts                      # Redis caching
│   └── version-detector.ts           # Auto version detection
├── scripts/
│   ├── build-docs.sh                 # Download docs (parallel)
│   └── process-docs-all.ts           # Process all versions
└── types/index.ts                    # TypeScript types
```

## Making Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test locally: `npm run build && npm start`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

## Testing

```bash
# Test the MCP server
npm run build
npm start

# In another terminal, test with MCP Inspector
npx @modelcontextprotocol/inspector@latest http://localhost:3000
```

## Questions?

Open an issue on GitHub!

