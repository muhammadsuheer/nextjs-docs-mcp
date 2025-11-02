#!/usr/bin/env tsx
/**
 * Production-Ready Documentation Builder
 * Processes Next.js v16 docs with proper category detection
 */

import { processAllDocs } from '../lib/mdx-processor.js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('🚀 Building Production Documentation\n');
  console.log('━'.repeat(50));
  
  const docsDir = path.join(process.cwd(), 'docs-data/docs');
  
  try {
    // Check if docs directory exists
    try {
      await fs.access(docsDir);
    } catch {
      console.error(`❌ Docs directory not found: ${docsDir}`);
      console.error('   Please ensure docs-data/docs exists');
      process.exit(1);
    }
    
    console.log(`📂 Processing docs from: ${docsDir}\n`);
    
    // Process all documentation files
    const startTime = Date.now();
    const docs = await processAllDocs(docsDir);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (docs.length === 0) {
      console.error('❌ No documentation files found!');
      process.exit(1);
    }
    
    console.log(`✅ Processed ${docs.length} files in ${duration}s\n`);
    
    // Analyze categories
    const categories = docs.reduce((acc, doc) => {
      acc[doc.metadata.category] = (acc[doc.metadata.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📊 Category Breakdown:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(15)} : ${count} docs`);
    });
    console.log();
    
    // Count code examples
    const totalCodeBlocks = docs.reduce((sum, doc) => 
      sum + doc.metadata.codeBlocks.length, 0
    );
    console.log(`💻 Total Code Examples: ${totalCodeBlocks}\n`);
    
    // Create data directory
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Save main metadata file
    const metadata = docs.map(d => d.metadata);
    await fs.writeFile(
      path.join(dataDir, 'docs-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    console.log('✅ Saved: data/docs-metadata.json');
    
    // Create search index
    const searchIndex = docs.map(d => ({
      id: d.metadata.id,
      title: d.metadata.title,
      description: d.metadata.description,
      category: d.metadata.category,
      path: d.metadata.path,
      url: d.metadata.url,
      headings: d.metadata.headings.map(h => h.text),
      excerpt: d.metadata.excerpt,
    }));
    
    await fs.writeFile(
      path.join(dataDir, 'search-index.json'),
      JSON.stringify(searchIndex, null, 2)
    );
    console.log('✅ Saved: data/search-index.json');
    
    // Create stats file
    const stats = {
      totalDocs: docs.length,
      totalCodeExamples: totalCodeBlocks,
      categories,
      version: '16.0.1',
      buildDate: new Date().toISOString(),
      buildDuration: `${duration}s`,
    };
    
    await fs.writeFile(
      path.join(dataDir, 'build-stats.json'),
      JSON.stringify(stats, null, 2)
    );
    console.log('✅ Saved: data/build-stats.json\n');
    
    console.log('━'.repeat(50));
    console.log('🎉 Documentation Build Complete!\n');
    console.log(`   📚 ${docs.length} documentation pages`);
    console.log(`   💻 ${totalCodeBlocks} code examples`);
    console.log(`   ⚡ Ready for MCP server\n`);
    
  } catch (error) {
    console.error('\n❌ Build Failed:', error);
    process.exit(1);
  }
}

main();

