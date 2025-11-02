import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { DocumentSearchEngine } from '../lib/search-engine';
import { DOCS_METADATA_PATH, SEARCH_INDEX_PATH } from '../lib/constants';
import type { DocMetadata } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function main() {
  const metadataPath = path.join(projectRoot, DOCS_METADATA_PATH);
  
  try {
    await fs.access(metadataPath);
  } catch {
    throw new Error(`Metadata file not found: ${metadataPath}`);
  }
  
  const metadataContent = await fs.readFile(metadataPath, 'utf-8');
  const docs: DocMetadata[] = JSON.parse(metadataContent);
  
  const searchEngine = new DocumentSearchEngine();
  searchEngine.addDocuments(docs);
  
  const stats = searchEngine.getStats();
  
  const indexData = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    totalDocs: stats.totalDocuments,
    categories: stats.categories,
    versions: stats.versions,
  };
  
  const indexPath = path.join(projectRoot, SEARCH_INDEX_PATH);
  await fs.writeFile(
    indexPath,
    JSON.stringify(indexData, null, 2),
    'utf-8'
  );
  
  process.stdout.write(`Indexed ${stats.totalDocuments} documents\n`);
  process.stdout.write(`Versions: ${stats.versions.join(', ')}\n`);
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});

