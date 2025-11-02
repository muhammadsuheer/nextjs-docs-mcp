#!/usr/bin/env tsx
/**
 * Simple docs processor - uses existing docs-data folder
 */
import { processAllDocs } from '../lib/mdx-processor.js';
import fs from 'fs/promises';

async function main() {
  console.log('📝 Processing Next.js documentation...\n');
  
  const docsDir = 'docs-data/docs';
  
  try {
    // Process all docs
    const docs = await processAllDocs(docsDir);
    console.log(`✅ Processed ${docs.length} documentation files`);
    
    // Create data folder
    await fs.mkdir('data', { recursive: true });
    
    // Save metadata
    const metadata = docs.map(d => d.metadata);
    await fs.writeFile(
      'data/docs-metadata.json',
      JSON.stringify(metadata, null, 2)
    );
    console.log(`✅ Saved metadata to data/docs-metadata.json`);
    
    // Create search index data
    const searchData = docs.map(d => ({
      id: d.metadata.id,
      title: d.metadata.title,
      description: d.metadata.description,
      content: (d.rawContent || d.metadata.content || '').substring(0, 500), // First 500 chars for search
      category: d.metadata.category,
      path: d.metadata.path,
    }));
    
    await fs.writeFile(
      'data/search-index.json',
      JSON.stringify(searchData, null, 2)
    );
    console.log(`✅ Saved search index to data/search-index.json`);
    
    console.log(`\n🎉 Documentation processing complete!`);
    console.log(`   ${docs.length} docs ready for MCP server`);
    
  } catch (error) {
    console.error('❌ Error processing docs:', error);
    process.exit(1);
  }
}

main();

