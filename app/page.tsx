'use client';

export default function Home() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-3xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Next.js Docs MCP Server
          </h1>
          <p className="text-xl text-slate-300">
            Fast, offline documentation search for AI coding assistants. 374 docs, 2,716 code examples, instant results.
          </p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">API Endpoints</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg">
              <div>
                <div className="text-sm text-slate-400 mb-1">SSE Transport</div>
                <code className="text-blue-400 font-mono">/api/sse</code>
              </div>
              <button
                onClick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.origin + '/api/sse' : '')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
              >
                Copy
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg">
              <div>
                <div className="text-sm text-slate-400 mb-1">HTTP Transport</div>
                <code className="text-blue-400 font-mono">/api/messages</code>
              </div>
              <button
                onClick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.origin + '/api/messages' : '')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">374</div>
            <div className="text-slate-300">Documentation Pages</div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">2,716</div>
            <div className="text-slate-300">Code Examples</div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">&lt;100ms</div>
            <div className="text-slate-300">Search Speed</div>
          </div>
        </div>
        
        <div className="text-center">
          <a
            href="https://github.com/muhammadsuheer/nextjs-docs-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
