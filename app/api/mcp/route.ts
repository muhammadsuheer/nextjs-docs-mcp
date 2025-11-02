// Main MCP Server Route Handler - Vercel Standard Implementation

import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { getSearchEngine } from '@/lib/search-engine';
import { getCached, setCached, generateSearchCacheKey, initRedis } from '@/lib/cache';
import { DOCS_METADATA_PATH } from '@/lib/constants';
import type { DocMetadata, SearchOptions } from '@/types';

// Initialize search engine (single version - Next.js 16)
let searchEngine: ReturnType<typeof getSearchEngine> | null = null;

async function ensureDocsLoaded() {
  // Return cached engine if already loaded
  if (searchEngine) {
    return searchEngine;
  }
  
  try {
    const metadataPath = path.join(process.cwd(), DOCS_METADATA_PATH);
    const content = await fs.readFile(metadataPath, 'utf-8');
    const docs: DocMetadata[] = JSON.parse(content);
    
    // Initialize search engine
    searchEngine = getSearchEngine();
    searchEngine.addDocuments(docs);
    
    // Initialize Redis (optional)
    initRedis();
    
    console.log(`✅ Loaded Next.js documentation (${docs.length} docs)`);
    
    return searchEngine;
  } catch {
    throw new Error(`Documentation not found. Please ensure data/docs-metadata.json exists.`);
  }
}

// CORS helper for MCP endpoint
function addCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  response.headers.set('Access-Control-Expose-Headers', '*');
  return response;
}

