import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { DocMetadata, DocHeading, CodeBlock, ProcessedDoc } from '@/types';
import { DOCS_VERSION } from './constants';

function extractHeadings(tree: any): DocHeading[] {
  const headings: DocHeading[] = [];
  
  visit(tree, 'heading', (node: any) => {
    const text = node.children
      .filter((child: any) => child.type === 'text')
      .map((child: any) => child.value)
      .join('');
    
    if (text) {
      headings.push({
        level: node.depth,
        text,
        slug: text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      });
    }
  });
  
  return headings;
}

function extractCodeBlocks(tree: any): CodeBlock[] {
  const codeBlocks: CodeBlock[] = [];
  
  visit(tree, 'code', (node: any) => {
    if (node.value) {
      codeBlocks.push({
        language: node.lang || 'text',
        code: node.value,
        context: node.meta || '',
      });
    }
  });
  
  return codeBlocks;
}

function getCategoryFromPath(filePath: string): DocMetadata['category'] {
  if (filePath.includes('/01-app/') || filePath.includes('app-router')) {
    return 'app-router';
  }
  if (filePath.includes('/02-pages/') || filePath.includes('pages-router')) {
    return 'pages-router';
  }
  if (filePath.includes('api-reference')) {
    return 'api-reference';
  }
  if (filePath.includes('architecture')) {
    return 'architecture';
  }
  return 'community';
}

function extractTitle(frontMatter: any, content: string): string {
  if (frontMatter.title) return frontMatter.title;
  
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1];
  
  return 'Untitled';
}

function cleanContent(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateExcerpt(content: string, maxLength: number = 200): string {
  const cleaned = cleanContent(content);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + '...';
}

function generateId(filePath: string): string {
  return filePath
    .replace(/\.mdx?$/, '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+/g, '-');
}

export async function processMdxFile(filePath: string, relativePath: string): Promise<ProcessedDoc> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data: frontMatter, content } = matter(fileContent);
  
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .parse(content);
  
  const headings = extractHeadings(tree);
  const codeBlocks = extractCodeBlocks(tree);
  const category = getCategoryFromPath(relativePath);
  const title = extractTitle(frontMatter, content);
  const description = frontMatter.description || generateExcerpt(content, 150);
  const id = generateId(relativePath);
  
  const urlPath = relativePath
    .replace(/\.mdx?$/, '')
    .replace(/\\/g, '/')
    .replace(/\/index$/, '');
  
  const metadata: DocMetadata = {
    id,
    path: relativePath,
    title,
    description,
    category,
    version: DOCS_VERSION,
    headings,
    codeBlocks,
    content: cleanContent(content),
    excerpt: generateExcerpt(content),
    url: `https://nextjs.org/docs/${urlPath}`,
  };
  
  return {
    metadata,
    rawContent: content,
    frontMatter,
    searchableContent: `${title} ${description} ${cleanContent(content)}`,
  };
}

export async function findMdxFiles(dir: string, baseDir: string = dir): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findMdxFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch {
    return files;
  }
  
  return files;
}

export async function processAllDocs(docsDir: string): Promise<ProcessedDoc[]> {
  const mdxFiles = await findMdxFiles(docsDir);
  const processedDocs: ProcessedDoc[] = [];
  
  for (const filePath of mdxFiles) {
    try {
      const relativePath = path.relative(docsDir, filePath);
      const doc = await processMdxFile(filePath, relativePath);
      processedDocs.push(doc);
    } catch {
      continue;
    }
  }
  
  return processedDocs;
}
