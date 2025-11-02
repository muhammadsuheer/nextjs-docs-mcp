'use client';

import { useState } from 'react';

interface IDEConfig {
  name: string;
  description: string;
  logo: string;
  configFile: string;
  configPath?: Record<string, string>;
  config: string;
  instructions?: string[];
  downloadUrl: string;
}

export default function SetupPage() {
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [selectedIDE, setSelectedIDE] = useState<string>('claude');

  const serverUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const configs: Record<string, IDEConfig> = {
    claude: {
      name: 'Claude Desktop',
      description: 'Anthropic AI Assistant',
      logo: '/api/placeholder/claude',
      configFile: 'claude_desktop_config.json',
      configPath: {
        macOS: '~/Library/Application Support/Claude/',
        Windows: '%APPDATA%\\Claude\\',
        Linux: '~/.config/Claude/'
      },
      config: `{
  "mcpServers": {
    "nextjs-docs": {
      "url": "${serverUrl}/api/sse",
      "transport": "sse"
    }
  }
}`,
      downloadUrl: 'https://claude.ai/download'
    },
    cursor: {
      name: 'Cursor',
      description: 'AI Code Editor',
      logo: '/api/placeholder/cursor',
      configFile: 'Settings > MCP Servers',
      config: `Server Name: nextjs-docs
URL: ${serverUrl}/api/sse
Transport: SSE`,
      instructions: [
        'Open Settings (Cmd/Ctrl + ,)',
        'Go to Features > MCP Servers',
        'Click Add Server',
        'Enter configuration',
        'Save and restart'
      ],
      downloadUrl: 'https://cursor.sh'
    },
    windsurf: {
      name: 'Windsurf',
      description: 'Codeium AI IDE',
      logo: '/api/placeholder/windsurf',
      configFile: 'Settings > Integrations',
      config: `Name: Next.js Documentation
URL: ${serverUrl}/api/sse
Transport: SSE`,
      instructions: [
        'Open Settings',
        'Navigate to Integrations',
        'Select Model Context Protocol',
        'Add new integration',
        'Enable after saving'
      ],
      downloadUrl: 'https://codeium.com/windsurf'
    },
    zed: {
      name: 'Zed',
      description: 'High-performance editor',
      logo: '/api/placeholder/zed',
      configFile: 'settings.json',
      configPath: {
        macOS: '~/.config/zed/',
        Linux: '~/.config/zed/'
      },
      config: `{
  "context_servers": {
    "nextjs-docs": {
      "url": "${serverUrl}/api/sse"
    }
  }
}`,
      downloadUrl: 'https://zed.dev'
    },
    vscode: {
      name: 'VS Code (Cline)',
      description: 'VSCode with Cline extension',
      logo: '/api/placeholder/vscode',
      configFile: 'Cline MCP Settings',
      config: `{
  "mcpServers": {
    "nextjs-docs": {
      "url": "${serverUrl}/api/sse"
    }
  }
}`,
      downloadUrl: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev'
    },
    continue: {
      name: 'Continue',
      description: 'VS Code AI extension',
      logo: '/api/placeholder/continue',
      configFile: 'config.json',
      configPath: {
        macOS: '~/.continue/',
        Windows: '%USERPROFILE%\\.continue\\',
        Linux: '~/.continue/'
      },
      config: `{
  "mcpServers": [
    {
      "name": "nextjs-docs",
      "url": "${serverUrl}/api/sse"
    }
  ]
}`,
      downloadUrl: 'https://marketplace.visualstudio.com/items?itemName=Continue.continue'
    }
  };

  const copyConfig = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(id);
    setTimeout(() => setCopiedConfig(null), 2000);
  };

  const currentConfig = configs[selectedIDE];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-gray-900 hover:text-gray-600 transition">
            ← Back to Home
          </a>
          <a href="https://github.com/muhammadsuheer/nextjs-docs-mcp" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">
            GitHub
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">IDE Setup</h1>
          <p className="text-gray-600">Choose your editor and copy the configuration</p>
        </div>

        {/* IDE Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {Object.entries(configs).map(([key, ide]) => (
            <button
              key={key}
              onClick={() => setSelectedIDE(key)}
              className={`p-4 border-2 rounded-lg text-left transition ${
                selectedIDE === key
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{ide.name}</div>
              <div className="text-sm text-gray-600">{ide.description}</div>
            </button>
          ))}
        </div>

        {/* Configuration Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{currentConfig.name}</h2>
              <a
                href={currentConfig.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Download →
              </a>
            </div>
            <p className="text-sm text-gray-600">Configuration file: {currentConfig.configFile}</p>
          </div>

          {/* File Paths */}
          {currentConfig.configPath && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">File Location</h3>
              <div className="space-y-2">
                {Object.entries(currentConfig.configPath).map(([os, path]) => (
                  <div key={os} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 w-20">{os}</span>
                      <code className="text-sm text-gray-600 truncate">{path}</code>
                    </div>
                    <button
                      onClick={() => copyConfig(path, `path-${os}`)}
                      className="ml-3 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      {copiedConfig === `path-${os}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Configuration */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Configuration</h3>
              <button
                onClick={() => copyConfig(currentConfig.config, 'config')}
                className={`px-4 py-2 text-sm rounded transition ${
                  copiedConfig === 'config'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copiedConfig === 'config' ? 'Copied!' : 'Copy Configuration'}
              </button>
            </div>
            <pre className="bg-gray-50 border border-gray-200 rounded p-4 overflow-x-auto">
              <code className="text-sm text-gray-800">{currentConfig.config}</code>
            </pre>
          </div>

          {/* Instructions */}
          {currentConfig.instructions && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Setup Steps</h3>
              <ol className="space-y-2">
                {currentConfig.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Test Section */}
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Test Your Setup</h3>
          <p className="text-sm text-gray-600 mb-3">After configuration, restart your IDE and try:</p>
          <code className="block bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-800">
            "Search Next.js docs for server components"
          </code>
        </div>
      </div>
    </div>
  );
}
