export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Next.js Documentation MCP Server
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The fastest offline Next.js documentation server for AI coding assistants
          </p>
          
          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                ✨ Features
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>⚡ Lightning-fast offline search</li>
                <li>🔍 Multi-strategy semantic search</li>
                <li>📚 Complete Next.js documentation</li>
                <li>🎯 Version-aware (v13, v14, v15)</li>
                <li>💻 Rich code examples</li>
                <li>🔒 Privacy-first (no external API calls)</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                🔗 MCP Endpoints
              </h2>
              <ul className="space-y-2 text-sm font-mono text-gray-700 bg-white p-4 rounded">
                <li>SSE: <span className="text-blue-600">/api/sse</span></li>
                <li>HTTP: <span className="text-blue-600">/api/messages</span></li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                📖 Setup Status
              </h2>
              <p className="text-gray-700">
                Configure your AI assistant to connect to this MCP server and start exploring Next.js docs!
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Made with ❤️ for the Next.js community</p>
            <p className="mt-2">
              <a 
                href="https://github.com/vercel/next.js" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Documentation Source
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
