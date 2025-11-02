// Constants for Next.js Documentation MCP Server

export const DOCS_VERSION = '15.1.8';
export const MCP_SERVER_NAME = 'nextjs-docs-mcp';
export const MCP_SERVER_VERSION = '1.0.0';

export const DOCS_BASE_URL = 'https://nextjs.org/docs';

export const CATEGORIES = {
  'app-router': 'App Router',
  'pages-router': 'Pages Router',
  'api-reference': 'API Reference',
  'architecture': 'Architecture',
  'community': 'Community',
} as const;

export const DOCS_PATH = './docs-data/docs';
export const SEARCH_INDEX_PATH = './data/search-index.json';
export const DOCS_METADATA_PATH = './data/docs-metadata.json';

export const CACHE_TTL = 3600; // 1 hour
export const MAX_SEARCH_RESULTS = 50;
export const DEFAULT_SEARCH_LIMIT = 10;

