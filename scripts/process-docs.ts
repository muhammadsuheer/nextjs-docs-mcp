import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { processAllDocs } from '../lib/mdx-processor';
import { DOCS_PATH, DOCS_METADATA_PATH } from '../lib/constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function main() {
  const docsDir = path.join(projectRoot, DOCS_PATH);
  
  try {
    await fs.access(docsDir);
  } catch {
    throw new Error(`Docs directory not found: ${docsDir}`);
  }
  
  const processedDocs = await processAllDocs(docsDir);
  
  const dataDir = path.join(projectRoot, 'data');
  await fs.mkdir(dataDir, { recursive: true });
  
  const metadataPath = path.join(projectRoot, DOCS_METADATA_PATH);
  const metadata = processedDocs.map(doc => doc.metadata);
  
  await fs.writeFile(
    metadataPath,
    JSON.stringify(metadata, null, 2),
    'utf-8'
  );
  
  const stats = {
    total: processedDocs.length,
    categories: processedDocs.reduce((acc, doc) => {
      acc[doc.metadata.category] = (acc[doc.metadata.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalHeadings: processedDocs.reduce((sum, doc) => sum + doc.metadata.headings.length, 0),
    totalCodeBlocks: processedDocs.reduce((sum, doc) => sum + doc.metadata.codeBlocks.length, 0),
  };
  
  process.stdout.write(`Processed ${stats.total} documents\n`);
  process.stdout.write(`Total headings: ${stats.totalHeadings}\n`);
  process.stdout.write(`Total code blocks: ${stats.totalCodeBlocks}\n`);
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});

