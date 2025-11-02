'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [setupTab, setSetupTab] = useState<'hosted' | 'local'>('hosted');
  const [selectedIDE, setSelectedIDE] = useState('claude');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const serverUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const ides = {
    claude: {
      name: 'Claude Desktop',
      config: `{
  "mcpServers": {
    "nextjs-docs": {
      "url": "${serverUrl}/api/sse"
    }
  }
}`,
      path: {
        macOS: '~/Library/Application Support/Claude/claude_desktop_config.json',
        Windows: '%APPDATA%\\Claude\\claude_desktop_config.json'
      }
    },
    cursor: {
      name: 'Cursor',
      config: 'Settings → Features → MCP Servers → Add Server',
      setup: `Server URL: ${serverUrl}/api/sse`
    },
    windsurf: {
      name: 'Windsurf',
      config: 'Settings → Integrations → MCP',
      setup: `Endpoint: ${serverUrl}/api/sse`
    },
    zed: {
      name: 'Zed',
      config: `{
  "context_servers": {
    "nextjs-docs": "${serverUrl}/api/sse"
  }
}`,
      path: {
        macOS: '~/.config/zed/settings.json'
      }
    },
    vscode: {
      name: 'VS Code + Cline',
      config: 'Cline extension settings',
      setup: `MCP Server URL: ${serverUrl}/api/sse`
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="font-semibold text-gray-900">Next.js Docs MCP</div>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <a href="#quickstart" className="text-gray-600 hover:text-gray-900">Quick Start</a>
                <a href="#tools" className="text-gray-600 hover:text-gray-900">Tools</a>
                <a href="#examples" className="text-gray-600 hover:text-gray-900">Examples</a>
                <a href="#api" className="text-gray-600 hover:text-gray-900">API</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Production Ready
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Next.js Documentation<br />Model Context Protocol Server
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Search complete Next.js documentation directly in Claude Desktop, Cursor, Windsurf, Zed, and VS Code. 374 pages, 2,716 code examples, offline-capable, sub-50ms search.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#quickstart" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
              Get Started
            </a>
            <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              View Source
            </a>
            <a href="https://vercel.com/new/clone?repository-url=https://github.com/muhammadsuheer/nextjs-docs-mcp" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              Deploy
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 pb-20 border-b border-gray-200">
          {[
            { value: '374', label: 'Docs Pages' },
            { value: '2,716', label: 'Code Examples' },
            { value: '<50ms', label: 'Response Time' },
            { value: '100%', label: 'Offline' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Start</h2>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setSetupTab('hosted')}
                className={`pb-3 px-1 border-b-2 text-sm font-medium transition ${
                  setupTab === 'hosted'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Use Hosted Server (Recommended)
              </button>
              <button
                onClick={() => setSetupTab('local')}
                className={`pb-3 px-1 border-b-2 text-sm font-medium transition ${
                  setupTab === 'local'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Self-Host Locally
              </button>
            </div>
          </div>

          {/* Hosted Setup */}
          {setupTab === 'hosted' && (
            <div className="space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Recommended:</strong> Use our hosted server for instant setup. No installation required.
                </p>
              </div>

              {/* IDE Selector */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Choose Your Editor</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ides).map(([key, ide]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedIDE(key)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                        selectedIDE === key
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {ide.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Step 2: Add Configuration for {ides[selectedIDE as keyof typeof ides].name}
                </h3>
                
                {'path' in ides[selectedIDE as keyof typeof ides] && (ides[selectedIDE as keyof typeof ides] as any).path && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-700 mb-2">Configuration file location:</div>
                    {Object.entries((ides[selectedIDE as keyof typeof ides] as any).path as Record<string, string>).map(([os, path]) => (
                      <div key={os} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2 mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-gray-500 w-16">{os}</span>
                          <code className="text-sm text-gray-700">{path}</code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(path, `path-${os}`)}
                          className="text-xs text-gray-600 hover:text-gray-900"
                        >
                          {copiedText === `path-${os}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                    <code>{(() => {
                      const ide = ides[selectedIDE as keyof typeof ides] as any;
                      return ide.config.includes('{') ? ide.config : (ide.setup || ide.config);
                    })()}</code>
                  </pre>
                  <button
                    onClick={() => {
                      const ide = ides[selectedIDE as keyof typeof ides] as any;
                      const text = ide.config.includes('{') ? ide.config : (ide.setup || ide.config);
                      copyToClipboard(text, 'config');
                    }}
                    className={`absolute top-3 right-3 px-3 py-1.5 text-xs rounded transition ${
                      copiedText === 'config'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {copiedText === 'config' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Step 3: Restart & Test</h4>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Restart your editor</li>
                  <li>Open AI assistant</li>
                  <li>Ask: <code className="bg-white px-2 py-0.5 rounded border border-gray-200">"Search Next.js docs for server components"</code></li>
                </ol>
              </div>
            </div>
          )}

          {/* Local Setup */}
          {setupTab === 'local' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>Advanced:</strong> Self-host for custom deployments or offline environments.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                      <code>{`# Clone repository
git clone https://github.com/muhammadsuheer/nextjs-docs-mcp.git
cd nextjs-docs-mcp

# Install dependencies
npm install

# Download documentation
mkdir -p docs-data && cd docs-data
git init
git remote add origin https://github.com/vercel/next.js.git
git config core.sparseCheckout true
echo "docs/*" >> .git/info/sparse-checkout
git pull --depth 1 origin canary
cd ..

# Process docs and build index
npm run process-docs
npm run build:index

# Start server
npm run dev`}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`git clone https://github.com/muhammadsuheer/nextjs-docs-mcp.git
cd nextjs-docs-mcp
npm install
mkdir -p docs-data && cd docs-data
git init
git remote add origin https://github.com/vercel/next.js.git
git config core.sparseCheckout true
echo "docs/*" >> .git/info/sparse-checkout
git pull --depth 1 origin canary
cd ..
npm run process-docs
npm run build:index
npm run dev`, 'install')}
                      className={`absolute top-3 right-3 px-3 py-1.5 text-xs rounded transition ${
                        copiedText === 'install'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {copiedText === 'install' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    Server will start at <code className="bg-gray-100 px-2 py-0.5 rounded">http://localhost:3000</code>
                  </div>
                </div>
        </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deploy to Vercel</h3>
          <a
                  href="https://vercel.com/new/clone?repository-url=https://github.com/muhammadsuheer/nextjs-docs-mcp"
            target="_blank"
            rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                >
                  Deploy to Vercel
                </a>
                <p className="text-sm text-gray-600 mt-2">
                  One-click deployment with automatic Upstash Redis setup for caching
                </p>
              </div>
            </div>
          )}
        </section>

        {/* MCP Tools */}
        <section id="tools" className="mb-20 pb-20 border-b border-gray-200 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Tools</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <code className="text-lg font-mono text-gray-900">search_nextjs_docs</code>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">Primary</span>
              </div>
              <p className="text-gray-600 mb-4">Search documentation with advanced filtering</p>
              <div className="bg-gray-50 rounded p-3 text-sm space-y-1 font-mono">
                <div className="text-gray-600">Parameters:</div>
                <div className="text-gray-900">• query: string (required)</div>
                <div className="text-gray-900">• version?: "13" | "14" | "15" | "latest"</div>
                <div className="text-gray-900">• category?: "app-router" | "pages-router" | "api-reference"</div>
                <div className="text-gray-900">• limit?: number (1-50, default: 10)</div>
                <div className="text-gray-900">• includeCodeExamples?: boolean</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <code className="text-lg font-mono text-gray-900 block mb-3">get_nextjs_doc</code>
              <p className="text-gray-600 mb-4">Retrieve complete content of specific page</p>
              <div className="bg-gray-50 rounded p-3 text-sm space-y-1 font-mono">
                <div className="text-gray-600">Parameters:</div>
                <div className="text-gray-900">• docId: string (required)</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <code className="text-lg font-mono text-gray-900 block mb-3">list_nextjs_categories</code>
              <p className="text-gray-600 mb-4">Get documentation statistics and available categories</p>
              <div className="bg-gray-50 rounded p-3 text-sm font-mono text-gray-600">
                No parameters required
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section id="examples" className="mb-20 pb-20 border-b border-gray-200 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Usage Examples</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Search for Server Components',
                query: '"Search Next.js docs for server components with code examples"',
                result: 'Returns documentation pages about Server Components with TypeScript/JavaScript code examples'
              },
              {
                title: 'Version-Specific Documentation',
                query: '"How do I use getStaticProps in Next.js 13?"',
                result: 'Searches Pages Router documentation specific to Next.js 13'
              },
              {
                title: 'Get Complete Page',
                query: '"Show me the complete documentation for data fetching in App Router"',
                result: 'Returns full content including all sections, code examples, and related links'
              },
              {
                title: 'Find Migration Guides',
                query: '"Find migration guide from Pages Router to App Router"',
                result: 'Returns step-by-step migration documentation with code examples'
              }
            ].map((example, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-base font-medium text-gray-900 mb-2">{example.title}</h3>
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <code className="text-sm text-gray-800">{example.query}</code>
                </div>
                <p className="text-sm text-gray-600">{example.result}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section id="api" className="mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">API Reference</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Server Endpoints</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono text-sm text-gray-900">/api/sse</code>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">Recommended</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Server-Sent Events transport for MCP protocol</p>
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    <code className="text-xs text-gray-700">{serverUrl}/api/sse</code>
                    <button
                      onClick={() => copyToClipboard(`${serverUrl}/api/sse`, 'sse-api')}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      {copiedText === 'sse-api' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <code className="font-mono text-sm text-gray-900 block mb-2">/api/messages</code>
                  <p className="text-sm text-gray-600 mb-3">HTTP POST transport for MCP protocol</p>
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    <code className="text-xs text-gray-700">{serverUrl}/api/messages</code>
                    <button
                      onClick={() => copyToClipboard(`${serverUrl}/api/messages`, 'http-api')}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      {copiedText === 'http-api' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">&lt;50ms</div>
                  <div className="text-sm text-gray-600">Average search response time</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">80%</div>
                  <div className="text-sm text-gray-600">Cache hit rate with Redis</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-12 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Start Using Next.js Docs MCP</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Integrate Next.js documentation into your AI assistant in under 60 seconds
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#quickstart" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
              Quick Start Guide
            </a>
            <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp#readme" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              Full Documentation
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>Built for the Next.js community • MIT License</div>
            <div className="flex gap-6">
              <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp" className="hover:text-gray-900">GitHub</a>
              <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp/issues" className="hover:text-gray-900">Issues</a>
              <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp/discussions" className="hover:text-gray-900">Discussions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
