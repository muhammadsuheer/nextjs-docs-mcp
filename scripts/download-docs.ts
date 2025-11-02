#!/usr/bin/env node
/**
 * Fast parallel documentation downloader for Vercel builds
 * Downloads Next.js docs for versions 13, 14, 15, 16
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const VERSIONS = [
  { version: '16', tag: 'canary' },
  { version: '15', tag: 'v15.1.8' },
  { version: '14', tag: 'v14.2.0' },
  { version: '13', tag: 'v13.5.0' },
];

async function downloadVersion(version: string, tag: string): Promise<void> {
  const folder = join(process.cwd(), `docs-data/v${version}`);
  
  console.log(`📥 Downloading Next.js v${version}...`);
  
  try {
    // Create folder
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }
    
    // Initialize git repo
    execSync('git init -q', { cwd: folder, stdio: 'pipe' });
    execSync('git remote add origin https://github.com/vercel/next.js.git', { cwd: folder, stdio: 'pipe' });
    execSync('git config core.sparseCheckout true', { cwd: folder, stdio: 'pipe' });
    
    // Setup sparse checkout
    const sparseCheckoutPath = join(folder, '.git', 'info', 'sparse-checkout');
    const fs = await import('fs/promises');
    await fs.writeFile(sparseCheckoutPath, 'docs/*\n');
    
    // Pull only docs folder
    execSync(`git pull --depth 1 -q origin ${tag}`, { 
      cwd: folder, 
      stdio: 'pipe',
      timeout: 120000 // 2 minute timeout
    });
    
    console.log(`✅ v${version} downloaded`);
  } catch (error) {
    console.error(`❌ Failed to download v${version}:`, error);
    throw error;
  }
}

async function main() {
  console.log('📥 Downloading Next.js Documentation...\n');
  
  const startTime = Date.now();
  
  try {
    // Download all versions in parallel
    await Promise.all(
      VERSIONS.map(({ version, tag }) => downloadVersion(version, tag))
    );
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ All documentation downloaded in ${duration}s!`);
  } catch (error) {
    console.error('\n❌ Download failed:', error);
    process.exit(1);
  }
}

main();

