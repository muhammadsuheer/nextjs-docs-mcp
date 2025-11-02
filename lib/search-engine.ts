// Multi-strategy search engine using FlexSearch

import FlexSearch from 'flexsearch';
import type { DocMetadata, SearchResult, SearchOptions, SearchMatch } from '@/types';

type FlexSearchDocument = any;

export class DocumentSearchEngine {
  private index: FlexSearchDocument;
  private documents: Map<string, DocMetadata>;
  
  // Synonym mapping for common terms and acronyms
  private synonyms: Record<string, string[]> = {
    'ssr': ['server-side rendering', 'server side render', 'getServerSideProps'],
    'ssg': ['static site generation', 'static generation', 'getStaticProps', 'generateStaticParams'],
    'isr': ['incremental static regeneration', 'revalidate', 'incremental'],
    'csr': ['client-side rendering', 'client render', 'useEffect'],
    'rsc': ['react server components', 'server components'],
    'seo': ['search engine optimization', 'metadata', 'head', 'title', 'description'],
    'api': ['route handler', 'api route', 'endpoint'],
    'middleware': ['proxy', 'rewrite', 'redirect'],
    'error': ['error boundary', 'error handling', 'not-found', '404', '500'],
    'auth': ['authentication', 'login', 'session', 'jwt', 'cookies'],
    'cache': ['caching', 'revalidate', 'fetch', 'unstable_cache'],
  };
  
  constructor() {
    this.documents = new Map();
    
    // Create FlexSearch index with optimized settings
    this.index = new (FlexSearch as any).Document({
      document: {
        id: 'id',
        index: ['title', 'content', 'description'],
        store: ['id', 'title', 'path', 'category', 'version', 'excerpt', 'url'],
      },
      tokenize: 'forward',
      resolution: 9,
      cache: 100,
      context: {
        depth: 3,
        bidirectional: true,
      },
    });
  }
  
  /**
   * Add document to search index
   */
  addDocument(doc: DocMetadata): void {
    this.documents.set(doc.id, doc);
    this.index.add(doc);
  }
  
  /**
   * Add multiple documents
   */
  addDocuments(docs: DocMetadata[]): void {
    docs.forEach(doc => this.addDocument(doc));
  }
  
  /**
   * Expand query with synonyms for better search results
   */
  private expandQuery(query: string): string[] {
    const queries = [query];
    const lowerQuery = query.toLowerCase();
    
    // Check if query contains any synonym keys
    Object.entries(this.synonyms).forEach(([key, values]) => {
      if (lowerQuery.includes(key)) {
        // Add all synonym variations
        values.forEach(synonym => {
          const expandedQuery = lowerQuery.replace(key, synonym);
          if (!queries.includes(expandedQuery)) {
            queries.push(expandedQuery);
          }
        });
      }
    });
    
    // If query has multiple words, try individual words too
    const words = query.toLowerCase().split(/\s+/);
    if (words.length > 3) {
      // For very long queries, use first 2-3 important words
      const importantWords = words.filter(w => w.length > 3).slice(0, 3);
      if (importantWords.length > 0) {
        queries.push(importantWords.join(' '));
      }
    }
    
    return queries;
  }
  
  /**
   * Search documents
   */
  async search(options: SearchOptions): Promise<SearchResult[]> {
    const { query, version, category, limit = 10, includeCodeExamples = false } = options;
    
    // Expand query with synonyms
    const queries = this.expandQuery(query);
    
    // Perform search with all query variations
    let allSearchResults: any[] = [];
    for (const q of queries) {
      const results = this.index.search(q, {
        limit: limit * 2, // Get more results for filtering
        enrich: true,
      });
      allSearchResults = allSearchResults.concat(results);
      
      // If we got good results from first query, don't need more
      if (allSearchResults.length > 0 && q === query) break;
    }
    
    const searchResults = allSearchResults;
    
    const results: SearchResult[] = [];
    const seenIds = new Set<string>();
    
    // Process search results
    for (const fieldResults of searchResults) {
      if (!fieldResults.result) continue;
      
      for (const item of fieldResults.result) {
        const docId = item.id as string;
        
        if (seenIds.has(docId) || results.length >= limit) continue;
        
        const doc = this.documents.get(docId);
        if (!doc) continue;
        
        // Apply filters
        if (version && doc.version !== version) continue;
        if (category && doc.category !== category) continue;
        
        seenIds.add(docId);
        
        // Calculate relevance
        const score = this.calculateScore(query, doc, fieldResults.field as string);
        const relevance = this.determineRelevance(score);
        
        // Extract matches
        const matches = this.extractMatches(query, doc, fieldResults.field as string);
        
        results.push({
          doc: includeCodeExamples ? doc : { ...doc, codeBlocks: [] },
          score,
          matches,
          relevance,
        });
      }
    }
    
    // Sort by score
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
  
  /**
   * Calculate relevance score
   */
  private calculateScore(query: string, doc: DocMetadata, field: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const tokens = queryLower.split(/\s+/);
    
    // Title match (highest weight)
    if (doc.title.toLowerCase().includes(queryLower)) {
      score += 100;
    }
    tokens.forEach(token => {
      if (doc.title.toLowerCase().includes(token)) {
        score += 20;
      }
    });
    
    // Exact phrase in content
    if (doc.content.toLowerCase().includes(queryLower)) {
      score += 50;
    }
    
    // Token matches in content
    tokens.forEach(token => {
      const regex = new RegExp(token, 'gi');
      const matches = doc.content.match(regex);
      if (matches) {
        score += matches.length * 2;
      }
    });
    
    // Description match
    if (doc.description.toLowerCase().includes(queryLower)) {
      score += 30;
    }
    
    // Category relevance
    if (field === 'title') score *= 1.5;
    if (field === 'description') score *= 1.2;
    
    return score;
  }
  
  /**
   * Determine relevance level
   */
  private determineRelevance(score: number): 'high' | 'medium' | 'low' {
    if (score >= 100) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }
  
  /**
   * Extract matching text snippets
   */
  private extractMatches(query: string, doc: DocMetadata, field: string): SearchMatch[] {
    const matches: SearchMatch[] = [];
    const queryLower = query.toLowerCase();
    
    // Title match
    if (doc.title.toLowerCase().includes(queryLower)) {
      matches.push({
        field: 'title',
        text: doc.title,
        context: doc.title,
      });
    }
    
    // Content matches
    const contentLower = doc.content.toLowerCase();
    const index = contentLower.indexOf(queryLower);
    if (index !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(doc.content.length, index + query.length + 50);
      const context = doc.content.substring(start, end);
      
      matches.push({
        field: 'content',
        text: doc.content.substring(index, index + query.length),
        context: start > 0 ? '...' + context + '...' : context + '...',
      });
    }
    
    return matches;
  }
  
  /**
   * Get document by ID
   */
  getDocument(id: string): DocMetadata | undefined {
    return this.documents.get(id);
  }
  
  /**
   * Get all documents
   */
  getAllDocuments(): DocMetadata[] {
    return Array.from(this.documents.values());
  }
  
  /**
   * Get statistics
   */
  getStats() {
    const docs = this.getAllDocuments();
    const categories = docs.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalDocuments: docs.length,
      categories,
      versions: [...new Set(docs.map(d => d.version))],
    };
  }
}

// Singleton instance
let searchEngine: DocumentSearchEngine | null = null;

export function getSearchEngine(): DocumentSearchEngine {
  if (!searchEngine) {
    searchEngine = new DocumentSearchEngine();
  }
  return searchEngine;
}

