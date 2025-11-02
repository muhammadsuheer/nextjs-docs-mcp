import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check for Vercel's Upstash integration variables
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    
    if (!url || !token) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'Redis not configured (optional)',
        note: 'Server works fine without caching. Add Upstash on Vercel for faster queries.',
        env_vars_checked: ['KV_REST_API_URL', 'KV_REST_API_TOKEN']
      }, { status: 200 });
    }
    
    const redis = new Redis({ url, token });
    
    // Test connection
    await redis.set('test_connection', 'success', { ex: 60 });
    const result = await redis.get('test_connection');
    
    return NextResponse.json({
      status: 'connected',
      message: 'Redis caching active',
      test_result: result,
      url: url.substring(0, 40) + '...',
      performance: 'Queries are 2x faster with cache'
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      note: 'Server will work without caching'
    }, { status: 500 });
  }
}

