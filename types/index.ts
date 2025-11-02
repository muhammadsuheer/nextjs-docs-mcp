// Core types for Next.js Documentation MCP Server

export interface DocMetadata {
  id: string;
  path: string;
  title: string;
  description: string;
  category: 'app-router' | 'pages-router' | 'api-reference' | 'architecture' | 'community';
  version: string;
  headings: DocHeading[];
  codeBlocks: CodeBlock[];
  content: string;
  excerpt: string;
  url: string;
  lastModified?: string;
}

export interface DocHeading {
  level: number;
  text: string;
  slug: string;
}

export interface CodeBlock {
  language: string;
  code: string;
  context?: string;
}

export interface SearchResult {
  doc: DocMetadata;
  score: number;
  matches: SearchMatch[];
  relevance: 'high' | 'medium' | 'low';
}

export interface SearchMatch {
  field: 'title' | 'content' | 'headings' | 'description';
  text: string;
  context: string;
}

export interface SearchOptions {
  query: string;
  version?: '15' | '14' | '13' | 'latest';
  category?: DocMetadata['category'];
  limit?: number;
  includeCodeExamples?: boolean;
}

export interface ProcessedDoc {
  metadata: DocMetadata;
  rawContent: string;
  frontMatter: Record<string, any>;
  searchableContent: string;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