const handler = createMcpHandler(
  (server) => {
    
    // ==================== RESOURCES ====================
    
    server.resource(
      'nextjs-docs',
      'nextjs://docs/{path}',
      async (uri: URL) => {
        const engine = await ensureDocsLoaded();
        const path = uri.pathname.replace('/docs/', '');
        const doc = engine.getDocument(path);
        
        if (!doc) {
          return {
            contents: [{
              uri: uri.toString(),
              mimeType: 'text/plain',
              text: `Document not found: ${path}`,
            }],
          };
        }
        
        return {
          contents: [{
            uri: uri.toString(),
            mimeType: 'text/markdown',
            text: `# ${doc.title}\n\n${doc.description}\n\n${doc.content}`,
          }],
        };
      }
    );
    
    server.resource(
      'nextjs-search',
      'nextjs://search?q={query}',
      async (uri: URL) => {
        const engine = await ensureDocsLoaded();
        const query = uri.searchParams.get('q') || '';
        const results = await engine.search({ query, limit: 10 });
        
        const formatted = results.map(r => ({
          title: r.doc.title,
          url: r.doc.url,
          excerpt: r.doc.excerpt,
          category: r.doc.category,
          relevance: r.relevance,
        }));
        
        return {
          contents: [{
            uri: uri.toString(),
            mimeType: 'application/json',
            text: JSON.stringify(formatted, null, 2),
          }],
        };
      }
    );
    
    // ==================== TOOLS ====================
    
    server.tool(
      'search_nextjs_docs',
      'Search Next.js 16 documentation with advanced filters and semantic understanding',
      {
        query: z.string()
          .min(1)
          .describe('Search query - can be a question or keywords (e.g., "How to use Server Components?" or "Cache Components")'),
        category: z.enum(['app-router', 'pages-router', 'api-reference', 'architecture', 'community'])
          .optional()
          .describe('Filter by documentation category'),
        limit: z.number()
          .min(1)
          .max(50)
          .default(10)
          .describe('Maximum number of results to return'),
        includeCodeExamples: z.boolean()
          .default(true)
          .describe('Include code examples in results'),
      },
      async ({ query, category, limit, includeCodeExamples }) => {
        try {
          const engine = await ensureDocsLoaded();
          
          // Check cache first
          const cacheKey = generateSearchCacheKey(query, { category, limit });
          const cached = await getCached(cacheKey);
          
          if (cached) {
            return {
              content: [{
                type: 'text',
                text: cached as string,
              }],
            };
          }
          
          // Perform search
          const searchOptions: SearchOptions = {
            query,
            category,
            limit,
            includeCodeExamples,
          };
          
          const results = await engine.search(searchOptions);
          
          if (results.length === 0) {
            const response = `No results found for "${query}". Try different keywords or check spelling.`;
            return {
              content: [{ type: 'text', text: response }],
            };
          }
          
          // Format results
          let response = `# Search Results for "${query}"\n\n`;
          response += `Found ${results.length} result(s)\n\n`;
          
          results.forEach((result, idx) => {
            const { doc, relevance } = result;
            response += `## ${idx + 1}. ${doc.title}\n`;
            response += `**Relevance:** ${relevance} | **Category:** ${doc.category}\n`;
            response += `**URL:** ${doc.url}\n\n`;
            response += `${doc.description}\n\n`;
            
            if (includeCodeExamples && doc.codeBlocks.length > 0) {
              response += `### Code Examples:\n\n`;
              doc.codeBlocks.slice(0, 2).forEach((block) => {
                response += `\`\`\`${block.language}\n${block.code}\n\`\`\`\n\n`;
              });
            }
            
            response += `---\n\n`;
          });
          
          // Cache the results
          await setCached(cacheKey, response);
          
          return {
            content: [{
              type: 'text',
              text: response,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error searching documentation: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );
    
    server.tool(
      'get_nextjs_doc',
      'Get the full content of a specific Next.js documentation page by ID or path',
      {
        docId: z.string()
          .describe('Document ID or path (e.g., "01-app-01-building-your-application-01-routing" or use search to find IDs)'),
      },
      async ({ docId }) => {
        try {
          const engine = await ensureDocsLoaded();
          const doc = engine.getDocument(docId);
          
          if (!doc) {
            return {
              content: [{
                type: 'text',
                text: `Document not found: ${docId}. Use search_nextjs_docs to find document IDs.`,
              }],
              isError: true,
            };
          }
          
          let response = `# ${doc.title}\n\n`;
          response += `**Category:** ${doc.category} | **Version:** ${doc.version}\n`;
          response += `**URL:** ${doc.url}\n\n`;
          response += `## Description\n${doc.description}\n\n`;
          response += `## Content\n${doc.content}\n\n`;
          
          if (doc.codeBlocks.length > 0) {
            response += `## Code Examples (${doc.codeBlocks.length})\n\n`;
            doc.codeBlocks.forEach((block, idx) => {
              response += `### Example ${idx + 1} (${block.language})\n`;
              response += `\`\`\`${block.language}\n${block.code}\n\`\`\`\n\n`;
            });
          }
          
          if (doc.headings.length > 0) {
            response += `## Table of Contents\n`;
            doc.headings.forEach(h => {
              const indent = '  '.repeat(h.level - 1);
              response += `${indent}- ${h.text}\n`;
            });
          }
          
          return {
            content: [{
              type: 'text',
              text: response,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error retrieving document: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );
    
    server.tool(
      'list_nextjs_categories',
      'Get available Next.js 16 documentation categories and statistics',
      {},
      async () => {
        try {
          const engine = await ensureDocsLoaded();
          const stats = engine.getStats();
          
          let response = `# Next.js 16 Documentation Statistics\n\n`;
          response += `**Total Documents:** ${stats.totalDocuments}\n`;
          response += `**Version:** Next.js 16 (Canary)\n\n`;
          response += `## Categories\n\n`;
          
          Object.entries(stats.categories).forEach(([category, count]) => {
            response += `- **${category}**: ${count} documents\n`;
          });
          
          response += `\n## Available Categories for Filtering\n\n`;
          response += `- **app-router**: App Router documentation (React Server Components, Server Actions, etc.)\n`;
          response += `- **pages-router**: Pages Router documentation (getStaticProps, getServerSideProps, etc.)\n`;
          response += `- **api-reference**: Complete API Reference for all Next.js features\n`;
          response += `- **architecture**: Architecture and internals documentation\n`;
          response += `- **community**: Community guides and contribution documentation\n`;
          
          return {
            content: [{
              type: 'text',
              text: response,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error getting statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );
    
    // ==================== PROMPTS ====================
    
    server.prompt(
      'explain_nextjs_concept',
      'Get a comprehensive explanation of a Next.js concept with examples',
      {
        concept: z.string()
          .describe('The Next.js concept to explain (e.g., "Server Components", "App Router", "Data Fetching")'),
        level: z.enum(['beginner', 'intermediate', 'advanced'])
          .optional()
          .describe('Explanation depth level (default: intermediate)'),
      },
      async ({ concept, level = 'intermediate' }) => {
        return {
          messages: [{
            role: 'user',
            content: {
              type: 'text',
              text: `Please explain "${concept}" in Next.js at a ${level} level. Include:\n1. What it is\n2. Why it's useful\n3. How to use it with code examples\n4. Best practices\n5. Common pitfalls to avoid\n\nUse the search_nextjs_docs tool to find relevant documentation.`,
            },
          }],
        };
      }
    );
    
    server.prompt(
      'nextjs_quick_start',
      'Get started with Next.js based on your use case',
      {
        useCase: z.enum(['new-project', 'migration', 'performance', 'deployment', 'seo'])
          .describe('Your specific use case'),
      },
      async ({ useCase }) => {
        const prompts: Record<string, string> = {
          'new-project': 'I want to start a new Next.js project. Show me the setup steps, project structure, and essential concepts I need to know.',
          'migration': 'I want to migrate my existing app to Next.js. Show me migration strategies, compatibility considerations, and step-by-step guide.',
          'performance': 'I want to optimize my Next.js app performance. Show me performance best practices, optimization techniques, and monitoring approaches.',
          'deployment': 'I want to deploy my Next.js app. Show me deployment options, configuration, and best practices for different platforms.',
          'seo': 'I want to improve SEO in my Next.js app. Show me SEO features, metadata configuration, and optimization techniques.',
        };
        
        return {
          messages: [{
            role: 'user',
            content: {
              type: 'text',
              text: prompts[useCase] + '\n\nUse search_nextjs_docs to find relevant documentation and provide specific examples.',
            },
          }],
        };
      }
    );
    
  },
  {}, // Server options
  { basePath: '/api' } // Handler options
);


// Wrap handlers with CORS
async function wrappedHandler(request: Request) {
  // Handle OPTIONS for CORS preflight
  if (request.method === 'OPTIONS') {
    return addCorsHeaders(new Response(null, { status: 204 }));
  }
  
  // Call the actual handler
  const response = await handler(request);
  
  // Add CORS headers to response
  return addCorsHeaders(response);
}

export { wrappedHandler as GET, wrappedHandler as POST, wrappedHandler as DELETE, wrappedHandler as OPTIONS };

