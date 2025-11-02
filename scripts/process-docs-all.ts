#!/usr/bin/env tsx
// Simple parallel documentation processor
import { processAllDocs } from '../lib/mdx-processor';
import fs from 'fs/promises';
import path from 'path';

const versions = [
  { v: '16', ver: '16.0.0', dir: 'docs-data/v16/docs' },
  { v: '15', ver: '15.1.8', dir: 'docs-data/v15/docs' },
  { v: '14', ver: '14.2.0', dir: 'docs-data/v14/docs' },
  { v: '13', ver: '13.5.0', dir: 'docs-data/v13/docs' },
];

async function processVersion(config: any) {
  const docs = await processAllDocs(config.dir);
  const metadata = docs.map(d => ({ ...d.metadata, version: config.ver }));
  
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile(
    `data/docs-metadata-v${config.v}.json`,
    JSON.stringify(metadata, null, 2)
  );
  
  console.log(`✅ v${config.v}: ${docs.length} docs processed`);
}

Promise.all(versions.map(processVersion))
  .then(() => console.log('✅ All versions processed!'))
  .catch(console.error);

