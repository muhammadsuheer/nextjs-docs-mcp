'use client';

import { useState } from 'react';

export default function Home() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const serverUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Next.js Docs MCP</h1>
                <p className="text-xs text-slate-400">Model Context Protocol Server</p>
              </div>
            </div>
            <a
              href="https://github.com/muhammadsuheer/nextjs-docs-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition border border-slate-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Production Ready</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Next.js Documentation<br />for AI Assistants
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Complete offline Next.js documentation search for Claude Desktop, Cursor, Windsurf, and all Model Context Protocol compatible AI coding assistants. 374 docs, 2,716 code examples, instant results.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">374</div>
            <div className="text-slate-300">Documentation Pages</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">2,716</div>
            <div className="text-slate-300">Code Examples</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">&lt;50ms</div>
            <div className="text-slate-300">Search Speed</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">100%</div>
            <div className="text-slate-300">Offline Capable</div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">MCP Server Endpoints</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/50 p-5 rounded-lg border border-slate-800">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-400">SSE Transport</span>
                  <span className="text-xs px-2 py-0.5 bg-green-600/20 text-green-400 rounded-full border border-green-600/30">Recommended</span>
                </div>
                <code className="text-slate-300 font-mono text-sm break-all">{serverUrl}/api/sse</code>
              </div>
              <button
                onClick={() => copyToClipboard(serverUrl + '/api/sse', 'sse')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                  copiedEndpoint === 'sse'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copiedEndpoint === 'sse' ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/50 p-5 rounded-lg border border-slate-800">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-400">HTTP Transport</span>
                </div>
                <code className="text-slate-300 font-mono text-sm break-all">{serverUrl}/api/messages</code>
              </div>
              <button
                onClick={() => copyToClipboard(serverUrl + '/api/messages', 'http')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                  copiedEndpoint === 'http'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copiedEndpoint === 'http' ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast Search</h3>
            <p className="text-slate-400">FlexSearch-powered full-text search with sub-50ms response times. Upstash Redis caching for 2x speed improvement.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Offline First</h3>
            <p className="text-slate-400">Complete Next.js documentation stored locally. No internet required for queries. Works in air-gapped environments.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">2,716 Code Examples</h3>
            <p className="text-slate-400">Every search result includes working code snippets from official Next.js documentation with syntax highlighting.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-orange-600/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Version Aware</h3>
            <p className="text-slate-400">Search documentation for specific Next.js versions (13, 14, 15). Filter by App Router, Pages Router, or API reference.</p>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Integration Guide</h2>
          
          <div className="space-y-6">
            {/* Claude Desktop */}
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">Claude Desktop</h3>
              <p className="text-slate-400 mb-3">Add to claude_desktop_config.json:</p>
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-slate-300">
{`{
  "mcpServers": {
    "nextjs-docs": {
      "url": "${serverUrl}/api/sse",
      "transport": "sse"
    }
  }
}`}
                </code>
              </pre>
            </div>

            {/* Cursor */}
            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">Cursor IDE</h3>
              <p className="text-slate-400 mb-3">Settings → MCP Servers → Add Server</p>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Name:</span> <span className="text-slate-300">nextjs-docs</span></div>
                  <div><span className="text-slate-500">URL:</span> <span className="text-slate-300">{serverUrl}/api/sse</span></div>
                  <div><span className="text-slate-500">Transport:</span> <span className="text-slate-300">SSE</span></div>
                </div>
              </div>
            </div>

            {/* Windsurf */}
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">Windsurf IDE</h3>
              <p className="text-slate-400 mb-3">Settings → Integrations → Model Context Protocol</p>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Display Name:</span> <span className="text-slate-300">Next.js Documentation</span></div>
                  <div><span className="text-slate-500">Endpoint:</span> <span className="text-slate-300">{serverUrl}/api/sse</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Usage Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Search for Server Components</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Ask your AI assistant:</p>
                <code className="text-green-400 text-sm">"Search Next.js docs for server components with code examples"</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Full Documentation</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Ask your AI assistant:</p>
                <code className="text-green-400 text-sm">"Show me complete documentation for data fetching in Next.js 15"</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Version-Specific Search</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Ask your AI assistant:</p>
                <code className="text-green-400 text-sm">"How do I use getStaticProps in Next.js 13?"</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Find Migration Guides</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Ask your AI assistant:</p>
                <code className="text-green-400 text-sm">"Find Next.js migration guides from Pages Router to App Router"</code>
              </div>
            </div>
          </div>
        </div>

        {/* Available Tools */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Available MCP Tools</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-400">search_nextjs_docs</h3>
                <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded border border-blue-600/30">Most Used</span>
              </div>
              <p className="text-slate-400 mb-3">Search Next.js documentation with advanced filtering</p>
              <div className="text-sm text-slate-500 space-y-1">
                <div><span className="text-slate-400">Parameters:</span> query, version, category, limit, includeCodeExamples</div>
                <div><span className="text-slate-400">Returns:</span> Ranked search results with code examples</div>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-green-400 mb-3">get_nextjs_doc</h3>
              <p className="text-slate-400 mb-3">Retrieve complete content of specific documentation page</p>
              <div className="text-sm text-slate-500 space-y-1">
                <div><span className="text-slate-400">Parameters:</span> docId</div>
                <div><span className="text-slate-400">Returns:</span> Full documentation with all code examples</div>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">list_nextjs_categories</h3>
              <p className="text-slate-400 mb-3">Get available documentation categories and statistics</p>
              <div className="text-sm text-slate-500 space-y-1">
                <div><span className="text-slate-400">Parameters:</span> None</div>
                <div><span className="text-slate-400">Returns:</span> Category list, document counts, versions</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to enhance your AI assistant?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Copy the endpoint URL above and add it to your AI assistant configuration. Start searching Next.js documentation instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://github.com/muhammadsuheer/nextjs-docs-mcp"
            target="_blank"
            rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View Documentation
          </a>
          <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/muhammadsuheer/nextjs-docs-mcp"
            target="_blank"
            rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition border border-slate-700"
            >
              Deploy Your Own
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              Built for the Next.js developer community. MIT License.
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition text-sm">
                GitHub
              </a>
              <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp/issues" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition text-sm">
                Issues
              </a>
              <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp#readme" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition text-sm">
            Documentation
          </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
