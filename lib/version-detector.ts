// Automatic Next.js version detection from package.json
import fs from 'fs/promises';
import path from 'path';

export interface VersionInfo {
  nextVersion: string;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  isCanary: boolean;
}

/**
 * Detect Next.js version from package.json in user's project
 */
export async function detectNextVersion(projectPath?: string): Promise<VersionInfo | null> {
  try {
    const pkgPath = projectPath 
      ? path.join(projectPath, 'package.json')
      : path.join(process.cwd(), 'package.json');
    
    const content = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    
    // Check dependencies and devDependencies
    const nextVersion = pkg.dependencies?.next || pkg.devDependencies?.next;
    
    if (!nextVersion) {
      return null;
    }
    
    // Parse version (handle ^, ~, >=, etc.)
    const versionMatch = nextVersion.match(/(\d+)\.(\d+)\.(\d+)/);
    if (!versionMatch) {
      return null;
    }
    
    const [, major, minor, patch] = versionMatch;
    const isCanary = nextVersion.includes('canary');
    
    return {
      nextVersion: nextVersion.replace(/[^0-9.-]/g, ''),
      majorVersion: parseInt(major, 10),
      minorVersion: parseInt(minor, 10),
      patchVersion: parseInt(patch, 10),
      isCanary,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get documentation version to use based on Next.js version
 * Maps user's Next.js version to available documentation versions
 */
export function getDocVersionForNextVersion(versionInfo: VersionInfo): string {
  const { majorVersion, minorVersion, isCanary } = versionInfo;
  
  // If canary, always use latest
  if (isCanary) {
    return 'latest';
  }
  
  // Map major versions to doc versions
  if (majorVersion >= 16) {
    return '16';
  } else if (majorVersion === 15) {
    return '15';
  } else if (majorVersion === 14) {
    return '14';
  } else if (majorVersion === 13) {
    return '13';
  }
  
  // Default to 13 for older versions
  return '13';
}

/**
 * Get all available Next.js documentation versions
 */
export function getAvailableVersions(): string[] {
  return ['13', '14', '15', '16', 'latest'];
}

/**
 * Check if a specific version is supported
 */
export function isVersionSupported(version: string): boolean {
  return getAvailableVersions().includes(version);
}

/**
 * Get version-specific documentation URL
 */
export function getVersionedDocUrl(version: string, path: string): string {
  const baseUrl = 'https://nextjs.org/docs';
  
  // Latest uses default docs
  if (version === 'latest' || version === '16') {
    return `${baseUrl}/${path}`;
  }
  
  // Older versions have version-specific paths
  return `${baseUrl}/v${version}/${path}`;
}

/**
 * Auto-detect and return appropriate version for current project
 */
export async function autoDetectDocVersion(): Promise<string> {
  const versionInfo = await detectNextVersion();
  
  if (!versionInfo) {
    // Default to latest if no Next.js found
    return 'latest';
  }
  
  return getDocVersionForNextVersion(versionInfo);
}

