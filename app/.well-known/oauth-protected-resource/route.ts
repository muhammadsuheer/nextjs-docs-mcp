import { protectedResourceHandler, metadataCorsOptionsRequestHandler } from 'mcp-handler';
import { NextResponse } from 'next/server';

/**
 * OAuth Protected Resource Metadata Endpoint
 * Required by MCP specification for OAuth-enabled servers
 * 
 * This endpoint provides metadata about the OAuth configuration,
 * including authorization server URLs and supported scopes.
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc8414
 * @see https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel
 */

// List of authorization servers that can issue valid tokens
// Update these URLs with your actual OAuth provider(s)
const AUTH_SERVER_URLS: string[] = [
  // Example: 'https://your-auth-provider.com',
  // For now, this is disabled as the server doesn't require OAuth
];

const handler = protectedResourceHandler({
  authServerUrls: AUTH_SERVER_URLS,
});

const corsHandler = metadataCorsOptionsRequestHandler();

export { handler as GET, corsHandler as OPTIONS };

/**
 * Fallback for when OAuth is not configured
 * Returns a helpful message about optional OAuth setup
 */
export async function handleNotConfigured() {
  return NextResponse.json(
    {
      message: 'OAuth not configured',
      note: 'This MCP server is publicly accessible without authentication. To enable OAuth, configure AUTH_SERVER_URLS in this file.',
      documentation: 'https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel',
    },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

